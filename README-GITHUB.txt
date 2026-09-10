AXIVORA Smart Contact PWA

Deploy path expected by QR Studio:
https://www.axivora.tech/contact/

If your AXIVORA website repository already uses Next.js + GitHub Pages:
1. Create folder: public/contact/
2. Copy ALL files from this package into public/contact/
3. Commit and push.
4. Let your normal GitHub Pages deployment finish.
5. Test: https://www.axivora.tech/contact/

If you publish the generated static site directly instead:
Create a /contact/ folder at the published site root and upload these files there.

IMPORTANT:
- Keep the final URL exactly /contact/ unless you also change smartContactUrl in QR Studio.
- HTTPS is required for PWA installation and service workers. GitHub Pages/custom domain HTTPS is suitable.
- PWA icon is always AXIVORA.
- PWA manifest name/short_name are generated dynamically from the contact Name.
