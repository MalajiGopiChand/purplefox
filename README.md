# Purple Fox Event Planners

Responsive editorial website with 30 generated pages, 16 celebration categories, 29 distinct AI concept photographs, a filterable gallery and accessible lightbox, three design journal articles, collections comparison and a WhatsApp enquiry form.

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

The enquiry form opens a prefilled WhatsApp draft with a fallback link. Visitors review and send it themselves. No enquiries are stored by this static website. Motion respects reduced-motion preferences; slideshow playback is opt-in. Phone navigation, gallery filtering, keyboard lightbox controls and focus restoration are supported.

`npm run check` validates every generated page, local links/assets, metadata, central WhatsApp number, image alt text, unique photo usage within each page and unique image bytes. Images may appear in relevant contexts across pages, but no page repeats a photograph.

## Hosting

Existing site: https://purple-fox-celebrations.snappy-hawk-7137.chatgpt.site/

The current owner-private audience is preserved. Google Fonts has system fallbacks. The production build is in `dist/`; directory index routes and `404.html` are supported.

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
