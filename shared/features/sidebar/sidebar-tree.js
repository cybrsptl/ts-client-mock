const sidebarSOT = window.SidebarSOT || null;
const TREE_REORDER_EASE = "180ms cubic-bezier(0.2, 0.72, 0.18, 1)";
const TREE_REORDER_TARGET_STICKY_PADDING = 8;

function isSameNodePlacement(a, b) {
  return !!a && !!b && a.parentId === b.parentId && a.index === b.index;
}

function captureTreeNodeRects() {
  if (!treeEl) return new Map();
  const rects = new Map();
  treeEl.querySelectorAll(".tree-node[data-id]").forEach((nodeEl) => {
    rects.set(nodeEl.dataset.id, nodeEl.getBoundingClientRect());
  });
  return rects;
}

function animateTreeReflow(previousRects) {
  if (!treeEl || !previousRects?.size) return;
  treeEl.querySelectorAll(".tree-node[data-id]").forEach((nodeEl) => {
    const previousRect = previousRects.get(nodeEl.dataset.id);
    if (!previousRect) return;
    const nextRect = nodeEl.getBoundingClientRect();
    const deltaX = previousRect.left - nextRect.left;
    const deltaY = previousRect.top - nextRect.top;
    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;
    nodeEl.style.transition = "none";
    nodeEl.style.transform = `translate(${Math.round(deltaX)}px, ${
      Math.round(deltaY)
    }px)`;
    requestAnimationFrame(() => {
      nodeEl.style.transition = `transform ${TREE_REORDER_EASE}`;
      nodeEl.style.transform = "";
    });
    const cleanup = () => {
      nodeEl.style.transition = "";
      nodeEl.removeEventListener("transitionend", cleanup);
    };
    nodeEl.addEventListener("transitionend", cleanup, { once: true });
  });
}

function getNodePlacement(nodeId) {
  const found = getNodeById(nodeId);
  if (!found) return null;
  const siblings = found.parent ? found.parent.children : state.tree;
  return {
    parentId: found.parent ? found.parent.id : null,
    index: siblings.findIndex((node) => node.id === nodeId),
  };
}

function canStartSidebarDrag(node, event) {
  if (state.collapsedSidebar || state.sidebarFlyout?.open) return false;
  if (state.renameNodeId === node.id) return false;
  if (node.type === "collection" && node.fixed) return false;
  if (!event.isPrimary || event.button !== 0) return false;
  if (event.target.closest("button, input, textarea")) return false;
  return true;
}

function ensureSidebarDragGhost() {
  if (dragGhostEl) return dragGhostEl;
  dragGhostEl = document.createElement("div");
  dragGhostEl.className = "sidebar-drag-ghost";
  dragGhostEl.setAttribute("aria-hidden", "true");
  document.body.appendChild(dragGhostEl);
  return dragGhostEl;
}

function hideSidebarDragGhost() {
  if (!dragGhostEl) return;
  dragGhostEl.classList.remove("visible");
  dragGhostEl.innerHTML = "";
}

function positionSidebarDragGhost(clientX, clientY) {
  if (!dragging?.active) return;
  const nextX = clientX - dragging.grabOffsetX;
  const nextY = clientY - dragging.grabOffsetY;
  const ghost = ensureSidebarDragGhost();
  ghost.style.transform = `translate(${Math.round(nextX)}px, ${
    Math.round(nextY)
  }px)`;
}

function startSidebarDrag(event) {
  if (!dragging || dragging.active) return;
  const sourceRow = document.querySelector(`.row[data-id="${dragging.id}"]`);
  const ghost = ensureSidebarDragGhost();
  ghost.innerHTML = "";
  ghost.style.width = `${dragging.width}px`;
  ghost.style.height = `${dragging.height}px`;
  if (sourceRow) {
    const clone = sourceRow.cloneNode(true);
    clone.classList.remove("active", "context-open", "is-drag-source");
    clone.classList.add("sidebar-drag-ghost-row");
    ghost.appendChild(clone);
  }
  ghost.classList.add("visible");
  closeMenus();
  dragging.active = true;
  document.body.classList.add("sidebar-reordering");
  positionSidebarDragGhost(event.clientX, event.clientY);
  syncParentIds(state);
  renderTree(false);
}

