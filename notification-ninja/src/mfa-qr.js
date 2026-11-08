
/** Draw a private otpauth URI as an inline SVG. The URI is never sent to an image service. */
export async function mfaQR(uri){
 if(typeof uri!=='string'||uri.length>800||!uri.startsWith('otpauth://totp/'))return '';
 const {qrcodegen}=await import('./vendor/qrcodegen.ts');
 const qr=qrcodegen.QrCode.encodeText(uri,qrcodegen.QrCode.Ecc.MEDIUM),pad=4,size=qr.size+pad*2;
 let squares='';
 for(let y=0;y<qr.size;y++)for(let x=0;x<qr.size;x++)if(qr.getModule(x,y))squares+='<rect x="'+(x+pad)+'" y="'+(y+pad)+'" width="1" height="1"/>';
 return '<svg class="mfa-qr" role="img" aria-label="QR-Code für deine Authenticator-App" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '+size+' '+size+'" shape-rendering="crispEdges"><rect width="'+size+'" height="'+size+'" fill="#fff"/><g fill="#152d45">'+squares+'</g></svg>';
}
