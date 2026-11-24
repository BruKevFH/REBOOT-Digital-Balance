// Production acceptance is strictly guest-only and blocks every non-read HTTP method.
const {run}=require('./check_ninja_313.cjs');
run({base:process.env.NINJA_PUBLIC_URL||'https://notification-ninja-accounts.onrender.com/',publicOnly:true,out:process.env.NINJA_TEST_OUTPUT||'test-results/ninja-public-guest'})
 .then(report=>console.log(JSON.stringify({version:report.version,base:report.base,viewports:report.viewports.map(v=>({width:v.width,ok:v.ok,screens:v.screens.length})),issues:report.issues},null,2)))
 .catch(error=>{console.error(error.stack);process.exitCode=1;});
