# AIO Finance

Official product, Privacy Policy and Support website for AIO Finance.

- Website: https://aiofinanceapp.github.io/
- Privacy: https://aiofinanceapp.github.io/privacy/
- Support: https://aiofinanceapp.github.io/support/
- Contact: aiofinancesupport@gmail.com

## Local preview
Requires Node.js; no package installation is needed.

    node scripts/build.mjs
    node scripts/preview.mjs

Open http://127.0.0.1:4173/. Ctrl+C stops the preview.
On Windows, Preview.cmd runs the same local preview.

## Maintain
src/index.html owns the shared shell. src/home.html owns the homepage. src/privacy.html owns the complete policy. src/support.html is shared by the homepage and Support page. Edit these sources and rebuild; never edit dist by hand.
The existing app icon is included only as small website PNG assets. The financial illustration uses fictional figures and is not an app screenshot.
There is no backend, analytics integration, external font, tracking cookie or contact form. GitHub Pages supplies static hosting; its own data practices are described in the policy.

## Validate
Run node scripts/build.mjs and node scripts/check.mjs.
For strict browser JavaScript checking with an existing TypeScript installation, set TYPESCRIPT_PATH to its typescript/lib/typescript.js file and run node scripts/typecheck.mjs.
For optional linting, use an installed ESLint with eslint.config.mjs against src/app.js and scripts/*.mjs. No compiler or lint dependency is needed for hosting.

## Publication
site.config.json owns the policy effective date. It records the real publication date; keep that date unless the policy is revised. New policy dates must reflect actual approved publication, not a placeholder or invented historical date.
The manual Publish approved website GitHub Actions workflow runs the production build and checks, then uploads only dist to GitHub Pages. It does not run on every push. Pages uses the GitHub Actions source. Publication and future site changes require owner authorization.

Do not add store badges until legitimate public App Store or Google Play URLs exist. Never add financial profiles, application source, private audit documents, browser profiles, backups or credentials to this repository.
