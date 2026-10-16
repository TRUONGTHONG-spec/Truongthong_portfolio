# Truong Thong — Pixel Portfolio

A black-and-lime, responsive designer portfolio with four real pages:
- `index.html`: introduction and creative interests.
- `about.html`: profile, strengths, tools, AI-agent workflow, experience, education and interests.
- `work.html`: filterable project and professional experience overviews.
- `contact.html`: email details and a form that opens an email draft. It does not send or store submissions.

Typography: embedded Geist Pixel Square for display, embedded Space Grotesk for body text. The fonts are distributed under the SIL Open Font License. Images are embedded WebP assets to keep browser uploads and static deployment portable.

## Editing and hosting
Serve this folder with any static server. No build command or dependencies are required. Netlify publishes the repository root from `main` and automatically deploys new commits.

The displayed work panels are clearly labeled project overviews. Final client deliverables and detailed case-study outcomes must be supplied separately.

## Voxel illustrations
`scenes.js` contains four embedded, optimized WebP illustrations and assigns them to `data-scene` images. The character appears standing with original game companions, designing while sitting on a monitor, cooking, and traveling. The generated 5×4 voxel icon atlas is embedded once in `style.css`; icon cells use CSS coordinates. Skill and software labels remain text for accessibility.

## Independent character animation
`motion.css` embeds a transparent 3×2 sprite atlas. `motion.js` creates separate layers for Thong, robot, star, fox, knight and slime, plus moving cubes and sparks. Every stage has a pause button and respects reduced-motion preferences.

## Self-service content editing
Open `/editor.html`. Changes are local drafts only: preview, export `content.json`, then upload that file to the GitHub repository root and commit it to publish through Netlify. The public editor cannot write to the server or GitHub. Text defaults are described in `editor-schema.js`. `content.js` applies published overrides. Replace individual transparent character layers to retain animation; replacing the entire cast image uses that static replacement instead. Keep a copy of exported content as a backup. The editor is not a full authenticated CMS.
