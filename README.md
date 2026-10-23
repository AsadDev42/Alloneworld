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

## Prisma Compute hosting

Live website: https://a13czbnv5544qb9mku47p9n1.sjc.prisma.build

The `alloneworld` service runs on the production `main` branch of the existing `powerful-purple-moose` project (`proj_yoj8g01nyvyt5dryqolzdgtt`) in `us-west-1`. Workspace: `cmi92byal02aozvflreedp2gv`. Service: `cps_a13czbnv5544qb9mku47p9n1`. The website uses no database and the project's existing database is outside this deployment.

Use Node 24.11+ and Bun 1.4.4. Run `npm ci`, `npm run typecheck`, `npm run build`, then `npm run compute:dev` for local verification on port 3000. After signing into the same workspace with `npx prisma auth login`, run `npm run compute:deploy` to publish updates. The deployment script uses Prisma's pinned Compute SDK and the existing authenticated CLI session; it never embeds database credentials in the public build.

The Composer declarations describe the static service and its artifact, but direct Composer deployment is unsuitable for this pre-existing project because its database predates Composer's hosted deployment state. `compute:deploy` deploys only the website service through the supported Compute SDK. Do not delete the existing database or project to bootstrap Composer state.

GitHub Pages continues to deploy from `main`. Prisma publishing is manual through the script above; automatic Prisma deployment from GitHub has not been configured. Local authentication, generated artifacts and deployment reports are ignored by Git.
