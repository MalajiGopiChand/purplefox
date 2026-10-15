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

1. `OPENAI_API_KEY`: a project API key with image-edit access and funded billing. This is the only required variable for the existing production domain.
2. Optional `PREVIEW_ALLOWED_ORIGIN`: defaults to `https://purplefox-ten.vercel.app`. Set an exact origin without trailing slash if using a different domain.
3. Optional `OPENAI_IMAGE_MODEL`: defaults to `gpt-image-1.5`.

Turnstile is removed at the owner's request. No CAPTCHA or verification keys are needed. The endpoint retains upload validation, consent, origin checking, timeouts and secret-safe errors. Origin checking is not authentication or a spending limit. Set Vercel Firewall rate limits and monitor OpenAI usage for this public paid endpoint.

Keep keys in Vercel or an ignored local `.env`, never in chat, Git or frontend assets. Revoke and replace any key exposed in chat. Without an API key the page states that generation is unavailable; it never substitutes a fake result.

Local development: put `OPENAI_API_KEY` and `PREVIEW_ALLOWED_ORIGIN=http://localhost:4173` in an ignored `.env`, then run `node --env-file=.env server.mjs`. `npm start` also works without AI configuration. `node --test preview.test.mjs` uses mocked providers and spends no API credits. Live generation still needs to be verified after credentials are configured.

The existing ChatGPT Sites static manifest does not run Vercel functions. This AI feature runs on Vercel; another static host needs a compatible backend. Provider reference: https://developers.openai.com/api/reference/resources/images/methods/edit .
