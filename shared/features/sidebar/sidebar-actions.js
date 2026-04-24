function addChildNode(parentNode, actionLabel) {
  const proposed = actionLabel === "New Folder"
    ? "New Folder"
    : actionLabel === "New Sub Folder"
    ? "New Sub Folder"
    : "New View";
  const name = prompt(actionLabel, proposed);
  if (!name) return;

  if (actionLabel === "New View") {
    const id = `view-${slugify(name)}-${Date.now().toString(36).slice(-4)}`;
    const snapshot = cloneSnapshot(getEffectiveSnapshot(getCurrentView()));
    state.views[id] = {
      id,
      name,
      parentId: parentNode.id,
      savedSnapshot: snapshot,
      savedMarkdown: "",
      sourceKind: "native",
      dataStatus: "aligned",
      undoStack: [],
      workingCopy: null,
      workingMarkdown: null,
      hasParkedChanges: false,
    };
    insertNodeIntoParent(parentNode.id, { id, type: "view" });
    addLog(
      "Created view",
      `${name} added inside ${parentNode.name || getView(parentNode.id).name}.`,
    );
  } else {
    const type = actionLabel === "New Folder" ? "folder" : "subfolder";
    const id = `${type}-${slugify(name)}-${Date.now().toString(36).slice(-4)}`;
    insertNodeIntoParent(parentNode.id, {
      id,
      type,
      name,
      expanded: true,
      children: [],
    });
    addLog(
      "Created container",
      `${name} added as a ${type.replace("-", " ")}.`,
    );
  }
  render();
}

function renameNode(nodeId) {
  const found = getNodeById(nodeId);
  const currentName = found.node.type === "view"
    ? getView(nodeId).name
    : found.node.name;
  state.renameNodeId = nodeId;
  state.renameValue = currentName;
  render();
}

function commitInlineRename(nodeId) {
  if (state.renameNodeId !== nodeId) return;
  const found = getNodeById(nodeId);
  if (!found) {
    cancelInlineRename();
    return;
  }
  const currentName = found.node.type === "view"
    ? getView(nodeId).name
    : found.node.name;
  const nextName = state.renameValue.trim();
  state.renameNodeId = null;
  state.renameValue = "";
  if (!nextName || nextName === currentName) {
    render();
    return;
  }
  if (found.node.type === "view") {
    const view = getView(nodeId);
    const undoEntry = createUndoEntry(view, "rename");
    view.name = nextName;
    commitUndoEntry(view, undoEntry, { group: "rename", coalesceMs: 600 });
  } else {
    found.node.name = nextName;
  }
  addLog(
    "Renamed",
    `${currentName} renamed to ${nextName}. Library metadata saved immediately.`,
  );
  render();
}

function cancelInlineRename() {
  state.renameNodeId = null;
  state.renameValue = "";
  render();
}

function duplicateView(viewId) {
  saveAsNewView(viewId);
}

function deleteNode(nodeId) {
  const found = getNodeById(nodeId);
  if (!found) return;
  if (found.node.fixed) {
    showToast("Blocked", "The default Collection cannot be deleted.");
    return;
  }
  const impactedFlagged = [];
  walkNodes([found.node], (node) => {
    if (node.type === "view" && hasViewAttention(getView(node.id))) {
      impactedFlagged.push(getView(node.id).name);
    }
  });
  const warning = impactedFlagged.length
    ? `Flagged derived or mismatched Views will be removed: ${
      impactedFlagged.join(", ")
    }`
    : "This action cannot be undone in the prototype.";
  if (!confirm(`Delete ${getDisplayName(found.node)}?\n\n${warning}`)) return;

  removeNode(nodeId);
  if (found.node.type === "view") {
    delete state.views[nodeId];
  } else {
    walkNodes([found.node], (node) => {
      if (node.type === "view") delete state.views[node.id];
    });
  }
  if (state.activeViewId === nodeId) {
    state.activeViewId = "view-network-triage";
  }
  addLog("Deleted", `${getDisplayName(found.node)} removed from the library.`);
  render();
}

function getDisplayName(node) {
  return node.type === "view" ? getView(node.id).name : node.name;
}

function removeNode(nodeId, nodes = state.tree) {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].id === nodeId) {
      nodes.splice(i, 1);
      return true;
    }
    if (nodes[i].children && removeNode(nodeId, nodes[i].children)) {
      return true;
    }
  }
  return false;
}

function insertNodeIntoParent(parentId, node) {
  const parentFound = getNodeById(parentId);
  if (!parentFound || !parentFound.node.children) return;
  parentFound.node.children.push(node);
}

