(function initSidebarAccordionIcons(global) {
  function escapeAttr(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function renderMaskIcon(iconPath, extraClass) {
    return `<span class="svg-icon ${extraClass}" style="--icon-url: url('${escapeAttr(iconPath)}')" aria-hidden="true"></span>`;
  }

  function renderTreeFolderToggle(options = {}) {
    const {
      defaultIconPath = "../icons/icon_folder.svg",
      rightArrowPath = "../icons/icon_arrow_head_right.svg",
    } = options;

    return `
      <span class="icon-default-button">
        ${renderMaskIcon(defaultIconPath, "icon-default")}
      </span>
      <span class="icon-hover-button">
        ${renderMaskIcon(rightArrowPath, "icon-hover")}
      </span>
    `;
  }

  function renderAlertSidebarToggle(options = {}) {
    const {
      imageSrc = "",
      arrowClass = "side-icon-arrow-right",
      wrapperClass = "side-parent-toggle",
      defaultClass = "side-parent-toggle-default",
      arrowSlotClass = "side-parent-toggle-arrow",
      imageWrapClass = "side-image-icon-wrap",
      imageClass = "side-image-icon",
    } = options;

    return `
      <span class="${escapeAttr(wrapperClass)}" aria-hidden="true">
        <span class="${escapeAttr(defaultClass)} ${escapeAttr(imageWrapClass)}"><img class="${escapeAttr(imageClass)}" src="${escapeAttr(imageSrc)}" alt="" /></span>
        <span class="${escapeAttr(arrowSlotClass)} svg-icon ${escapeAttr(arrowClass)}"></span>
      </span>
    `;
  }

  global.SidebarAccordionIcons = {
    renderTreeFolderToggle,
    renderAlertSidebarToggle,
  };
})(window);
