# Md. Asaduzzaman — Portfolio

Static portfolio site built with plain **HTML, CSS and Bootstrap 5** (no build step, no
framework) — ready to publish with GitHub Pages.

## Structure

```
index.html      Main page (all sections)
css/style.css   Custom styles
js/script.js    Small interactions (back-to-top, mobile nav, footer year)
webapp/         An earlier Next.js version with an admin panel + student
                submission form (kept for future use, not part of the static site)
```

## Run locally

Just open `index.html` in a browser, or serve it:

```bash
python -m http.server 5500
# then open http://localhost:5500
```

## Publish with GitHub Pages

1. Push this repo to GitHub.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source: Deploy from a branch**, branch **main**, folder
   **/ (root)**.
4. Save — your site will be live at `https://<username>.github.io/<repo-name>/`.

## Editing content

Everything is in `index.html` — sections are marked with comments (`<!-- Hero -->`,
`<!-- Experience -->`, `<!-- Skills -->`, `<!-- Projects -->`, `<!-- Students -->`, etc.). Edit
the text directly. Colors and spacing live in `css/style.css`.

## Later: custom domain / dynamic version

The `webapp/` folder has a Next.js version with an admin login (edit profile/projects from the
browser) and a public link where students can submit their own info for approval. It needs a
Node.js host (not GitHub Pages) to run. See `webapp/README.md` for details — useful once you
move to real domain hosting.
