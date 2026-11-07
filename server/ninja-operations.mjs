/** Drive shared database operations synchronously for SQLite, asynchronously for PostgreSQL. */
export function execute(iterator){
  if(!iterator || typeof iterator.next!=='function')return iterator;
  function advance(method,value){
    let step;
    try{step=iterator[method](value);}catch(error){throw error;}
    if(step.done)return step.value;
    const result=step.value;
    if(result&&typeof result.then==='function')return Promise.resolve(result).then(value=>advance('next',value),error=>advance('throw',error));
    return advance('next',result);
  }
  return advance('next');
}
export const operation=callback=>(...args)=>execute(callback(...args));
