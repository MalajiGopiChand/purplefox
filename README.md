# Purple Fox Event Planners

Responsive editorial website with 31 generated pages, 16 celebration categories, 29 distinct AI concept photographs, a filterable gallery and accessible lightbox, three design journal articles, collections comparison and a WhatsApp enquiry form.

## Build and preview

Requires Node.js 22+. Run `npm ci` first to install the locked React, esbuild and browser background-removal dependencies.

```sh
npm run build
npm run check
npm start
```

Preview at http://127.0.0.1:4173. Deploy configuration is in `.openai/hosting.json`. Preserve its existing project ID and the current site URL when publishing updates.

## Content and design

- `src/data.mjs`: phone, Instagram, categories, gallery and collections.
- `src/editorial.mjs`: detailed service content and design journal stories.
- `src/pages.mjs`: page layouts and content.
- `src/components.mjs`: shared accessible header, footer, cards and controls.
- `src/style.css`: responsive cream/plum design, curved imagery and restrained motion.
- `src/app.js`: navigation, optional slideshow, gallery filters, lightbox and enquiry validation.
- `build.mjs`: static pages, SEO metadata, sitemap and versioned asset URLs.
- `dist/images/`: local images preserved during builds.

The existing custom illustrated fox logo is retained. WhatsApp: +91 70755 05617. Instagram: https://www.instagram.com/purplefox_planners/.

Every photograph is labelled AI styling inspiration. No client events, testimonials, prices, address or experience statistics are invented. The former empty updates page at `/recent-events/` is now the Design journal, preserving the route. Real client work should be added only with approved photographs and accurate descriptions.

## Behaviour and checks

Event and WhatsApp enquiry forms save contact details and event preferences to Supabase before opening a WhatsApp draft. Visitors review and send the draft themselves. A saved request does not prove a WhatsApp message was sent. If saving fails, the page explains the failure and offers a direct contact link. Motion respects reduced-motion preferences; slideshow playback is opt-in. Phone navigation, gallery filtering, keyboard lightbox controls and focus restoration are supported.

`npm run check` validates every generated page, local links/assets, metadata, central WhatsApp number, image alt text, unique photo usage within each page and unique image bytes. Images may appear in relevant contexts across pages, but no page repeats a photograph.

## Hosting

Production site: https://purplefox-ten.vercel.app/

The current Vercel production origin is `https://purplefox-ten.vercel.app`. Google Fonts has system fallbacks. The production build is in `dist/`; directory index routes and `404.html` are supported.

## Browser décor try-on (replacement editor)

The old OpenAI generation API, secret-key requirements and CAPTCHA flow have been removed. `/decor-preview/` now mounts a React editor adapted from the supplied component. The rest of the site remains static.

- Upload venue and decoration photographs, or select one of six existing gallery concepts.
- Optional IMG.LY background removal runs locally; the quantized model is downloaded from its vendor CDN on first use. User photos are not uploaded.
- Drag, keyboard nudge, scale, rotate, change opacity and adjust horizontal/vertical position.
- Before/After, reset transform, clear all photos, retry background removal or keep the original.
- Export PNG, always including the decoration even when the Before view is selected.
- Raster inputs up to 12 MB / 40 megapixels, normalized to 1600px. HEIC must be exported as JPG. Animated inputs use a still frame.

`src/studio/DecorTryOn.jsx` implements the editor. `geometry.mjs` holds drawing/hit-testing math, and `studio.css` scopes its styles. `build.mjs` bundles React and lazy AI chunks with content-hashed filenames. Use `npm run build`, `npm run check`, `node --test studio.test.mjs` and `npm start`.

This is a manual 2D composition, not perspective-aware generative scene editing. Complex stage backgrounds can confuse segmentation; transparent PNG artwork is the most predictable input. Cancelling ignores the in-progress AI result; an already-started local inference may finish in the background.

The requested IMG.LY dependency is AGPL-3.0. Its license and bundled React/ONNX license notices ship in `/studio-licenses.txt`, with an editor source link in the UI. Review the AGPL obligations for your commercial distribution or obtain an alternative license from IMG.LY. No commercial license is purchased by this implementation. Upstream: https://github.com/imgly/background-removal-js .

The old server key is no longer used. Revoke the key previously pasted into chat and remove obsolete OpenAI variables from hosting settings when convenient. The Vercel build now serves a static site without a paid generation endpoint.


## Supabase studio and admin

Open `/admin/` or use **Team login** in the footer. Sign in with the confirmed `purplefox@gmail.com` account. Its password is stored only by Supabase Auth; no password or private key is shipped in this repository. Admin sessions are held in memory and end on a page reload.

- **Enquiries:** all submitted event forms and WhatsApp contact requests, search, status filters, follow-up notes and links. Counts measure saved requests, not verified WhatsApp messages or unique people. Drafts opened outside these forms cannot be tracked.
- **Event planning:** create and edit client plans with dates, venues, guests, INR budgets, status and notes. Create a plan directly from an enquiry.
- **Photos & gallery:** upload approved JPG/PNG/WebP photos up to 8 MB; publish/unpublish or delete them. Published uploads appear in a separate real-event collection on the gallery and, when selected, the matching event service page. Unpublishing hides a photo from listings; the storage bucket is public, so anyone with its existing URL can still retrieve it until deletion. Do not upload confidential photos.
- **Download Excel workbook:** a real `.xlsx` with all enquiries, event plans and photo records, frozen headers and filters. Export refreshes records first and fetches every page. Phone numbers remain text and user-entered strings are never interpreted as formulas.

### Configuration and recovery

`src/public-config.mjs` contains only the public project URL and publishable key. Override them through `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` in the deployment environment (or ignored `.env` locally). The build rejects secret/service-role keys. No private key is needed to build or run the website.

The initial project setup was applied using `supabase/migrations/202611190001_studio.sql`. For a fresh project, first create and confirm the admin account in Supabase Auth, then run this migration once in the SQL editor. It creates enquiry records, event plans, photo metadata, an image bucket, a UUID-based admin allowlist, row-level security and the submit-only enquiry function. Re-running the full initial migration on an installed project is not supported; create a new migration for future changes. Disable public signup if it is not needed by other applications using the project.

Anonymous visitors can call `submit_enquiry` but cannot read saved enquiries, plans or the admin allowlist. Only allowlisted Supabase user UUIDs can administer records or uploads. The server validates input, prevents duplicate retries by UUID, and adds a 30-second per-phone submission cooldown. For public campaigns with substantial traffic, add CAPTCHA or an edge rate limiter; the client honeypot and phone cooldown are not a complete abuse defence.

`npm run build`, `npm run check` and `npm test` cover generated pages, links, the existing décor editor and Excel value integrity. `scripts/verify-backend.mjs` can run a live integration check using hidden stdin JSON `{url,key,password}`. It verifies roles, saving/retries, private data isolation, plans and image publishing, then removes its own QA fixtures. `scripts/setup-admin.mjs` can create the specified confirmed account on a fresh project; it never resets an existing account or saves credentials. Supply credentials through its hidden stdin prompt, never command-line arguments or committed files.

Private keys pasted into chat must be rotated in Supabase. The website uses the publishable key, so rotation of private keys does not require changing browser code.

Dependency audit: the existing IMG.LY background-removal dependency brings a Zod advisory. Upgrading across incompatible Zod major versions needs a separate décor-editor compatibility review. ExcelJS's UUID dependency is overridden to a patched version.
