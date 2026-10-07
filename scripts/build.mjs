import {build} from 'esbuild';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
await mkdir('licenses',{recursive:true});
await build({entryPoints:['src/main.js'],bundle:true,format:'iife',target:['es2020'],outfile:'dist/reboot.js',minify:true,legalComments:'eof',sourcemap:false,define:{'process.env.NODE_ENV':'"production"'},logLevel:'info'});
await copyFile('node_modules/three/LICENSE','licenses/THREE-LICENSE.txt');
await writeFile('dist/build.json',JSON.stringify({name:'REBOOT Neon Balance',version:'1.0.0',engine:'Three.js 0.186.1',entry:'index.html',offline:true},null,2)+'\n');
