# Ars widget customer-beta installation — inactive preparation

This branch prepares an opt-in assistant in the existing website design. It is **not a customer-beta release**: `ARS_WIDGET_BETA.enabled` is `false`, the public embed token is empty and the reviewed privacy-notice URL is empty. In this state the integration creates no interface, loads no Ars script and makes no Ars request. Existing pages, navigation and the Google Apps Script enquiry form are unchanged.

## Prepared behavior

The existing shared `script.js` inserts a small section before the footer only when the complete configuration is valid on exact `https://salopianmotorsport.co.uk` or `https://www.salopianmotorsport.co.uk`. GitHub Pages, Netlify preview domains, localhost, non-HTTPS and non-standard ports fail closed.

“About the beta assistant” reveals the beta/data-handling notice and the reviewed privacy link. Only “Start beta assistant” loads `https://app.arsstataria.co.uk/widget.js`. Merely visiting a page or reading the notice makes no Ars request. Native buttons support keyboard activation; Escape or “Not now” closes the notice and returns focus. A failed script load leaves the normal workshop contact routes available. Repeated activation cannot append another widget script.

The agreed scope is **enquiries and service questions only**, with staff-reviewed handoffs. Booking creation, rescheduling, cancellation, portal-access requests, payments and automatic email/SMS are outside this mode and must be blocked server-side. The notice names Alex Byrne as the reviewer and records the approved **30-day raw beta chat policy**, with necessary enquiry details kept separately. The published privacy notice must describe the accepted manual retention procedure, separate provider/log/backup handling and privacy contact `info@salopianmotorsport.co.uk`; it must not promise automatic expiry. Enquiry-mode browser display is in memory only in the focused candidate and must be verified before release.

A script `load` event proves only that JavaScript loaded. It does not prove a session, AI reply, booking request or provider operation succeeded. The accepted Ars widget must emit `ars-widget:ready` after session acceptance/launcher enablement or `ars-widget:error` after safe initialization failure; listeners are attached before loading. Only the ready event updates the notice to “assistant launcher ready”, which still does not claim the iframe/chat journey passed. The normal contact fallback stays visible.

## Release dependencies

Before filling in the configuration or publishing it enabled, accept the Ars customer-widget release: exact serving origin and frame policy; authorised Salopian garage/token and apex/www domains; enforced enquiry-only behavior; tenant boundaries; AI entitlement/enablement and limits; accurate public motorcycle service information; approved customer data handling and the live privacy notice; synthetic end-to-end and physical-mobile checks; and an operational pause/recovery path. This preparation does not close those gates or authorise changing protected garage records.

The current Ars Settings embed snippet uses a different `.com` host. Do not copy it unchanged. The prepared loader pins the canonical `.co.uk` Workspace origin; verify that exact origin actually serves the accepted widget before release.

## Reviewed activation

1. Complete the Ars release dependencies and identify the exact Netlify production site and its source/publish controls.
2. Publish and verify the approved Salopian customer-beta privacy notice. The configured URL must be an absolute HTTPS URL on the exact apex or www origin, with a non-root path and no credentials, query or fragment. Do not invent a notice URL or publish draft legal text as approved.
3. In `ARS_WIDGET_BETA` near the end of `script.js`, supply only the garage's **public widget embed token**, the verified privacy-notice URL, and finally set `enabled: true`. Never put staff/session tokens, AI keys or other secrets in this public repository.
4. Run `node --test tests/ars-widget-beta.test.cjs` and `node --check script.js`. Inspect the source diff. Test with mocks first; do not submit the existing contact form during QA because it targets the live Apps Script service.
5. Perform the separately accepted synthetic widget journey on an isolated/approved host. The production hostname restriction must not be widened merely to make a preview work. The mock tests supply the allowed origin without making live requests.
6. Publish the reviewed website release and verify the exact production source, desktop/mobile layout, opt-in behavior and real error fallback within the accepted test scope.

To pause this website integration, set `enabled: false` and publish that change. This prevents new widget loads after visitors receive the changed page script; it cannot recall an already loaded script, active session or submitted record. Use the Ars server-side gate/token revocation as the immediate operational stop, under the agreed release procedure.

## Source and hosting evidence

- Repository: `ajbyrne91/salopian-motorsport`; preparation based on `main` SHA `f2cf1dd290db2bda33b2d4eb3ea0f3cb575137ad` (4 October 2026).
- The signed-in Netlify dashboard was inspected on 14 November 2026. Site `snazzy-biscuit-42ece7` (ID `e287d455-3a2a-4bd0-86c2-866e411c00c3`) belongs to team `ajbyrne91`, serves `salopianmotorsport.co.uk`, and is linked to this repository. Production branch `main` automatically publishes the repository root (`.`); no build command is configured. The currently published source is `f2cf1dd`, deployment `6ac266dc0670480009098856`.
- Netlify creates a **public Deploy Preview** for any pull request against `main`. Branch deploys are limited to production. An inactive preview contains no embed token, reviewed-notice URL or customer chat, and is not an accepted live widget test.
- GitHub Pages also publishes `/` from `main` to `ajbyrne91.github.io/salopian-motorsport/`, with no configured custom domain. A push/merge to `main` is therefore a public deployment on both configured hosting paths.
- No commit, push, production configuration or deployment is part of this local preparation.
