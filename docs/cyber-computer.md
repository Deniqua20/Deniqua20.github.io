# Cyber Corner computer enhancement

Checkpoint: local tag `checkpoint-before-cyber-computer-20261015` preserves commit 85bf593 before this enhancement. The original artwork is unchanged.

## Implemented

The existing studio image is wrapped in a shared scene so image parallax, camera movement, and monitor overlays stay together. A responsive SVG layer maps to the rendered image content rectangle, including object-fit cropping. The two visible physical screens receive simulated security/network activity and a Cyber Corner archive interface. The laptop faces away from the visitor, so it is not misrepresented as another front-facing screen. All IP addresses use documentation ranges. Decorative logs are hidden from assistive technology. Continuous motion can be paused, stops in hidden tabs, and is disabled for reduced motion.

The archive computer is a native blog.html link and supports keyboard activation. The existing Dee’s Corner tile launches the same experience when the monitor is cropped out on mobile. Ordinary BLOG navigation remains available on every page. Modified clicks, reduced motion, unavailable GSAP, and JavaScript disabled retain ordinary links.

On activation, the interface grows from the monitor position, shows three initialization stages, fills a crimson progress bar, displays ACCESS GRANTED and CYBER CORNER UNLOCKED, animates the existing butterfly once, and pushes the scene toward the archive screen. At approximately 3.8 seconds it opens a reading view using the actual blog.html main content. The introductory copy is verbatim and the existing post is preserved. No accounts, comments, forms, or invented posts were added.

The reading view uses a same-origin fetch, inert background, focus management, and history.pushState to blog.html. Return to Headquarters or browser Back removes that view and reverses the camera in 0.75 seconds without reloading Home. Browser Forward restores the reading view. Refresh and direct blog.html visits load the real standalone blog page with a native Return link. Escape cancels loading or exits the reading view. Repeated activation is blocked. A six second watchdog and fetch/animation error handling fall back to the standalone blog.

The original Explore My World doorway remains separate and still opens the original About Me page.

## Artwork limitations

The cup and both eyes are baked into cyber-studio-titled-books.webp. No CSS patch or crude eyelid shape was applied. A blink requires registered open/closed eye layers or a matching closed-eye frame with glasses, skin shading, and cybernetic details intact. Cup removal requires a carefully retouched background preserving the monitor, desk, reflections, and surrounding lighting. These two features remain unimplemented rather than altering Dee’s appearance or the approved composition.

## Files

- assets/js/cyber-computer.js and assets/css/cyber-computer.css: screen registration, simulated interfaces, reading view, loading and return timelines.
- assets/js/home-cinema.js: reuses the shared scene for existing camera movement and avoids simultaneous playback.
- index.html: enhancement assets and native blog tile.
- blog.html: required introduction and Return link, original post unchanged.
- scripts/build_shared.py and generated HTML headers/footers: BLOG navigation restored.
- tests/cyber-computer.cjs and tests/home-cinema.cjs: behavior and regression checks.

## Verification

Run python -m http.server 8034, then node tests/cyber-computer.cjs and node tests/home-cinema.cjs. Existing interaction tests accept DEE_TEST_BASE_URL=http://localhost:8034. Tests use system Chromium with Playwright. Check 1440×900, 768×1024, and 390×844 layouts, monitor alignment, pause/resume, keyboard activation, repeated clicks, exact introduction, unchanged post, Return, Back/Forward, Escape, reduced motion, failed fetch, and JavaScript disabled. Test the original About transition and project/resource/contact behavior as regressions. Safari requires device confirmation because WebKit installation is blocked in this environment.