function autoScrollSidebarWhileDragging(clientY) {
  if (!treeEl) return;
  const rect = treeEl.getBoundingClientRect();
  if (clientY < rect.top || clientY > rect.bottom) return;
  const edgeThreshold = 28;
  let delta = 0;
  if (clientY < rect.top + edgeThreshold) {
    delta = -Math.ceil((rect.top + edgeThreshold - clientY) / 6);
  } else if (clientY > rect.bottom - edgeThreshold) {
    delta = Math.ceil((clientY - (rect.bottom - edgeThreshold)) / 6);
  }
  if (!delta) return;
  treeEl.scrollTop += Math.max(-18, Math.min(18, delta));
}

function getSidebarRowAtPoint(clientX, clientY) {
  if (!treeEl) return null;
  const rect = treeEl.getBoundingClientRect();
  if (
    clientX < rect.left ||
    clientX > rect.right ||
    clientY < rect.top ||
    clientY > rect.bottom
  ) {
    return null;
  }
  if (dragging?.hoverTargetId) {
    const stickyRow = treeEl.querySelector(
      `.row[data-id="${dragging.hoverTargetId}"]`,
    );
    if (stickyRow && stickyRow.dataset.id !== dragging?.id) {
      const stickyRect = stickyRow.getBoundingClientRect();
      if (
        clientY >= stickyRect.top - TREE_REORDER_TARGET_STICKY_PADDING &&
        clientY <= stickyRect.bottom + TREE_REORDER_TARGET_STICKY_PADDING
      ) {
        return stickyRow;
      }
    }
  }
  const directEl = document.elementFromPoint(clientX, clientY);
  const directRow = directEl?.closest?.(".row[data-id]");
  if (directRow && directRow.dataset.id !== dragging?.id) {
    return directRow;
  }
  const rows = [...treeEl.querySelectorAll(".row[data-id]")]
    .filter((rowEl) => rowEl.dataset.id !== dragging?.id);
  if (!rows.length) return null;
  if (clientY <= rows[0].getBoundingClientRect().top) {
    return rows[0];
  }
  if (clientY >= rows[rows.length - 1].getBoundingClientRect().bottom) {
    return rows[rows.length - 1];
  }
  return null;
}

function applySidebarDragPlacement(clientX, clientY) {
  if (!dragging?.active) return;
  const targetRow = getSidebarRowAtPoint(clientX, clientY);
  if (!targetRow) return;
  const targetId = targetRow.dataset.id;
  if (!targetId || targetId === dragging.id) return;
  if (!canPlaceRelative(dragging.id, targetId)) return;
  const previousPlacement = dragging.hoverTargetId === targetId
    ? dragging.hoverPlacement
    : null;
  const placement = getRowPlacement(targetRow, clientY, previousPlacement);
  const previewKey = `${dragging.id}:${targetId}:${placement}`;
  if (dragPreviewKey === previewKey) return;
  if (placement === "before") {
    moveNodeBefore(dragging.id, targetId, false);
  } else {
    moveNodeAfter(dragging.id, targetId, false);
  }
  dragPreviewKey = previewKey;
  dragging.hoverTargetId = targetId;
  dragging.hoverPlacement = placement;
  syncParentIds(state);
  renderTree(true);
}

function finishSidebarDrag(event) {
  if (!dragging) return;
  if (event && dragging.pointerId !== event.pointerId) return;
  const session = dragging;
  const wasActive = !!session.active;
  const moved = wasActive &&
    !isSameNodePlacement(session.origin, getNodePlacement(session.id));
  dragging = null;
  dragPreviewKey = null;
  document.body.classList.remove("sidebar-reordering");
  hideSidebarDragGhost();
  if (!wasActive) return;
  suppressTreeClickUntil = Date.now() + 240;
  syncParentIds(state);
  if (moved) {
    const currentNode = getNodeById(session.id)?.node;
    if (currentNode) {
      addLog(
        "Reordered item",
        `${getDisplayName(currentNode)} rearranged in the sidebar.`,
      );
    }
  }
  render();
}

function handleSidebarDragPointerMove(event) {
  if (!dragging || dragging.pointerId !== event.pointerId) return;
  const travelX = event.clientX - dragging.startX;
  const travelY = event.clientY - dragging.startY;
  if (!dragging.active && Math.hypot(travelX, travelY) < 4) return;
  if (!dragging.active) {
    startSidebarDrag(event);
  }
  event.preventDefault();
  autoScrollSidebarWhileDragging(event.clientY);
  positionSidebarDragGhost(event.clientX, event.clientY);
  applySidebarDragPlacement(event.clientX, event.clientY);
}

