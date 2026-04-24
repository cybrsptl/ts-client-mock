# 🪖 Military Platform

The `military_platform` folder contains **SVG assets for military-related symbols and platform representations**.  
These assets are used in maps, dashboards, and mission-based views to visualize military forces, vehicles, and structures.

---

## Structure

The folder has four main sub-folders:

- **`generic_flat/`**  
  Standard **2D military symbology** representing:
  - Ground, Sea Surface, Air & Space, and Subsurface domains  
  - Each symbol can be classified as **Friendly, Hostile, Neutral, or Unknown**  
  - Typically used in **tactical or strategic map overlays**, following standard military symbols for clarity.

- **`generic_iso/`**  
  **Isometric military symbology** for the same domains (Ground, Sea, Air & Space, Subsurface).  
  Provides a **3D-style perspective** while keeping the standard symbol semantics.  
  Often used in more **visual or immersive map modes**.

- **`platform_flat/`**  
  **Flat 2D representations** of specific **military vehicles and structures** (e.g., tanks, ships, aircraft, command centers).  
  Used as **default platform icons** where a simple and clean depiction is required.

- **`platform_iso/`**  
  **Isometric representations** of various **military vehicles and structures**.  
  Offers more **visual detail and spatial depth**, typically used for richer or illustrative map and UI views.

---

- All assets are provided in **SVG format** for scalability and consistent rendering.
- Use the appropriate style based on the use case:
  - **`generic_flat`** → for **symbolic/tactical** map overlays.
  - **`generic_iso`** → for **symbolic but more visually enhanced** map overlays.
  - **`platform_flat`** → for simple, **default vehicle/structure** representations.
  - **`platform_iso`** → for **immersive, high-fidelity** visualization.
- Follow the existing **naming convention** (e.g., `tank_friendly.svg`, `ship_hostile.svg`) for ease of search and maintenance.
- Ensure **visual consistency** (stroke width, scale, perspective) when adding new icons.

---

## Maintenance
- Regularly review assets to align with **current symbology standards** (e.g., MIL-STD-2525, NATO APP-6 if applicable).
- Archive outdated or deprecated icons in a separate folder if no longer in active use.
- Keep isometric and flat variants synchronized so that developers can switch styles easily when needed.