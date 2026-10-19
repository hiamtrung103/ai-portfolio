# Trung — AI & Software Portfolio

A Vietnamese personal developer portfolio about AI, developer tools, and creative coding. Built with semantic HTML, responsive CSS, and vanilla JavaScript. No backend or API keys required. Ice-blue and periwinkle palette, light/dark themes, a projected 3D neural sphere, floating glass elements, and perspective project cards.

## Preview

```sh
python -m http.server 4173
```

Open http://localhost:4173. The site includes project filters, expandable technical notes, and an original canvas neural-network illustration. The animation pauses off screen and respects reduced-motion preferences. The theme follows the system initially and saves a manual selection in local storage.

## Hosting

GitHub Pages: deploy the `main` branch from the repository root. All asset paths are relative, so both project URLs and custom domains work.

Requested domain: `hiamtrung102.is-a.dev`.

Registration uses CNAME `hiamtrung103.github.io`, with no NS delegation or Cloudflare Tunnel. After is-a.dev approves and merges the registration, configure the custom domain in GitHub Pages and enable HTTPS. Do not add a CNAME file before approval because it would redirect the working preview before DNS exists.

## Editing

- Text, projects, links, and notes: `index.html`
- Layout and colors: `styles.css`
- Light/dark palettes and 3D treatments: `theme.css`
- Initial theme before first paint: `theme-init.js`
- Project filters and illustration: `app.js`

The project links point to existing public repositories. No testimonials, employment history, metrics, or qualifications have been invented. Project artwork is illustrative. The site is a personal, non-commercial developer portfolio, not an AI chatbot service.