window.addEventListener("pointermove", handleSidebarDragPointerMove);
window.addEventListener("pointerup", finishSidebarDrag);
window.addEventListener("pointercancel", finishSidebarDrag);

function renderTree(animate = false) {
  const previousRects = animate ? captureTreeNodeRects() : null;
  treeEl.innerHTML = "";
  const fragment = document.createDocumentFragment();
  const visibleTree = getFilteredTree(state.tree, state.filterQuery);
  visibleTree.forEach((node, index) => {
    fragment.appendChild(renderNode(node, 0, visibleTree, index));
  });
  treeEl.appendChild(fragment);
  if (animate) {
    animateTreeReflow(previousRects);
  }
}

function getFilteredTree(nodes, query) {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return nodes;

  return nodes
    .map((node) => {
      const label = getNodeLabel(node).toLowerCase();
      const childMatches = node.children
        ? getFilteredTree(node.children, trimmed)
        : [];
      if (label.includes(trimmed) || childMatches.length) {
        return {
          ...node,
          children: node.children ? childMatches : undefined,
        };
      }
      return null;
    })
    .filter(Boolean);
}

function renderNode(node, depth, siblings, index) {
  const wrapper = document.createElement("div");
  wrapper.className = `tree-node ${node.type}`;
  wrapper.dataset.id = node.id;
  wrapper.style.setProperty("--depth", depth);

  const row = document.createElement("div");
  row.className = "row";
  row.style.setProperty("--depth", depth);
  row.dataset.id = node.id;
  row.dataset.type = node.type;
  row.dataset.variant = getRowVariant(node, depth);
  row.draggable = false;
  if (dragging?.active && dragging.id === node.id) {
    row.classList.add("is-drag-source");
  }

  const isActiveViewRow = node.type === "view" &&
    state.activeViewId === node.id;
  const isExpandedRow = !!(node.children && node.expanded !== false);
  const rowActions = getRowActions(node);
  const hasCount = node.type !== "view";
  const hasHoverCta = rowActions.length > 0;
  let children = null;

  if (
    sidebarSOT &&
    typeof sidebarSOT.applyRowSemantics === "function"
  ) {
    sidebarSOT.applyRowSemantics(row, {
      kind: node.type === "collection" ? "section" : "item",
      level: node.type === "collection"
        ? "item"
        : typeof sidebarSOT.rowLevelFromVariant === "function"
        ? sidebarSOT.rowLevelFromVariant(row.dataset.variant)
        : row.dataset.variant,
      active: isActiveViewRow,
      expanded: isExpandedRow,
      hasHoverCta,
      hasCount,
    });
  }

  if (node.children && node.children.length) {
    row.classList.add("has-children");
  }

  if (isActiveViewRow) {
    row.classList.add("active");
  }
  if (menuAnchorId === node.id) {
    row.classList.add("context-open");
  }
  if (node.children) {
    row.setAttribute("aria-expanded", isExpandedRow ? "true" : "false");
  }

  row.addEventListener("click", () => {
    if (Date.now() < suppressTreeClickUntil) return;
    if (state.renameNodeId === node.id) return;
    if (node.type === "view") {
      activateView(node.id);
    } else if (node.children) {
      const sourceNode = getNodeById(node.id)?.node || node;
      const nextExpanded = sourceNode.expanded === false;
      sourceNode.expanded = nextExpanded;
      node.expanded = nextExpanded;
      syncTreeNodeExpansion(row, children, nextExpanded);
    }
  });

  row.addEventListener("pointerdown", (event) => {
    if (!canStartSidebarDrag(node, event)) return;
    const rect = row.getBoundingClientRect();
    dragging = {
      id: node.id,
      type: node.type,
      pointerId: event.pointerId,
      active: false,
      hoverTargetId: null,
      hoverPlacement: null,
      origin: getNodePlacement(node.id),
      startX: event.clientX,
      startY: event.clientY,
      grabOffsetX: event.clientX - rect.left,
      grabOffsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
    dragPreviewKey = null;
  });

  const content = document.createElement("div");
  content.className = "row-content";

  const main = document.createElement("div");
  main.className = "row-main";
  if (row.dataset.variant !== "item" && node.type !== "collection") {
    main.classList.add("nested");
  }

  const trackCount = getTrackCount(row.dataset.variant);
  if (trackCount > 0) {
    const tracks = document.createElement("div");
    tracks.className = "indent-tracks";
    for (let i = 0; i < trackCount; i += 1) {
      const track = document.createElement("div");
      track.className = "indent-track";
      tracks.appendChild(track);
    }
    main.appendChild(tracks);
  }

  if (node.type !== "collection") {
    const labelGroup = document.createElement("div");
    labelGroup.className = "item-label-group with-gap";

    const icon = document.createElement("div");
    icon.className = "tree-icon";
    icon.innerHTML = getNodeIconMarkup(node);
    labelGroup.appendChild(icon);

    labelGroup.appendChild(renderLabelContent(node));

    main.appendChild(labelGroup);
  } else if (node.type === "collection") {
    const labelWrap = document.createElement("div");
    labelWrap.className = "collection-label-wrap";

    labelWrap.appendChild(renderLabelContent(node));

    const arrow = document.createElement("div");
    arrow.className = "collection-arrow";
    arrow.innerHTML = collectionArrowSvg("right");
    labelWrap.appendChild(arrow);

    main.appendChild(labelWrap);
  }

  content.appendChild(main);

  if (hasCount) {
    if (
      sidebarSOT &&
      typeof sidebarSOT.createCountContainer === "function"
    ) {
      content.appendChild(sidebarSOT.createCountContainer(countViews(node)));
    } else {
      const count = document.createElement("div");
      count.className = "count";
      count.textContent = countViews(node);
      content.appendChild(count);
    }
  } else {
    const view = getView(node.id);
    if (hasViewAttention(view) && state.activeViewId !== node.id) {
      const dotSlot = document.createElement("div");
      dotSlot.className = "dot-slot";
      const dot = document.createElement("div");
      dot.className = "dot";
      dotSlot.appendChild(dot);
      content.appendChild(dotSlot);
    }
  }

  if (rowActions.length) {
    const actions =
      sidebarSOT && typeof sidebarSOT.createCtaContainer === "function"
        ? sidebarSOT.createCtaContainer("actions")
        : document.createElement("div");
    if (!actions.className) {
      actions.className = "actions";
    }
    rowActions.forEach((action) => {
      const button = document.createElement("button");
      button.className =
        "btn-reset btn-secondary-icon size-s style-ghost sidebar-action-button menu-anchor-button";
      button.type = "button";
      button.innerHTML = action.icon;
      button.title = action.title;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        action.onClick(event.currentTarget, node);
      });
      actions.appendChild(button);
    });
    content.appendChild(actions);
  }
  row.appendChild(content);

  wrapper.appendChild(row);

  if (node.children) {
    children = document.createElement("div");
    children.className = `tree-children${isExpandedRow ? "" : " is-collapsed"}`;
    children.setAttribute("aria-hidden", isExpandedRow ? "false" : "true");

    const childrenInner = document.createElement("div");
    childrenInner.className = "tree-children-inner";

    node.children.forEach((child, childIndex) => {
      childrenInner.appendChild(
        renderNode(child, depth + 1, node.children, childIndex),
      );
    });

    children.appendChild(childrenInner);
    wrapper.appendChild(children);
  }

  return wrapper;
}

