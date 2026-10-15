# Homepage cinematic transition

The approved studio artwork is one flattened WebP. It cannot independently move Dee, individual monitors, or furniture. The enhancement keeps that image unchanged and uses a separate red light layer, gentle image parallax, perspective transforms, and two dimensional doorway panels. Typography and controls remain HTML.

Only index.html loads home-cinema.css, the locally hosted GSAP 3.13.0 distribution, and home-cinema.js. Other pages are unchanged. Explore My World points natively to about.html. Without GSAP, JavaScript, or with reduced motion, that link opens About Me directly.

Entrance: darkness clears at 0–0.5 seconds, the red light rises at 0.5–1.2 seconds, and the copy reveals at 1–1.8 seconds. Mouse parallax is restrained and disabled for touch and reduced motion.

Explore timeline: light activation at 0–0.5 seconds, camera push at 0.5–1.2 seconds, sliding panels at 1.2–1.8 seconds, ACCESS GRANTED / NEW LEVEL UNLOCKED at 1.8–2.3 seconds, and LEVEL 01 — ABOUT ME at 2.3–3 seconds. An inert, noninteractive iframe previews the unchanged About Me page through the doorway. At three seconds normal navigation loads about.html. The preview does not create a history entry.

Playback blocks repeated activation, traps focus within the temporary dialog, offers Enter About Me now, and supports Escape cancellation. A 4.5 second navigation watchdog handles stalled animations. Pagehide and restored pages clear animation state. Changing to reduced motion during playback immediately opens About Me.

Local verification:

```sh
python -m http.server 8034
node tests/home-cinema.cjs
DEE_TEST_BASE_URL=http://localhost:8034 node tests/world-interactions.cjs
DEE_TEST_BASE_URL=http://localhost:8034 node tests/cinematic-navigation.cjs
```

Browser tests use Playwright and system Chromium at /usr/bin/chromium. The dedicated test verifies desktop and phone stages, destination content, history, keyboard cancellation, reduced motion, repeated clicks, a paused animation watchdog, unavailable GSAP, JavaScript disabled behavior, and console errors. Safari requires device confirmation because WebKit downloads are blocked in this environment.
