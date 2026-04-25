TireGuy Cloudflare Live Build - Updated Customer Website

WHAT CHANGED
- index.html was replaced with the uploaded TireGuy_Automotive_Converted.html customer website.
- The customer site is wired to Cloudflare Pages Functions for live services/settings.
- Contact submissions are sent to /api/contact and visible in admin.html.
- Diagnostics are rule-based on the public site and logged to /api/diagnostics for admin review.
- admin.html remains separate and is NOT linked from the customer website.

CLOUDFLARE UPLOAD IMPORTANT
Upload the CONTENTS of this zip at the root. Do not upload a folder that contains these files.
Root should look like:
  index.html
  admin.html
  functions/
  Image Files/
  css/
  js/
  wrangler.toml

KV SETUP
1. Cloudflare Dashboard > Storage & Databases > KV > Create namespace.
2. Name it exactly: TG_DATA
3. Go to Workers & Pages > your Pages project > Settings > Functions.
4. Add KV namespace binding:
   Variable name: TG_DATA
   KV namespace: TG_DATA
5. Save. Then create a new deployment by uploading this zip again if needed.

ADMIN
Open directly:
  https://your-site.pages.dev/admin.html
Default password:
  admin123!
Change the password after login.

SECURITY RECOMMENDATION
Use Cloudflare Zero Trust / Access to protect:
  /admin.html
  /api/admin/*