function syncTreeNodeExpansion(rowEl, childrenEl, expanded) {
  if (rowEl) {
    rowEl.classList.toggle("is-expanded", expanded);
    rowEl.setAttribute("aria-expanded", expanded ? "true" : "false");
  }
  if (childrenEl) {
    childrenEl.classList.toggle("is-collapsed", !expanded);
    childrenEl.setAttribute("aria-hidden", expanded ? "false" : "true");
  }
}

function getRowActions(node) {
  if (state.renameNodeId === node.id) {
    return [];
  }
  if (node.type === "collection") {
    return [
      {
        icon: iconImg("../icons/icon_add.svg"),
        title: "Add",
        onClick: (anchor) => openMenu(anchor, buildAddMenu(node)),
      },
    ];
  }
  if (node.type === "folder" || node.type === "subfolder") {
    return [
      {
        icon: iconImg("../icons/icon_add.svg"),
        title: "Add",
        onClick: (anchor) => openMenu(anchor, buildAddMenu(node)),
      },
      {
        icon: iconImg("../icons/icon_meatball.svg"),
        title: "More",
        onClick: (anchor) => openMenu(anchor, buildContextMenu(node)),
      },
    ];
  }
  if (node.type === "view") {
    return [
      {
        icon: iconImg("../icons/icon_meatball.svg"),
        title: "View actions",
        onClick: (anchor) => openMenu(anchor, buildContextMenu(node)),
      },
    ];
  }
  return [];
}

