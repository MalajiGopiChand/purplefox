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
