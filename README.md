# Parker Merritt — Personal Website

A static personal site with a multi-page layout (home, experience, projects, skills, resume) and a browser-playable version of Route Lab, a football passing-play simulator.

## Run locally

ES modules require serving over HTTP (not `file://`):

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000/index.html. Play Route Lab at http://localhost:8000/route_lab/index.html.

## Structure

- `*.html` — site pages
- `css/` — styles
- `js/` — small page scripts (nav, reveal)
- `route_lab/` — Route Lab game (ES modules)
- `kit/` — shared host shim for the game
- `images/` — image assets
