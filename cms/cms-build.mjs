import {build} from 'esbuild';
import fs from 'node:fs/promises';
await fs.mkdir('dist',{recursive:true});
await build({entryPoints:['cms-app.js'],bundle:true,minify:true,outfile:'dist/cms-app.js',platform:'browser',target:'es2022'});
await fs.copyFile('cms.html','dist/index.html');await fs.copyFile('cms-style.css','dist/cms-style.css');