function canNest(dragId, targetId) {
  if (dragId === targetId) return false;
  const target = getNodeById(targetId);
  const dragged = getNodeById(dragId);
  if (!target || !dragged) return false;
  if (target.node.type === "view") return false;
  if (isDescendant(target.node.id, dragId)) return false;
  if (dragged.node.type === "collection") return false;
  return canBeChildOf(dragged.node.type, target.node.type);
}

function canInsertBefore(dragId, targetId, siblings, index, mode) {
  if (!dragId || dragId === targetId) return false;
  const dragged = getNodeById(dragId);
  const target = getNodeById(targetId);
  if (!dragged || !target) return false;
  if (dragged.node.type === "collection") return false;
  if (mode === "append") {
    return target.node.type !== "view";
  }
  const parentType = target.parent ? target.parent.type : "root";
  return canBeChildOf(dragged.node.type, parentType);
}

function canPlaceRelative(dragId, targetId) {
  if (!dragId || dragId === targetId) return false;
  const dragged = getNodeById(dragId);
  const target = getNodeById(targetId);
  if (!dragged || !target) return false;
  if (dragged.node.type === "collection") return false;
  const parentType = target.parent ? target.parent.type : "root";
  return canBeChildOf(dragged.node.type, parentType);
}

function getRowPlacement(row, clientY, fallbackPlacement = null) {
  const rect = row.getBoundingClientRect();
  const midpoint = rect.top + rect.height / 2;
  const switchThreshold = Math.max(6, Math.min(12, rect.height * 0.22));
  if (fallbackPlacement) {
    if (clientY <= midpoint - switchThreshold) return "before";
    if (clientY >= midpoint + switchThreshold) return "after";
    return fallbackPlacement;
  }
  return clientY < midpoint ? "before" : "after";
}

function canBeChildOf(childType, parentType) {
  if (parentType === "root") return childType === "collection";
  if (parentType === "collection") {
    return childType === "view" || childType === "folder";
  }
  if (parentType === "folder") {
    return childType === "view" || childType === "subfolder";
  }
  if (parentType === "subfolder") return childType === "view";
  return false;
}

function isDescendant(targetId, maybeAncestorId) {
  const found = getNodeById(targetId);
  let cursor = found ? found.parent : null;
  while (cursor) {
    if (cursor.id === maybeAncestorId) return true;
    const parent = getNodeById(cursor.id);
    cursor = parent ? parent.parent : null;
  }
  return false;
}

function moveNodeInto(dragId, targetId) {
  const target = getNodeById(targetId);
  if (!target || !target.node.children) return;
  const dragged = detachNode(dragId);
  if (!dragged) return;
  target.node.children.push(dragged);
  addLog(
    "Moved item",
    `${getDisplayName(dragged)} moved into ${getDisplayName(target.node)}.`,
  );
  render();
}

function moveNodeBefore(dragId, targetId, logMove = true) {
  const target = getNodeById(targetId);
  if (!target) return;
  const dragged = detachNode(dragId);
  if (!dragged) return;
  const siblings = target.parent ? target.parent.children : state.tree;
  const index = siblings.findIndex((node) => node.id === targetId);
  siblings.splice(index, 0, dragged);
  if (logMove) {
    addLog(
      "Reordered item",
      `${getDisplayName(dragged)} moved near ${getDisplayName(target.node)}.`,
    );
    render();
  }
}

function moveNodeAfter(dragId, targetId, logMove = true) {
  const target = getNodeById(targetId);
  if (!target) return;
  const dragged = detachNode(dragId);
  if (!dragged) return;
  const siblings = target.parent ? target.parent.children : state.tree;
  const index = siblings.findIndex((node) => node.id === targetId);
  siblings.splice(index + 1, 0, dragged);
  if (logMove) {
    addLog(
      "Reordered item",
      `${getDisplayName(dragged)} moved near ${getDisplayName(target.node)}.`,
    );
    render();
  }
}

function detachNode(nodeId, nodes = state.tree) {
  for (let i = 0; i < nodes.length; i += 1) {
    if (nodes[i].id === nodeId) {
      return nodes.splice(i, 1)[0];
    }
    if (nodes[i].children) {
      const found = detachNode(nodeId, nodes[i].children);
      if (found) return found;
    }
  }
  return null;
}

function toggleSidebar() {
  if (typeof clearSidebarFlyoutTimers === "function") {
    clearSidebarFlyoutTimers();
  }
  if (state.sidebarFlyout) {
    state.sidebarFlyout.open = false;
    state.sidebarFlyout.hover = false;
    state.sidebarFlyout.focus = false;
  }
  state.collapsedSidebar = !state.collapsedSidebar;
  addLog(
    "Sidebar toggle",
    state.collapsedSidebar ? "Sidebar collapsed." : "Sidebar expanded.",
  );
  render();
}

toggleSidebarTopEl.addEventListener("click", toggleSidebar);
toggleSidebarSideEl.addEventListener("click", toggleSidebar);
