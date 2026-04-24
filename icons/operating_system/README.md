# 💻 Operating System

The `operating_system` folder contains **SVG icons representing various operating systems (OS)**.  
These icons are used across the platform wherever an OS needs to be visually represented — such as device details, filters, dashboards, or recognition views.

---

## Structure

This folder is currently **flat** — it contains SVG icons for each supported operating system.

All folder and file names follow the **snake_case** convention:  
- Spaces and special characters are replaced with underscores (`_`).  
- Example: `mac_os.svg`, `windows_server_2019.svg`, `debian_linux.svg`

---

- All assets are in **SVG format**.
- Typically used in:
  - Device/asset inventory UIs
  - OS filters in dashboards
  - Recognition and tagging features
- When adding a new OS icon:
  - Follow the **existing naming convention**:
    - Use all **lowercase**.
    - Replace spaces and special characters with underscores.
    - Example: `red_hat_enterprise_linux.svg`
  - Ensure the icon is **clean, lightweight, and optimized** for web usage.
  - Maintain **visual consistency** (size, stroke, and style) with existing OS icons.

---

## Maintenance
- Periodically review icons to ensure that **outdated OS versions** (e.g., deprecated Windows Server or old Linux distros) are archived or removed.
- Keep icons updated to reflect **current official branding** of each operating system.