# Trung — Developer & curious mind

An English personal developer portfolio about AI, developer tools, and creative coding.

The design uses a quiet light-blue palette, standard Arial/Helvetica typography, a custom glass sculpture, and large project previews. Light and dark themes follow the system initially and remember a manual selection. Project filters and expandable technical notes work without a backend.

## Preview locally

Run: python -m http.server 4173

Open http://localhost:4173.

## Editing

- Content, projects, and accessibility labels: index.html
- Layout, responsive styles, and both themes: styles.css
- Theme initialization before first paint: theme-init.js
- Theme switching, project filters, and animation visibility: app.js
- Original hero artwork: assets/glass-knot.png

Motion respects prefers-reduced-motion. Navigation and controls are keyboard accessible. There are no external font dependencies or API keys. Project previews are illustrative; links point to existing public repositories.

## Hosting and domain

GitHub Pages publishes the repository root on main:
https://hiamtrung103.github.io/ai-portfolio/

Domain registration: https://github.com/is-a-dev/register/pull/57328

Requested domain: hiamtrung102.is-a.dev, using CNAME hiamtrung103.github.io. Configure the GitHub Pages custom domain and HTTPS after the registration PR is merged. Until then, keep the GitHub Pages preview reachable without a CNAME file.

This is a personal, non-commercial developer portfolio. No employment history, testimonials, metrics, or qualifications have been invented.
