# Salopian Motorsport

A responsive business website for Salopian Motorsport Limited, an independent motorcycle workshop in Bicton, Shrewsbury. It brings service information, workshop details and motorcycle booking enquiries together in a straightforward customer journey.

**Website:** [salopianmotorsport.co.uk](https://salopianmotorsport.co.uk/)

## Project overview

This is a practical example of translating a small business's needs into a maintainable website. The current site covers motorcycle servicing, repairs, diagnostics, electrical work and tyres. It also explains appointment arrangements and suitable home visits. The business does not carry out MOT tests or provide roadside breakdown or recovery services.

The implementation uses HTML, CSS and vanilla JavaScript, with no framework, package installation or build step.

## What the code demonstrates

- Responsive page layouts and shared navigation, including a mobile menu with accessible button state.
- Semantic page structure, skip links, labelled form controls and live form-status feedback.
- A motorcycle enquiry form that combines bike details into the existing booking service's request format.
- Asynchronous submission, a disabled submit button while sending, and feedback for network failures.
- Search metadata, canonical URLs, Open Graph tags, structured data, a sitemap and a robots file.
- Continuity for old links through a retired car page and host-specific redirect rules.

## Run locally

From the repository folder, start a simple static server:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000). Stop the server with `Ctrl+C`. Direct `.html` links work locally; extensionless canonical URLs depend on the production host's routing.

The contact form points to the business's existing Google Apps Script service. A local preview still uses that live endpoint, so review the form without submitting test enquiries to the business.

## Repository guide

| Files | Purpose |
| --- | --- |
| `index.html` | Motorcycle workshop homepage |
| `motorcycle.html` | Services overview |
| `motorcycle-*-shrewsbury.html` | Dedicated servicing, repairs, diagnostics and tyre pages |
| `about.html` | Workshop approach and current motorcycle focus |
| `contact.html` | Contact information, map and booking-request form |
| `style.css` | Shared layout, component and responsive styles |
| `script.js` | Mobile navigation, footer year and enquiry submission |
| `car.html`, `_redirects` | Legacy car-page fallback and server redirect rules |
| `404.html` | Not-found page |
| `robots.txt`, `sitemap.xml` | Search-engine discovery |
| `.jpg`, `.png` assets | Workshop imagery and tyre-brand assets |

## Booking integration and limitations

The browser collects motorcycle details and sends the fields `name`, `email`, `phone`, `subject` and `message` to Google Apps Script. The Apps Script backend is managed separately and is not included in this repository.

Submission currently uses `mode: 'no-cors'`, which returns an opaque response. The browser cannot verify that the backend accepted or delivered an enquiry; successful completion of the fetch alone is not proof of delivery. An appointment is confirmed separately by the workshop.

## Maintenance and deployment

Serve these files from a static host. Before changing production hosting or the booking integration:

- Check the public contact details, social links and opening hours with the business.
- Check that all page links, images and mobile navigation work.
- Confirm the host redirects `/car` and `/car.html` to `/` with HTTP 301 responses. `_redirects` only applies on hosts that support that format; `car.html` also provides a browser fallback.
- Verify enquiry delivery with the business and test the failure feedback.
- Check extensionless URLs, the not-found response, metadata and sitemap on the deployed site.

Keep customer enquiries, credentials and private configuration out of Git. Business images and brand assets are included for this website; no blanket reuse licence is granted by this repository.
