# All One World — Homepage Demo

The existing All One World homepage, refined as a responsive client demo with the original branding and navigation destinations retained.

## Run locally

Requires Node.js 18 or newer. No package installation is needed.

```sh
npm start
```

Open http://localhost:8000/index.html.

```sh
npm test
```

## Project structure

- `index.html`: complete homepage markup and existing integration configuration.
- `assets/css/`: existing styles and homepage-specific refinements.
- `assets/js/`: existing integrations and the homepage demo interactions.
- `assets/images/`: branding, user-supplied hero image, geometric SVGs, and editorial artwork.
- `assets/fonts/`: local font assets.
- `wp-content/`: translation flag assets used by the existing integration.
- `serve_static.js`: local preview server.
- `scripts/check-site.cjs`: checks local asset references and navigation preservation.

## Visual direction

The interface follows the supplied logo palette: `#67C6C6`, `#6666CC`, `#E17656`, `#66FFFF`, `#6565AC`, and `#273087`. Islamic architectural arches, subtle geometric patterns, editorial artwork, and restrained coral accents support the organisation's themes of attachment, loss, belonging, identity, and collective life.

The original logo is retained. The latest hero background was supplied by the client. Generated editorial illustrations and their prompts are documented beside the corresponding assets.

## Demo behaviour

- All eight navigation items and their original destinations are retained. Clicking other pages displays the requested homepage-demo notice.
- The floating WhatsApp button opens `https://wa.me/447531474111`; it does not send a message automatically.
- Language selection uses the existing Google Translate integration and displays a failure message if the provider cannot load.
- The article slider supports touch, arrows, keyboard navigation, auto-advance, and a pause control. Auto-advance respects reduced-motion preferences and pauses on hover, focus, or a hidden tab.
- Five article cards are clearly documented as demo previews, alongside the original published article. They do not represent newly published articles.
- Newsletter validation and feedback are present. A static preview has no WordPress backend, so it displays a demo notice instead of claiming a real subscription. Existing same-origin WordPress submission configuration remains supported.

This repository contains the homepage client demo and its assets. It is not a full WordPress installation or a deployment of the other website pages. Browser profiles, temporary screenshots, credentials, and working backups are excluded.
