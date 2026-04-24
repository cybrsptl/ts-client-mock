# 🔗 Integration

The `integration` folder contains **SVG assets for third-party integrations and external services**.  
These icons are used across the platform wherever integrations need to be represented visually.

---

## Structure

The folder is divided into sub-folders based on the type of integration:

- **`general/`**  
  Generic integration icons that don’t belong to a specific app or service.

- **`hunt_apps/`**  
  Icons for applications and services integrated with **hunt workflows** or **analysis pipelines**.

- **`organization_logos/`**  
  Official logos of third-party organizations or platforms used within the app (e.g., in integration settings or connectors list).

---

- All assets are in **SVG format**.
- These icons are generally used in:
  - Integration setup screens
  - Visualization of data sources or partner services
  - App connectors and workflow builders
- When adding a new integration:
  - Follow the existing **naming convention** (use clear, lowercase, snakecase, e.g., `slack.svg`, `github.svg`).
  - Place it in the most relevant sub-folder.
  - Ensure the icon is **clean, scalable, and optimized** for web.
- Keep `organization_logos` up to date with the **latest official branding** of each service.

---

## Maintenance
- Remove outdated or deprecated integration icons to avoid confusion.
- If an integration moves from testing to production, make sure the asset is updated and referenced properly in the UI.
