# Dee’s Cyber Corner

A static cybersecurity portfolio for GitHub Pages. The homepage follows the approved dark botanical mockup, with quieter interior pages and shared navigation.

## View locally

From this directory, run:

```sh
python3 -m http.server 8000
```

Open the server in your own browser. No dependency installation, compilation, environment variables, or API keys are required. GitHub Pages can serve these files directly from the configured branch and directory.

## Structure

- `index.html`: single botanical hero homepage; navigation leads to separate portfolio, story, blog, and resources pages
- `labs.html`: preserved technical portfolio content with shared navigation
- `about.html`: portrait-led introduction using the owner-supplied story and design reference
- `resources.html`: resources from Dee’s journey, coming soon
- `learn.html`: compatibility redirect to Resources
- `blog.html`: clearly marked previews of forthcoming articles
- `projects/azure-sentinel-soc.html`: project overview and architecture; detailed evidence is forthcoming
- `assets/css/site.css`: shared visual system and responsive layouts
- `assets/js/site.js`: accessible mobile menu and acronym game
- `assets/images/`: optimized WebP decorative artwork
- `assets/fonts/`: locally hosted fonts and their licenses
- `style.css`: retained original stylesheet for reference; the redesigned pages use `assets/css/site.css`

## Content and artwork

Decorative botanical images were generated for this design and optimized to WebP. They are decorative artwork, not technical evidence. The portfolio does not present generated security screenshots, unpublished results, or invented contact details. Add verified project screenshots and the implemented KQL when available; replace article previews with the real articles before offering them as published posts. The About layout can accommodate a real headshot later.

Fonts: Cormorant Garamond, DM Sans, and Great Vibes, distributed under the licenses included alongside the font files. Hosting them locally keeps typography independent of third-party font services.

## Validation

The site was rendered with Chromium at 1440, 1024, 768, and 390 pixels wide. Local navigation paths and anchor targets were audited; the mobile menu and navigation were exercised. There is no build or package manifest to maintain.

The About portrait artwork is an AI-assisted composite based on the owner’s supplied portrait and mockup; it is not an untouched photograph.
