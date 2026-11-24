#!/usr/bin/env node
/** Owner-only setup. Credentials are written to a private file outside the checkout. */
import {randomBytes} from 'node:crypto';
import {open,realpath,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createNinjaStore} from '../server/ninja-store.mjs';
import {createPostgresNinjaStore} from '../server/ninja-postgres-store.mjs';
import {bootstrapNinjaAdmin} from '../server/ninja-admin-bootstrap.mjs';

const root=fileURLToPath(new URL('../',import.meta.url));
let output=null,handle=null,store=null,createdFile=false,provisioningStarted=false;
try{
  const args=process.argv.slice(2),options={username:'NinjaTeamAdmin',postgres:false};
  for(let i=0;i<args.length;i++){
    const key=args[i];
    if(key==='--postgres'){options.postgres=true;continue;}
    if(!['--username','--output','--database-path'].includes(key)||!args[i+1])throw new Error('Use --username NAME --output PRIVATE_FILE [--database-path SQLITE_FILE | --postgres].');
    options[key.slice(2)]=args[++i];
  }
  if(!options.output)throw new Error('A private --output file outside the repository is required.');
  if(options.postgres&&(!process.env.DATABASE_URL||options['database-path']))throw new Error('--postgres requires DATABASE_URL and cannot be combined with --database-path.');
  if(!options.postgres&&process.env.DATABASE_URL)throw new Error('DATABASE_URL is set. Use --postgres explicitly or unset it for local SQLite.');
  output=path.resolve(options.output);
  const parent=await realpath(path.dirname(output));
  if(parent===root.slice(0,-1)||parent.startsWith(root))throw new Error('Keep admin credentials outside the checkout.');
  handle=await open(output,'wx',0o600);createdFile=true;
  const password='Ninja!'+randomBytes(32).toString('base64url'),recoveryKey='NNR-'+randomBytes(32).toString('base64url');
  // Persist the only copy of generated secrets before any account can commit.
  await handle.writeFile(JSON.stringify({username:options.username,password,recoveryKey,role:'admin',sandbox:true,rankingEligible:false,createdAt:new Date().toISOString()},null,2)+'\n');
  await handle.sync();await handle.close();handle=null;
  const directory=await open(parent,'r');try{await directory.sync();}finally{await directory.close();}
  store=options.postgres?await createPostgresNinjaStore({databaseURL:process.env.DATABASE_URL}):createNinjaStore({databasePath:options['database-path']||path.join(process.env.DATA_DIR||path.join(root,'server/data'),'ninja.sqlite')});
  provisioningStarted=true;
  const result=await bootstrapNinjaAdmin({store,username:options.username,password,recoveryKey});
  if(!result.created){await rm(output);createdFile=false;console.log(JSON.stringify({created:false,username:result.user.username,existingAdminUnchanged:true}));}
  else{
    console.log(JSON.stringify({created:true,username:result.user.username,privateCredentialsFile:output,sandbox:true,rankingEligible:false}));
  }
}catch(error){
  if(handle)await handle.close().catch(()=>{});
  if(createdFile&&output&&!provisioningStarted)await rm(output,{force:true}).catch(()=>{});
  console.error('Admin setup failed: '+error.message);process.exitCode=1;
  if(createdFile&&provisioningStarted)console.error('Private credentials were preserved at '+output+'; verify account creation before retrying.');
}finally{await store?.close();}
