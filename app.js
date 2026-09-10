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
const socialUrl=(k,v)=>{v=String(v||'').trim();if(!v)return'';if(/^https?:\/\//i.test(v))return v;const b={ig:'https://www.instagram.com/',fb:'https://www.facebook.com/',li:'https://www.linkedin.com/',tt:'https://www.tiktok.com/',th:'https://www.threads.net/'};return (b[k]||'https://')+v.replace(/^\/+/, '')};
const socialMeta={
ig:['Instagram',`<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor"/></svg>`],
fb:['Facebook',`<svg viewBox="0 0 24 24"><path d="M13.7 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5H17V3.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4V10H8.2v3h2.6v8h2.9z" fill="currentColor"/></svg>`],
li:['LinkedIn',`<svg viewBox="0 0 24 24"><path d="M5.4 8.5H2.5V21h2.9V8.5zM4 3A2 2 0 1 0 4 7a2 2 0 0 0 0-4zM21 13.8c0-3.8-2-5.6-4.7-5.6-2.2 0-3.2 1.2-3.7 2V8.5H9.7V21h2.9v-6.2c0-1.6.3-3.2 2.4-3.2 2 0 2.1 1.9 2.1 3.3V21H20v-7.2z" fill="currentColor"/></svg>`],
tt:['TikTok',`<svg viewBox="0 0 24 24"><path d="M15.4 3c.4 2.2 1.7 3.7 3.9 4.1v3c-1.5 0-2.8-.4-3.9-1.2v6.2c0 3.4-2.3 5.9-5.6 5.9-3.1 0-5.8-2.4-5.8-5.7 0-3.7 3.2-6.2 6.8-5.5v3.1c-1.7-.5-3.8.6-3.8 2.5 0 1.5 1.1 2.7 2.7 2.7 1.8 0 2.7-1.3 2.7-3.2V3h3z" fill="currentColor"/></svg>`],
th:['Threads',`<svg viewBox="0 0 24 24"><path d="M12 2.7c-5.4 0-9.3 3.8-9.3 9.4 0 5.4 3.6 9.2 8.9 9.2 4.6 0 8.1-2.8 8.1-6.8 0-3.2-2.1-5.1-5-5.4-.5-2-1.9-3.1-4-3.1-2.3 0-4.1 1.4-4.6 3.5l2.6.6c.2-1.1.9-1.7 2-1.7 1 0 1.6.4 1.9 1.1-3.8.2-6 1.8-6 4.4 0 2.2 1.8 3.8 4.3 3.8 2.8 0 4.8-1.7 5.1-4.3.8.4 1.2 1.1 1.2 2 0 2.1-2 3.5-5.3 3.5-3.9 0-6.5-2.7-6.5-6.8 0-4.2 2.8-6.9 6.8-6.9 3.4 0 5.6 1.9 6.4 5l2.6-.7C19.3 5.3 16.3 2.7 12 2.7z" fill="currentColor"/></svg>`]
}
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
    ['Phone',data.p],
    ...(data.q&&data.q!==data.p?[['WhatsApp',data.q]]:[]),
    ['Email',data.e],
    ['Website',data.w]
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
  const whatsappNumber=String(data.q||data.p||'').trim();
  wire('callBtn',data.p,()=>location.href=`tel:${data.p}`);
  wire('waBtn',whatsappNumber,()=>location.href=`https://wa.me/${whatsappNumber.replace(/\D/g,'')}`);
  wire('emailBtn',data.e,()=>location.href=`mailto:${data.e}`);
  wire('webBtn',data.w,()=>location.href=safeUrl(data.w));
  const socialEntries=Object.entries(data.s&&typeof data.s==='object'?data.s:{}).filter(([k,v])=>socialMeta[k]&&String(v||'').trim());
  if(socialEntries.length){const wrap=document.createElement('div');wrap.className='social-links';socialEntries.forEach(([k,v])=>{const [label,icon]=socialMeta[k];const a=document.createElement('a');a.className='social-link';a.href=socialUrl(k,v);a.target='_blank';a.rel='noopener noreferrer';a.innerHTML=`<span class="social-icon">${icon}</span><span>${label}</span>`;wrap.appendChild(a)});if(socialEntries.length%2===1)wrap.lastElementChild?.classList.add('social-link-wide');$('actions').insertAdjacentElement('afterend',wrap)}


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
      data.q&&data.q!==data.p?`TEL;TYPE=CELL;X-ABLabel=WhatsApp:${esc(data.q)}`:'',
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
