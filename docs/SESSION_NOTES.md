Status (2025-10-22)

- Live URL: https://bua9595.github.io/
- Hosting: GitHub Pages (Actions workflow)
  - Workflow: .github/workflows/deploy-pages.yml (green)
- Repo: Bua9595/bua9595.github.io (origin configured locally)
- Landing pages:
  - public/index.html (wrapper/iframe) — og:url set to root
  - public/content.html (main content) — og:url set to root
- Features shipped:
  - CV timeline with year markers (JS-inserted, side-aware, aligned to dots)
  - Language switch (DE/EN) with localStorage persistence + i18n mapping
  - Translations for nav/sections/CTA/typing + projects/timeline/footer/contact
  - Contact links set: mailto:bujupi9595@hotmail.de, GitHub, LinkedIn; X removed
  - Skills updated to realistic percentages based on CV
- Footer © displays correctly at runtime (JS fallback); static char appears fine in current deploy

Decisions

- Hosting: User Page (root domain), no custom domain for now
- Twitter/X: add later after new work profile exists
- Email: using bujupi9595@hotmail.de for now
- Keep Logistics & Operations high; IT skills tuned conservatively
- og:image not yet personalized (will add tomorrow)

Open To‑Dos (next session)

1) Add share image
   - Place image at public/og.jpg (1200×630)
   - Set og:image (+ og:image:alt, og:site_name) in public/index.html and public/content.html
   - Re‑deploy and validate preview via LinkedIn Post Inspector

2) Optional: Username change plan
   - If GitHub username changes: rename repo to NEWNAME.github.io (or create new)
   - Update remote: git remote set-url origin https://github.com/NEWNAME/NEWNAME.github.io.git
   - Update og:url in both HTML files to https://NEWNAME.github.io/
   - Commit + push to trigger deploy

3) Add X/Twitter link when available (re‑insert icon with final URL)

4) Minor content polish (optional)
   - Review translations and project descriptions; adjust copy as needed

Quick Commands

- Deploy (from project root):
  - git add -A
  - git commit -m "Notes + changes"
  - git push

