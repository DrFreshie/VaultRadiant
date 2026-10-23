# Teaching archive

Content in `content/.archive/` is published at `/archive/`. Other dot-folders remain excluded. The public archive is deliberately absent from Explorer, search, graph, RSS, sitemap, active folder listings, and tag listings. Archive HTML pages request `noindex`; this is not access control.

- Edit `content/.archive/index.md` for the archive landing page.
- Edit `content/.archive/s26/index.md` for the spring 2026 overview.
- Folder pages automatically list archived notes, subfolders, PDFs, images, Office documents, ZIP files, and text files. TeX build artifacts are not listed (the normal Assets emitter still copies them).
- The 404 page links to `/archive/`; no redirects from old URLs are created.
- Links inside archived pages using the old `semestre/` paths resolve to their archived equivalents when those targets exist. Short note names prefer the same class, then the same semester. Missing source files remain missing.

## Archiving another semester

1. Move the semester folder into `content/.archive/<semester>/`, preserving its internal structure.
2. Add a link from `content/.archive/index.md` and optionally add an `index.md` inside the semester folder.
3. Run a full build (`npx quartz build`) and deploy. A full rebuild is recommended after moving folders or adding asset-only folders.

Preview without replacing the usual build output:

```sh
npx quartz build --serve -o /tmp/vaultradiant-archive-preview
```

Visit `/archive/`, `/archive/s26/`, or an unknown URL to see the archive invitation on the 404 page. The hosting service must support serving `404.html` for missing URLs (GitHub Pages does).
