# Niyan

Public website for **Niyan**, an enterprise AI control plane. The product routes and governs workloads across OpenAI, Claude, Gemini, and self-hosted models from one platform.

This repo is a static marketing site (HTML, CSS, and JavaScript). There is no build step.

## Pages

| Path | Description |
| --- | --- |
| `index.html` | Landing page: features, control plane, architecture, router demo, FinOps calculator, insights, and beta registration |
| `subscription.html` | VM subscription vs Kubernetes (coming soon), plus post-subscribe install commands |

## Run locally

From the repo root:

```bash
python3 -m http.server 8080
```

Then open:

- http://127.0.0.1:8080/
- http://127.0.0.1:8080/subscription.html

Any static file server works. Do not open the HTML files directly from disk if you want routing and assets to load reliably.

## Theme

The site supports **light** and **dark** themes (Instrument palette: warm paper, copper accent). Use the Light / Dark control in the header. The choice is stored in `localStorage` under `niyan-theme`. On a first visit with no saved preference, the site follows `prefers-color-scheme`.

## Project layout

```text
index.html              Landing page
subscription.html       Subscription page
styles.css              Shared design system and layout
app.js                  Landing-page widgets (router, ROI, control plane, insights)
subscription.js         VM plan selection and install copy
theme.js                Light/dark theme persistence
niyan_cube_logo.jpg     Brand mark
```

Beta registration and VM subscribe flows are client-side mocks. Leads are written to `localStorage` (`niyan_leads`, `niyan_vm_subscription`). They are not sent to a backend.

## License

Self-hosted AI orchestration framework licensed under Apache 2.0 (as stated on the site footer).
