/**
 * Offline QR code: version 8, low error correction, byte mode, no network.
 * Renders otpauth URIs on the server without ever sending secrets to QR services.
 * Oversized URIs gracefully fall back to a manual setup key.
 */
const SIZE=49,DATA_LENGTH=194,ECC_LENGTH=24;
function multiply(x,y){
 let z=0;
 for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11d);z^=((y>>>i)&1)*x;}
 return z;
}
function divisor(degree){
 const result=new Uint8Array(degree);result[degree-1]=1;
 let root=1;
 for(let i=0;i<degree;i++){
  for(let j=0;j<degree;j++){
   result[j]=multiply(result[j],root);
   if(j+1<degree)result[j]^=result[j+1];
  }
  root=multiply(root,2);
 }
 return result;
}
function remainder(data,divisor){
 const result=new Uint8Array(divisor.length);
 for(const value of data){
  const factor=value^result[0];result.copyWithin(0,1);result[result.length-1]=0;
  for(let i=0;i<divisor.length;i++)result[i]^=multiply(divisor[i],factor);
 }
 return result;
}
function makeCodewords(uri){
 const bytes=new TextEncoder().encode(uri);
 if(bytes.length>192)return null;
 const bits=[];
 const append=(value,n)=>{for(let i=n-1;i>=0;i--)bits.push((value>>>i)&1);};
 append(4,4);append(bytes.length,8);
 for(const byte of bytes)append(byte,8);
 for(let i=0;i<4&&bits.length<DATA_LENGTH*8;i++)bits.push(0);
 while(bits.length%8)bits.push(0);
 const data=[];
 for(let i=0;i<bits.length;i+=8){
  let byte=0;for(let j=0;j<8;j++)byte=(byte<<1)|bits[i+j];data.push(byte);
 }
 for(let n=0;data.length<DATA_LENGTH;n++)data.push(n%2===0?0xec:0x11);
 const first=data.slice(0,97),second=data.slice(97),div=divisor(ECC_LENGTH);
 const errA=remainder(first,div),errB=remainder(second,div),result=[];
 for(let i=0;i<97;i++)result.push(first[i],second[i]);
 for(let i=0;i<ECC_LENGTH;i++)result.push(errA[i],errB[i]);
 return result;
}
export function qrSvgForAuthenticator(uri){
 if(typeof uri!=='string'||!uri.startsWith('otpauth://totp/')||uri.length>500)return null;
 const codewords=makeCodewords(uri);if(!codewords)return null;
 const matrix=Array.from({length:SIZE},()=>Array(SIZE).fill(false));
 const reserved=Array.from({length:SIZE},()=>Array(SIZE).fill(false));
 function set(x,y,dark){if(x>=0&&x<SIZE&&y>=0&&y<SIZE){matrix[y][x]=Boolean(dark);reserved[y][x]=true;}}
 for(const [cx,cy] of [[3,3],[SIZE-4,3],[3,SIZE-4]]){
  for(let dy=-4;dy<=4;dy++)for(let dx=-4;dx<=4;dx++){
   const distance=Math.max(Math.abs(dx),Math.abs(dy));
   set(cx+dx,cy+dy,distance!==2&&distance!==4);
  }
 }
 for(let i=0;i<SIZE;i++){
  if(!reserved[6][i])set(i,6,i%2===0);
  if(!reserved[i][6])set(6,i,i%2===0);
 }
 for(const cy of [6,24,42])for(const cx of [6,24,42]){
  if((cx===6&&cy===6)||(cx===6&&cy===42)||(cx===42&&cy===6))continue;
  for(let dy=-2;dy<=2;dy++)for(let dx=-2;dx<=2;dx++){
   const dist=Math.max(Math.abs(dx),Math.abs(dy));
   set(cx+dx,cy+dy,dist===2||dist===0);
  }
 }
 for(let i=0;i<=8;i++){set(8,i,false);set(i,8,false);}
 for(let i=0;i<8;i++){set(SIZE-1-i,8,false);set(8,SIZE-1-i,false);}
 set(8,SIZE-8,true);
 let v=8;
 for(let i=0;i<12;i++)v=(v<<1)^((v>>>11)*0x1f25);
 v=(8<<12)|v;
 for(let i=0;i<18;i++){
  const bit=((v>>>i)&1)!==0,x=SIZE-11+i%3,y=Math.floor(i/3);
  set(x,y,bit);set(y,x,bit);
 }
 let bitIndex=0;
 for(let right=SIZE-1;right>=1;right-=2){
  if(right===6)right=5;
  for(let vert=0;vert<SIZE;vert++){
   const up=(((right+1)&2)===0),y=up?SIZE-1-vert:vert;
   for(let j=0;j<2;j++){
    const x=right-j;if(reserved[y][x])continue;
    const byte=codewords[bitIndex>>>3],bit=byte===undefined?false:((byte>>>(7-(bitIndex&7)))&1)!==0;
    matrix[y][x]=bit!==((x+y)%2===0);bitIndex++;
   }
  }
 }
 const formatData=1<<3;
 let rem=formatData;
 for(let i=0;i<10;i++)rem=(rem<<1)^(((rem>>>9)&1)*0x537);
 const format=((formatData<<10)|rem)^0x5412;
 const formatBit=i=>((format>>>i)&1)!==0;
 for(let i=0;i<=5;i++)set(8,i,formatBit(i));
 set(8,7,formatBit(6));set(8,8,formatBit(7));set(7,8,formatBit(8));
 for(let i=9;i<15;i++)set(14-i,8,formatBit(i));
 for(let i=0;i<8;i++)set(SIZE-1-i,8,formatBit(i));
 for(let i=8;i<15;i++)set(8,SIZE-15+i,formatBit(i));
 set(8,SIZE-8,true);
 let path='';
 for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++)if(matrix[y][x])path+='M'+(x+4)+' '+(y+4)+'h1v1h-1z';
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57 57" shape-rendering="crispEdges" role="img" aria-label="Authenticator QR"><rect width="57" height="57" fill="#ffffff"/><path d="'+path+'" fill="#111827"/></svg>';
}
