(function initSidebarSOT(global) {
  function rowLevelFromVariant(variant) {
    if (variant === "subitem") return "sub-item";
    if (variant === "subsubitem") return "subsub-item";
    if (variant === "subsubsubitem") return "subsubsub-item";
    return "item";
  }

  function applyRowSemantics(rowEl, options = {}) {
    if (!rowEl) return rowEl;

    const kind = options.kind === "section" ? "section" : "item";
    const level = options.level || "item";
    const active = !!options.active;
    const expanded = !!options.expanded;
    const hasHoverCta = !!options.hasHoverCta;
    const hasCount = !!options.hasCount;

    rowEl.classList.add("sidebar-item-row");
    rowEl.classList.toggle("sidebar-section-header", kind === "section");
    rowEl.classList.toggle("sidebar-item", kind !== "section");
    rowEl.classList.toggle("is-active", active);
    rowEl.classList.toggle("is-expanded", expanded);
    rowEl.classList.toggle("has-hover-cta", hasHoverCta);
    rowEl.classList.toggle("has-count", hasCount);
    rowEl.dataset.sidebarKind = kind;
    rowEl.dataset.sidebarLevel = level;
    rowEl.dataset.sidebarHoverCta = hasHoverCta ? "true" : "false";
    rowEl.dataset.sidebarHasCount = hasCount ? "true" : "false";

    return rowEl;
  }

  function createCountContainer(value) {
    const wrapperEl = document.createElement("span");
    wrapperEl.className = "count-container";

    const countEl = document.createElement("span");
    countEl.className = "count";
    countEl.textContent = value == null ? "" : String(value);
    wrapperEl.appendChild(countEl);

    return wrapperEl;
  }

  function createCtaContainer(baseClassName = "actions") {
    const ctaEl = document.createElement("span");
    ctaEl.className = [baseClassName, "cta-container"].filter(Boolean).join(" ");
    return ctaEl;
  }

  global.SidebarSOT = {
    applyRowSemantics,
    createCountContainer,
    createCtaContainer,
    rowLevelFromVariant,
  };
})(window);
