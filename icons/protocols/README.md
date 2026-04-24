# 📡 Protocols

The `protocols` folder contains **SVG icons for network protocols and related classifications**.  
These icons are primarily used in timeline visualizations, inventory views, and protocol-related inspectors.

---

## Structure

The folder is organized into the following sub-folders:

- **`general/`**  
  Miscellaneous protocol-related icons that don’t fit into the more specific categories below.

- **`protocol_family/`**  
  Icons for **protocol families or groups** (e.g., TCP, UDP, ICMP).  
  **Used in:** Timeline **primary layer** (for grouping events by protocol type).

- **`protocol_tag/`**  
  Tag-style icons for **inventory and inspector views**, representing protocol types associated with devices or captured traffic.  
  **Used in:** **Inventory** and **Inspector** panels.

- **`technical/`**  
  Contains **specialized or lower-level technical protocol icons** (e.g., rare or legacy protocols).  
  These are usually used internally or for extended protocol support.

---

- All icons are in **SVG format**.
- **Naming convention:**  
  - Use **snake_case** for all file names and folders.  
  - Replace spaces and special characters with underscores.  
  - Example: `http.svg`, `tcp_ip.svg`, `ssh_tag.svg`

---

## Maintenance
- Keep the icon set **lightweight and optimized** for web use.  
- Periodically review to:
  - Remove deprecated or unused protocol icons.
  - Add new protocol or family icons as the platform supports them.
- Ensure consistent **visual style and size** across all categories.
