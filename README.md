# Salopian Motorsport Limited

Motorcycle-focused website for Salopian Motorsport Limited, an independent motorcycle service and repair workshop in Shrewsbury.

**Live site:** https://salopianmotorsport.co.uk/

## Positioning

The site is focused on motorcycle customers in Shrewsbury. Car services and MOTs are no longer promoted.

Core services:
- Motorcycle servicing
- Motorcycle repairs
- Diagnostics and electrical fault finding
- Motorcycle tyre supply, fitting and balancing
- Engine and specialist mechanical work
- Suitable home visits by prior arrangement

Salopian Motorsport does not provide roadside breakdown or recovery services and does not carry out MOT tests.

## Site structure

- `index.html` — local motorcycle workshop homepage
- `motorcycle.html` — motorcycle services overview
- `motorcycle-servicing-shrewsbury.html` — servicing landing page
- `motorcycle-repairs-shrewsbury.html` — repairs landing page
- `motorcycle-diagnostics-shrewsbury.html` — diagnostics/electrical landing page
- `motorcycle-tyres-shrewsbury.html` — tyre landing page
- `about.html` — business positioning
- `contact.html` — contact details, map and booking-request form
- `car.html` — retired legacy car page with noindex/client redirect
- `404.html` — not-found page
- `robots.txt` / `sitemap.xml` — search-engine discovery
- `_redirects` — server-side car-page redirect on hosts that support the format

## Technology

Static HTML, CSS and vanilla JavaScript. The booking form preserves the existing Google Apps Script contract (`name`, `email`, `phone`, `subject`, `message`) while collecting motorcycle-specific fields in the browser.

## SEO foundations

- Unique titles and meta descriptions
- Canonical URLs
- Open Graph metadata
- Semantic headings and internal links
- `MotorcycleRepair` JSON-LD on the homepage
- Service JSON-LD on core service pages
- Sitemap and robots file
- Legacy car page removed from navigation and sitemap
- Shrewsbury-focused copy without doorway-location pages

## Publishing checklist

1. Confirm the preferred public email address.
2. Confirm Google Business Profile hours remain Mon–Fri 08:00–18:00 and Sat 08:00–13:00.
3. Verify the hosting provider applies `_redirects`; if not, configure a true HTTP 301 from `/car` and `/car.html` to `/`.
4. Test the booking form end-to-end against Google Apps Script.
5. Run Lighthouse / PageSpeed on the deployed preview.
6. Submit `/sitemap.xml` in Google Search Console.
