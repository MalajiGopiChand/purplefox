# Purple Fox Event Planners

A complete, responsive static website with 26 generated pages, 16 event categories, a filterable inspiration gallery, accessible lightbox, celebration packages and a WhatsApp enquiry form. No database, login, admin panel or payment system.

## Run and build

Requires Node.js 22 or later. No npm dependencies or installation required.

```sh
npm run build
npm run check
npm start
```

Preview at http://127.0.0.1:4173. Upload `dist/` to any static host. Directory index routes must be supported; use `dist/404.html` as the error document. Site publication configuration is in `.openai/hosting.json`.

The implementation uses generated HTML, CSS and small vanilla JavaScript interactions. This keeps all pages crawlable and avoids framework/backend dependencies for this frontend-only site.

## Edit content

- `src/data.mjs`: business number, Instagram URL, event categories, gallery, package concepts and recent event records.
- `build.mjs`: shared layouts and page templates.
- `src/style.css`: colours, typography and responsive layouts.
- `src/app.js`: navigation, manual hero carousel, filters, lightbox and enquiry form.
- `dist/images/`: local WebP image assets. Keep this directory when rebuilding.

Run the build and check commands after changes. The build preserves image assets.

## Current business details

WhatsApp / phone: **+91 70755 05617**. Instagram: **https://www.instagram.com/purplefox_planners/**.

The official logo was not attached. The current header is a temporary text wordmark, not a recreation of the original logo. Replace the `brand` template in `build.mjs` with the supplied logo when available. The address, email and service area were not supplied, so none are fabricated. Customers are asked to provide their event city to confirm availability.

Package inclusions are explicitly labelled as discussion concepts; no prices, testimonials, experience statistics or completed client events are invented. Instagram links are provided without claiming a live feed or copying unverified posts.

## Add a completed event

Put approved photographs in `dist/images/` as `.webp` files. Add an object to `recentEvents` in `src/data.mjs`:

```js
{
  slug: 'approved-event-slug',
  title: 'Approved event title',
  category: 'Weddings',
  eventDate: '', // Optional, approved display date
  location: '', // Optional, approved location
  summary: 'An approved short summary.',
  description: 'An approved event story.',
  coverImage: 'photo-filename-without-extension',
  galleryImages: [
    {image:'second-photo-without-extension',alt:'Describe the actual photograph',title:'Photo caption'}
  ],
  published: true
}
```

The recent-events listing and `/recent-events/[slug]/` detail page are generated automatically. Update the global image disclosure when real photographs are added, retaining clear labels on AI samples. Customer reviews should be added only after actual approved feedback is supplied.

## Enquiry behaviour

The form validates required fields, phone digits and a non-past date. It builds an encoded message to the central WhatsApp number and opens WhatsApp. A visible fallback link remains if a browser blocks the new tab. The visitor reviews and sends the message manually. No message is automatically sent and no entry is stored by the site.

## AI assets

Six images were created with the built-in image generation tool, converted locally to WebP and included in `dist/images/`. They are clearly labelled as styling inspiration. See `IMAGE-PROMPTS.md` for the prompt set.

## Hosting and SEO

The registered Sites deployment is private by default. Public access must be configured before sharing with customers. Change `site.origin` to your final domain before rebuilding for another host. Page titles, descriptions, Open Graph metadata, organization schema, sitemap and robots are generated. Google Fonts loads Cormorant Garamond and Manrope; system fallbacks keep the site readable if unavailable.
