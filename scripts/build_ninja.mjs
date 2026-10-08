import {build} from 'esbuild';
import {mkdir,writeFile} from 'node:fs/promises';
await mkdir('notification-ninja/dist',{recursive:true});
await build({entryPoints:['notification-ninja/src/main.js'],bundle:true,format:'iife',target:['es2020'],outfile:'notification-ninja/dist/ninja.js',minify:true,legalComments:'eof',sourcemap:false,logLevel:'info'});
await writeFile('notification-ninja/dist/build.json',JSON.stringify({name:'Notification Ninja – Master Your Digital Balance',version:'1.0.0',engine:'Canvas 2D / Web Audio',entry:'index.html',offline:true,levels:4},null,2)+'\n');
