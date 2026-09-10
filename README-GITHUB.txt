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


v1.4:
- Improved profile photo presentation for higher-quality embedded images.
- Avatar display adjusted to 88px to avoid unnecessary upscaling.
- Service-worker cache bumped so browsers fetch the new profile rendering.


v1.5:
- More robust embedded profile-image decoding.
- Supports URL-safe Base64 profile payloads from QR Studio.
- Falls back to the first letter of the name only if the embedded image is missing or invalid.
- Service-worker cache bumped to force browsers to fetch the new code.


v2.0:
- Profile photo now loads from the published HTTPS image URL inside Smart Contact data (`i`).
- Removed embedded Base64 profile-photo transport.
- If no published profile URL exists or image loading fails, the first letter of the name is shown.
- Service-worker cache bumped so deployed clients fetch the new logic.


v2.1:
- Profile avatar enlarged to 132px desktop / 118px mobile.
- Smart Contact image `i` may now be a short GitHub repository path.
- Website expands the short path into the full raw.githubusercontent.com URL at runtime.
- Existing full HTTPS image URLs remain backward compatible.


v2.2:
- Uses a real HTTPS dynamic manifest served by AXIVORA Cloudflare Worker.
- Installed app name becomes the contact person's name.
- Installed app start_url preserves that exact contact's `d` payload.
- Profile image becomes the installed app icon when available.
- Without a profile image, Worker serves an SVG icon using the person's first initial.
- Fixed Website detail mapping to use website data rather than email.


v2.3:
- Smart Contact supports a dedicated WhatsApp number (`q`) separate from call number (`p`).
- If `q` is missing, WhatsApp falls back to the call number for backward compatibility.
- WhatsApp detail appears separately only when it differs from the call number.
- Saved VCF includes the separate WhatsApp telephone when provided.
