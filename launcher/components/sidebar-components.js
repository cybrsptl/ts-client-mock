(function initLauncherSidebarSOT(global) {
  const sidebarSOT = global.SidebarSOT || null;
  const ICON_CLASS_BY_KEY = {
    "icon_kebab.svg": "launcher-icon-kebab",
    "icon_meatball.svg": "launcher-icon-meatball",
    "icon_project_fill.svg": "launcher-icon-project-fill",
    "icon_demo_mode.svg": "launcher-icon-demo-mode",
    "icon_project_demo.svg": "launcher-icon-project-demo",
    "icon_upload_sidebar.svg": "launcher-icon-upload-sidebar",
    "icon_publish.svg": "launcher-icon-publish",
    "icon_feed.svg": "launcher-icon-feed",
    "icon_sensor.svg": "launcher-icon-sensor",
    "icon_place.svg": "launcher-icon-place",
  };

  function extractIconKey(iconPath) {
    if (typeof iconPath !== "string") return "";
    const match = iconPath.match(/icon_[A-Za-z0-9_-]+\.svg/i);
    return match ? match[0].toLowerCase() : "";
  }

  function createMaskIcon(iconPath, className) {
    const iconEl = document.createElement("span");
    const iconKey = extractIconKey(iconPath);
    const knownClass = ICON_CLASS_BY_KEY[iconKey] || "";
    iconEl.className = ["launcher-svg-icon", className, knownClass]
      .filter(Boolean)
      .join(" ");
    if (knownClass) {
      iconEl.style.removeProperty("--icon-url");
    } else {
      iconEl.style.setProperty("--icon-url", `url("${iconPath}")`);
    }
    iconEl.setAttribute("aria-hidden", "true");
    return iconEl;
  }

  function createSidebarRow(item, activeId, rowClassName, onSelect, options = {}) {
    const {
      actionIconPath = "../icons/icon_kebab.svg",
      ctaIconPaths = null,
      showCount = true,
      showAction = true,
      kind = "item",
      level = "item",
      expanded = false,
    } = options;

    const rowButtonEl = document.createElement("button");
    rowButtonEl.type = "button";
    rowButtonEl.className = ["btn-reset", "row", rowClassName].join(" ");
    rowButtonEl.dataset.type = kind === "section" ? "collection" : "view";
    rowButtonEl.dataset.variant = "item";
    const isActive = activeId === item.id;
    if (isActive) {
      rowButtonEl.classList.add("active");
      rowButtonEl.setAttribute("aria-current", "page");
    } else {
      rowButtonEl.removeAttribute("aria-current");
    }
    const ctaIcons = Array.isArray(ctaIconPaths)
      ? ctaIconPaths.filter(Boolean)
      : showAction
        ? [actionIconPath].filter(Boolean)
        : [];
    const hasHoverCta = ctaIcons.length > 0;
    const hasCount = !!showCount;

    if (
      sidebarSOT &&
      typeof sidebarSOT.applyRowSemantics === "function"
    ) {
      sidebarSOT.applyRowSemantics(rowButtonEl, {
        kind,
        level,
        active: isActive,
        expanded,
        hasHoverCta,
        hasCount,
      });
    }

    const contentEl = document.createElement("span");
    contentEl.className = "row-content";

    const mainEl = document.createElement("span");
    mainEl.className = "row-main";

    if (kind === "section") {
      const labelWrapEl = document.createElement("span");
      labelWrapEl.className = "collection-label-wrap";

      const labelEl = document.createElement("span");
      labelEl.className = "row-label";
      labelEl.textContent = item.label;
      labelWrapEl.appendChild(labelEl);

      const arrowEl = createMaskIcon(
        "../icons/icon_arrow_head_right.svg",
        "collection-arrow",
      );
      labelWrapEl.appendChild(arrowEl);

      mainEl.appendChild(labelWrapEl);
    } else {
      const labelGroupEl = document.createElement("span");
      labelGroupEl.className = "item-label-group with-gap";

      const treeIconEl = document.createElement("span");
      treeIconEl.className = "tree-icon";
      treeIconEl.appendChild(createMaskIcon(item.icon, "launcher-nav-icon"));
      labelGroupEl.appendChild(treeIconEl);

      const labelEl = document.createElement("span");
      labelEl.className = "row-label";
      labelEl.textContent = item.label;
      labelGroupEl.appendChild(labelEl);

      mainEl.appendChild(labelGroupEl);
    }
    contentEl.appendChild(mainEl);

    if (showCount) {
      if (
        sidebarSOT &&
        typeof sidebarSOT.createCountContainer === "function"
      ) {
        contentEl.appendChild(sidebarSOT.createCountContainer(item.count ?? ""));
      } else {
        const countEl = document.createElement("span");
        countEl.className = "count";
        countEl.textContent = String(item.count ?? "");
        contentEl.appendChild(countEl);
      }
    }

    if (ctaIcons.length) {
      const actionsEl =
        sidebarSOT &&
        typeof sidebarSOT.createCtaContainer === "function"
          ? sidebarSOT.createCtaContainer("actions")
          : document.createElement("span");
      if (!actionsEl.className) {
        actionsEl.className = "actions";
      }

      ctaIcons.forEach((iconPath) => {
        const actionShellEl = document.createElement("span");
        actionShellEl.className =
          "sidebar-action-button btn-secondary-icon size-s style-ghost";
        actionShellEl.appendChild(createMaskIcon(iconPath));
        actionsEl.appendChild(actionShellEl);
      });
      contentEl.appendChild(actionsEl);
    }

    rowButtonEl.appendChild(contentEl);

    rowButtonEl.addEventListener("click", () => {
      if (typeof onSelect === "function") {
        onSelect(item);
      }
    });

    return rowButtonEl;
  }

  function renderNav(options) {
    const { containerEl, items, activeId, onSelect } = options;
    containerEl.innerHTML = "";

    if (!items.length) {
      const emptyEl = document.createElement("div");
      emptyEl.className = "launcher-nav-empty";
      emptyEl.textContent = "No sections match this filter.";
      containerEl.appendChild(emptyEl);
      return;
    }

    renderRows({
      containerEl,
      items,
      activeId,
      onSelect,
      rowClassName: "launcher-nav-row",
      showCount: true,
      showAction: false,
      kind: "item",
      level: "item",
    });
  }

  function renderRows(options) {
    const {
      containerEl,
      items,
      activeId,
      onSelect,
      rowClassName = "launcher-nav-row",
      actionIconPath = "../icons/icon_kebab.svg",
      showCount = true,
      showAction = true,
      kind = "item",
      level = "item",
      expanded = false,
    } = options;
    containerEl.innerHTML = "";

    items.forEach((item) => {
      containerEl.appendChild(
        createSidebarRow(item, activeId, rowClassName, onSelect, {
          actionIconPath,
          showCount,
          showAction,
          kind,
          level,
          expanded,
        }),
      );
    });
  }

  function renderAccordion(options) {
    const {
      toggleButtonEl,
      bodyEl,
      open,
      items,
      activeId,
      onSelect,
      rowClassName = "launcher-favorite-row",
      actionIconPath = "../icons/icon_kebab.svg",
      showCount = false,
      showAction = false,
      kind = "item",
      level = "item",
    } = options;

    if (
      sidebarSOT &&
      typeof sidebarSOT.applyRowSemantics === "function"
    ) {
      sidebarSOT.applyRowSemantics(toggleButtonEl, {
        kind: "section",
        level: "item",
        active: false,
        expanded: open,
        hasHoverCta: false,
        hasCount: false,
      });
    }
    toggleButtonEl.dataset.type = "collection";
    toggleButtonEl.dataset.variant = "item";
    toggleButtonEl.classList.toggle("collapsed", !open);
    toggleButtonEl.setAttribute("aria-expanded", String(open));
    bodyEl.classList.toggle("is-collapsed", !open);
    bodyEl.setAttribute("aria-hidden", String(!open));

    renderRows({
      containerEl: bodyEl,
      items,
      activeId,
      onSelect,
      rowClassName,
      actionIconPath,
      showCount,
      showAction,
      kind,
      level,
    });
  }

  global.LauncherSidebarSOT = {
    renderNav,
    renderAccordion,
  };
})(window);
