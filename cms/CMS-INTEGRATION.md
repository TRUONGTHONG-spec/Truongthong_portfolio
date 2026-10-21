# Separate Content Studio — implementation checkpoint

## What is ready

- Authenticated CMS frontend: Home, About, Contact, all 29 projects, 76 gallery images, media library, uploads, project visibility and ordering, gallery ordering, backup, private preview and explicit Publish.
- Netlify Identity (verified owner email only) and Netlify Blobs backend with conditional draft/publish writes.
- Ten passing automated checks cover access control, private draft/media isolation, conflict handling, publication, image validation, all project routes and public rendering.
- Public integration keeps existing project URLs, concept thumbnails, original artwork, animation, game and TV. No admin navigation link. Old public editor routes return 404.

## Current deployment status

Netlify project `truongthong-cms` was created (ID `78d4e5b6-2cd4-4f52-934e-14edf8fc5c43`). The initial CMS files were committed to GitHub branch `portfolio-cms` at `2d057a3259a58ce5b64c9ae58761f8a086328928`. The full, corrected source and server functions are included in the accompanying CMS source directory. They must replace that incomplete remote branch before deploying.

The Netlify browser session asked for sign-in. The secure sign-in request timed out without a result, and the follow-up browser operation also timed out. GitHub connector writes returned HTTP 403. Thus the server files, latest fixes and public integration could not be uploaded. No CMS has been deployed; the main portfolio was not modified remotely.

## Completing deployment

1. Commit the full `cms` directory contents to branch `portfolio-cms`. Do not merge this branch into public `main`: its `netlify.toml` builds the private administration app into `dist` and bundles `server` functions.
2. In the existing Netlify project `truongthong-cms`, connect `TRUONGTHONG-spec/Truongthong_portfolio`, production branch `portfolio-cms`, build `npm run build`, publish `dist`. Its config is included.
3. Enable Identity in the CMS project's Identity dashboard. Keep email confirmation enabled. The Identity event function rejects signup for every address except `nguyenthanhtruongthong@gmail.com`; the API separately requires the verified owner account. Do not enable automatic email confirmation.
4. The owner opens the CMS and uses **Tạo tài khoản**, creates their own password and confirms their email. No credentials are included or pre-created.
5. Verify live authentication, an uploaded private image, saving a draft, then preview. `/api/state` must return 401 when logged out; `/content` must return the initial public document. Unpublished `/media/{id}` must return 404.
6. Apply `public-integration` contents to the public `main` branch only after the CMS endpoints work. This contains the 52 extracted original artwork files, public runtime, universal case-study template, fallback document, routing, and the public pages changed to load CMS content. Existing unmodified website files stay in place.
7. Verify all 29 Work cards, filters, original project URLs, gallery lightbox, Home, About, Contact and existing runner/TV. Finally, as owner, save and explicitly publish a small real change and verify the public site receives it. Remove the verification change through another explicit publication if needed; do not roll back deployments.

## Editing workflow

Sign in → edit content/images → **Lưu nháp** → **Xem trước** → **Xuất bản**. Drafts live in the CMS site's private Blob store, not localStorage. Only images referenced by the currently published document are publicly served. Main site reads the published snapshot through a same-origin proxy and has a static fallback if the CMS is unavailable.

The Contact form continues opening the visitor's email application; it does not silently send or store messages. Its destination email is editable in the CMS.

## Local verification

CMS directory: `npm ci`, `npm test`, `npm run build`.
Identity itself requires a real Netlify deploy and has not been tested end to end in this session. The automated server tests use an isolated in-memory store and mocked authenticated users, never production storage.