function buildAddMenu(node) {
  menuAnchorId = node.id;
  return getAllowedAddItems(node).map((item) => ({
    label: item,
    onClick: () => addChildNode(node, item),
  }));
}

function getAllowedAddItems(node) {
  if (node.type === "collection") return ["New View", "New Folder"];
  if (node.type === "folder") return ["New View", "New Sub Folder"];
  if (node.type === "subfolder") return ["New View"];
  return [];
}

function buildContextMenu(node) {
  menuAnchorId = node.id;
  if (node.type === "view") {
    return [
      { label: "Rename", onClick: () => renameNode(node.id) },
      { label: "Duplicate", onClick: () => duplicateView(node.id) },
      { type: "divider" },
      { label: "Delete", onClick: () => deleteNode(node.id) },
    ];
  }
  return [
    { label: "Rename", onClick: () => renameNode(node.id) },
    { type: "divider" },
    { label: "Delete", onClick: () => deleteNode(node.id) },
  ];
}

function getNodeIconMarkup(node) {
  if (node.type === "folder" || node.type === "subfolder") {
    if (
      window.SidebarAccordionIcons &&
      typeof window.SidebarAccordionIcons.renderTreeFolderToggle === "function"
    ) {
      return window.SidebarAccordionIcons.renderTreeFolderToggle({
        defaultIconPath: "../icons/icon_folder.svg",
        expanded: node.expanded !== false,
        rightArrowPath: "../icons/icon_arrow_head_right.svg",
        downArrowPath: "../icons/icon_arrow_head_down.svg",
      });
    }
    return `
      <span class="icon-default-button">
        ${svgMaskMarkup("../icons/icon_folder.svg", "icon-default")}
      </span>
      <span class="icon-hover-button">
        ${svgMaskMarkup("../icons/icon_arrow_head_right.svg", "icon-hover")}
      </span>
    `;
  }
  return `
          <span class="icon-default-button">
            ${svgMaskMarkup("../icons/icon_layout_right.svg", "icon-default")}
          </span>
        `;
}

function getRowVariant(node, depth) {
  if (node.type === "collection") return "collection";
  if (depth <= 1) return "item";
  if (depth === 2) return "subitem";
  if (depth === 3) return "subsubitem";
  return "subsubsubitem";
}

function getTrackCount(variant) {
  if (variant === "subitem") return 1;
  if (variant === "subsubitem") return 2;
  if (variant === "subsubsubitem") return 3;
  return 0;
}

function getNodeLabel(node) {
  if (node.type === "view") return getView(node.id).name;
  return node.name;
}

function renderLabelContent(node) {
  if (state.renameNodeId === node.id) {
    const input = document.createElement("input");
    input.className = "row-rename-input";
    input.type = "text";
    input.value = state.renameValue;
    input.setAttribute("aria-label", `Rename ${getNodeLabel(node)}`);
    input.addEventListener("click", (event) => event.stopPropagation());
    input.addEventListener("mousedown", (event) => event.stopPropagation());
    input.addEventListener("input", (event) => {
      state.renameValue = event.target.value;
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        commitInlineRename(node.id);
      } else if (event.key === "Escape") {
        event.preventDefault();
        cancelInlineRename();
      }
    });
    input.addEventListener("blur", () => {
      commitInlineRename(node.id);
    });
    setTimeout(() => {
      if (state.renameNodeId === node.id) {
        input.focus();
        input.select();
      }
    }, 0);
    return input;
  }

  const label = document.createElement("div");
  label.className = "row-label";
  label.textContent = getNodeLabel(node);
  if (node.type === "view") {
    label.addEventListener("dblclick", (event) => {
      event.stopPropagation();
      renameNode(node.id);
    });
  }
  return label;
}

function countViews(node) {
  let count = 0;
  walkNodes([node], (child) => {
    if (child.type === "view") count += 1;
  });
  return count;
}
