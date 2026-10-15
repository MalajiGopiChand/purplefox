# Purple Fox Event Planners

Responsive editorial website with 29 generated pages, 16 celebration categories, 29 distinct AI concept photographs, a filterable gallery and accessible lightbox, three design journal articles, collections comparison and a WhatsApp enquiry form.

## Build and preview

Requires Node.js 22+. No installation or dependencies needed.

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

## AI venue preview

`/decor-preview/` lets visitors upload a venue, select one of six references and request a realistic image edit. Uploads are resized to JPEG in the browser; requests and results are not stored by this app. AI output is illustrative, not a fit/measurement guarantee. The endpoint is a Vercel Node function, independent of the static page build.

Activate in Vercel > project Settings > Environment Variables (Production), then redeploy:

1. `OPENAI_API_KEY`: a project API key with image-edit access and funded billing.
2. `TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile widget keys. Allow `purplefox-ten.vercel.app` in the widget hostname list.
3. `PREVIEW_ALLOWED_ORIGIN`: `https://purplefox-ten.vercel.app` (exact origin, no trailing slash).
4. Optional `OPENAI_IMAGE_MODEL`: defaults to `gpt-image-1.5`.

Keep keys in Vercel or an ignored local `.env`, never in chat, Git or frontend assets. Without all required settings the page explains that generation is unavailable; it never substitutes a fake result. Turnstile tokens are verified server-side, including hostname and action, and are single use. Configure provider usage alerts and Vercel Firewall rate limits before opening this paid endpoint to heavy traffic; Turnstile is bot protection, not a financial quota.

Local development: set the same variables with localhost as the allowed origin and a Turnstile widget configured for localhost, then run `node --env-file=.env server.mjs`. `npm start` works without AI configuration and shows the unavailable state. `node --test preview.test.mjs` verifies validation, no-secret errors, verification rejection, correct image order and upstream failure handling using mocked providers; it does not spend API credits. A live generation still needs to be verified after credentials are configured.

The existing ChatGPT Sites static manifest does not run Vercel functions. The AI feature is deployed on Vercel; using it on a separate static host needs its own compatible backend. Provider reference: https://developers.openai.com/api/reference/resources/images/methods/edit .
