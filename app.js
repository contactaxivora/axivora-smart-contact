const $=id=>document.getElementById(id);
const decodeData=()=>{
  try{
    const raw=new URLSearchParams(location.search).get('d')||(location.hash||'').slice(1);
    if(!raw)return null;
    let b64=raw.replace(/-/g,'+').replace(/_/g,'/');
    while(b64.length%4)b64+='=';
    const bytes=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  }catch{return null}
};
const safeUrl=v=>{
  if(!v)return'';
  return /^https?:\/\//i.test(v)?v:`https://${v}`;
};
const esc=v=>String(v||'').replace(/[\\;,]/g,m=>'\\'+m).replace(/\r?\n/g,'\\n');
const data=decodeData();
const configureDynamicManifest=(contact)=>{
  try{
    const d=new URLSearchParams(location.search).get('d')||'';
    if(!contact||!contact.n||!d)return;
    const ref=String(contact.i||'').trim();
    const manifestUrl=new URL('https://axivora-smart-contact-publisher.contact-axivora.workers.dev/manifest');
    manifestUrl.searchParams.set('n',contact.n);
    manifestUrl.searchParams.set('d',d);
    if(ref)manifestUrl.searchParams.set('i',ref);
    const link=document.getElementById('dynamicManifest');
    if(link)link.setAttribute('href',manifestUrl.toString());
  }catch(e){console.warn('Dynamic manifest unavailable',e)}
};
configureDynamicManifest(data);

if(!data||!data.n){
  $('card').hidden=true;$('error').hidden=false;
}else{
  document.title=data.n;
  $('name').textContent=data.n;
  $('role').textContent=data.t||'';
  $('role').hidden=!String(data.t||'').trim();
  $('company').textContent=data.c||'';
  $('company').hidden=!String(data.c||'').trim();
  const initial=(data.n.trim()[0]||'A').toUpperCase();
  const profileRef=String(data.i||'').trim();
  const profileImage=/^https:\/\//i.test(profileRef)
    ? profileRef
    : profileRef
      ? `https://raw.githubusercontent.com/contactaxivora/axivora-smart-contact-images/main/${profileRef.replace(/^\/+/, '')}`
      : '';
  if(profileImage){
    const img=document.createElement('img');
    img.alt=data.n;
    img.referrerPolicy='no-referrer';
    img.src=profileImage;
    img.onload=()=>{$('avatar').textContent='';$('avatar').appendChild(img);$('avatar').classList.add('has-image');};
    img.onerror=()=>{$('avatar').textContent=initial;$('avatar').classList.remove('has-image');};
  }else{
    $('avatar').textContent=initial;
  }

  const detailRows=[
    ['Phone',data.p],['Email',data.e],['Website',data.w]
  ].filter(x=>x[1]);
  $('details').innerHTML=detailRows.map(([k,v])=>`<div class="detail"><span>${k}</span><span>${v}</span></div>`).join('');
  $('details').hidden=detailRows.length===0;

  const wire=(id,value,fn)=>{
    const b=$(id);
    const enabled=Boolean(String(value||'').trim());
    b.hidden=!enabled;
    b.disabled=!enabled;
    if(enabled)b.onclick=fn;
  };
  wire('callBtn',data.p,()=>location.href=`tel:${data.p}`);
  wire('waBtn',data.p,()=>location.href=`https://wa.me/${String(data.p).replace(/\D/g,'')}`);
  wire('emailBtn',data.e,()=>location.href=`mailto:${data.e}`);
  wire('webBtn',data.w,()=>location.href=safeUrl(data.w));

  $('saveBtn').onclick=()=>{
    const parts=(data.n||'').trim().split(/\s+/);
    const first=parts.shift()||'',last=parts.join(' ');
    const vcard=[
      'BEGIN:VCARD','VERSION:3.0',
      `N:${esc(last)};${esc(first)};;;`,
      `FN:${esc(data.n)}`,
      data.c?`ORG:${esc(data.c)}`:'',
      data.t?`TITLE:${esc(data.t)}`:'',
      data.p?`TEL;TYPE=CELL,VOICE:${esc(data.p)}`:'',
      data.e?`EMAIL;TYPE=INTERNET:${esc(data.e)}`:'',
      data.w?`URL;TYPE=WORK:${esc(safeUrl(data.w))}`:'',
      'END:VCARD'
    ].filter(Boolean).join('\r\n');
    const blob=new Blob([vcard],{type:'text/vcard;charset=utf-8'});
    const a=document.createElement('a');a.href=URL.createObjectURL(blob);
    a.download=`${data.n.replace(/[<>:"/\\|?*]/g,'_')}.vcf`;a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),1500);
  };


}

let deferredPrompt=null;
window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();deferredPrompt=e;
  if(data&&data.n)$('installBtn').hidden=false;
});
window.addEventListener('appinstalled',()=>{$('installBtn').hidden=true;});
$('installBtn').onclick=async()=>{
  if(!deferredPrompt)return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;$('installBtn').hidden=true;
};

if('serviceWorker' in navigator){
  window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
}
