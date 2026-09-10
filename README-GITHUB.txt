AXIVORA Smart Contact PWA v1.1

Upload ALL files to the root of your GitHub Pages repository:
- index.html
- styles.css
- app.js
- sw.js
- manifest.webmanifest
- axivora-logo.png
- icon-192.png
- icon-512.png

GitHub Pages:
Settings -> Pages -> Deploy from a branch -> main -> /(root)

Production URL:
https://contactaxivora.github.io/axivora-smart-contact/

IMPORTANT:
The installed PWA name is AXIVORA Smart Contact and the icon is AXIVORA.
The contact person's name is dynamic inside the page and browser title.
A different installed app name for every contact cannot be reliably provided by static GitHub Pages because the Web App Manifest must be served as a real same-origin file. That feature requires a dynamic backend/serverless manifest endpoint.


v1.2:
- Empty contact fields are hidden from the UI.
- Website button disappears if Website is empty.
- Email button disappears if Email is empty.
- Company/Job Title rows disappear if empty.
- Empty detail blocks no longer leave blank space.


v1.3:
- Supports optional embedded profile image from the Smart Contact QR `i` parameter.
- If image exists, it replaces the initial avatar.
- If image is missing or invalid, the first letter of the contact name is shown automatically.
- No backend or image hosting is required.
