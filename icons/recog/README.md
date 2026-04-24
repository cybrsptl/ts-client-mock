# 🔎 Recog

The `recog` folder contains **SVG icons used to visually represent recognized entities and their metadata**.  
These icons are primarily used in recognition engines, inventory lists, inspector panels, and related UI components.

---

## Structure

The folder is organized into the following sub-folders:

- **`app/`**  
  Icons representing **applications** detected or recognized by the platform.

- **`device/`**  
  Icons for **recognized hardware devices**.

- **`fields/`**  
  Icons for **specific data fields** or attributes extracted during recognition.

- **`hw_family/`**  
  Icons representing **families of hardware** (e.g., a series or product line).

- **`hw_product/`**  
  Icons for **specific hardware products**.

- **`mac_hw_vendor/`**  
  Icons representing **MAC address hardware vendors**.

- **`os/`**  
  Icons for **recognized operating systems**.

- **`vendor/`**  
  Icons for **general vendor representations** not tied to a single product or hardware type.

---

- All assets are in **SVG format**.
- **Naming convention:**  
  - Use **snake_case** for all file names and folders.  
  - Replace spaces and special characters with underscores.  
  - Examples:  
    - `cisco_ios.svg`  
    - `intel_nuc.svg`  
    - `mac_hw_vendor.svg`

---

## Maintenance
- Regularly update icons to reflect **current vendor logos, device families, and OS versions**.
- Avoid duplications by checking existing icons before adding new ones.
- Optimize SVGs to keep them **lightweight for web use**.
- Archive deprecated icons in a separate folder if no longer in active use.