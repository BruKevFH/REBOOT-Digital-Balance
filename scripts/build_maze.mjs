import {build} from 'esbuild';
import {mkdir,copyFile,writeFile} from 'node:fs/promises';
await mkdir('mind-maze/dist',{recursive:true});
await mkdir('mind-maze/licenses',{recursive:true});
await build({entryPoints:['mind-maze/src/main.js'],bundle:true,format:'iife',target:['es2020'],outfile:'mind-maze/dist/maze.js',minify:true,legalComments:'eof',sourcemap:false,define:{'process.env.NODE_ENV':'"production"'},logLevel:'info'});
await copyFile('node_modules/three/LICENSE','mind-maze/licenses/THREE-LICENSE.txt');
await writeFile('mind-maze/dist/build.json',JSON.stringify({name:'MIND MAZE – Escape the Distraction',version:'1.0.0',engine:'Three.js 0.186.1',entry:'index.html',offline:true,rooms:7},null,2)+'\n');
