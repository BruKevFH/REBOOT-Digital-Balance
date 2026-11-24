// Isolated child process for the restart acceptance test. No production defaults.
import {createNinjaServer,createPostgresNinjaServer} from '../../server/ninja-service.mjs';

let clock=Number(process.env.NINJA_TEST_CLOCK);
if(typeof process.send!=='function'||!Number.isFinite(clock)||!/^[a-f\d]{64}$/i.test(process.env.NINJA_TEST_MFA_KEY||''))throw new Error('Restart worker requires its isolated test parent.');
if(process.env.NINJA_TEST_DATABASE_URL){
  const url=new URL(process.env.NINJA_TEST_DATABASE_URL);
  if(!['postgres:','postgresql:'].includes(url.protocol)||!['127.0.0.1','localhost','[::1]'].includes(url.hostname)||url.searchParams.has('host')||url.searchParams.has('hostaddr'))throw new TypeError('Restart worker only permits loopback PostgreSQL without host overrides.');
}else if(!process.env.NINJA_TEST_DATABASE_PATH)throw new Error('Restart worker requires its temporary SQLite path.');
const options={now:()=>clock,mfaKey:process.env.NINJA_TEST_MFA_KEY};
const server=process.env.NINJA_TEST_DATABASE_URL
  ?await createPostgresNinjaServer({...options,databaseURL:process.env.NINJA_TEST_DATABASE_URL})
  :createNinjaServer({...options,databasePath:process.env.NINJA_TEST_DATABASE_PATH});

server.listen(0,'127.0.0.1',()=>process.send({ready:true,port:server.address().port}));
process.on('SIGTERM',()=>server.close(async()=>{
  await server.ninja.store.close();
  process.exit(0);
}));
