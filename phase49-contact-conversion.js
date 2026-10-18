(()=>{
  'use strict';
  const form=document.getElementById('form');
  const note=document.getElementById('formnote');
  const submit=document.getElementById('phase49Submit');
  const whatsapp=document.getElementById('phase49Whatsapp');
  const email='viviansb3@gmail.com';
  const phone='27621616889';

  const values=()=>{
    if(!form) return {};
    const data=new FormData(form);
    return {
      name:String(data.get('name')||'').trim(),
      email:String(data.get('email')||'').trim(),
      intent:String(data.get('intent')||'').trim(),
      subject:String(data.get('subject')||'').trim(),
      message:String(data.get('message')||'').trim()
    };
  };
  const messageText=v=>`Hello Vivian,\n\nName: ${v.name}\nEmail: ${v.email}\nEnquiry: ${v.intent}\nSubject: ${v.subject}\n\n${v.message}`;
  const setState=(state,text)=>{ if(form) form.dataset.state=state||''; if(note) note.textContent=text; };
  const valid=()=>{
    if(!form) return false;
    if(form.checkValidity()) return true;
    form.reportValidity();
    setState('error','Please complete the required fields before sending.');
    return false;
  };
  const encodedForm=()=>{
    const fd=new FormData(form);
    fd.set('form-name','portfolio-contact');
    return new URLSearchParams(fd).toString();
  };
  const openEmail=v=>{
    const subject=encodeURIComponent(v.subject || 'Portfolio enquiry');
    const body=encodeURIComponent(messageText(v));
    location.href=`mailto:${email}?subject=${subject}&body=${body}`;
  };
  const openWhatsapp=()=>{
    if(!valid()) return;
    const v=values();
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(messageText(v))}`,'_blank','noopener,noreferrer');
    setState('','WhatsApp opened with your message prefilled.');
    track('Contact WhatsApp',{intent:v.intent||'unspecified'});
  };

  async function submitContact(event){
    event.preventDefault();
    if(!valid()) return;
    const v=values();
    setState('sending','Sending…');
    if(submit) submit.textContent='SENDING…';

    // Netlify Forms accepts this POST when deployed on Netlify. Other static hosts
    // typically reject it, at which point the experience falls back to email.
    if(location.protocol==='http:' || location.protocol==='https:'){
      try{
        const response=await fetch('/',{
          method:'POST',
          headers:{'Content-Type':'application/x-www-form-urlencoded'},
          body:encodedForm()
        });
        const netlifyConfirmed=/\.netlify\.app$/i.test(location.hostname) || response.headers.has('x-nf-request-id');
        if(response.ok && netlifyConfirmed){
          form.reset();
          setState('success','Message sent successfully. Thank you — Vivian can reply using the email you provided.');
          track('Contact Form Sent',{intent:v.intent||'unspecified'});
          if(submit) submit.textContent='MESSAGE SENT ✓';
          setTimeout(()=>{if(submit) submit.textContent='SEND MESSAGE →';},2600);
          return;
        }
      }catch(_){/* fall through to email */}
    }
    setState('','Your host does not provide form capture, so a prefilled email draft is opening instead.');
    track('Contact Email Fallback',{intent:v.intent||'unspecified'});
    openEmail(v);
    if(submit) submit.textContent='SEND MESSAGE →';
  }

  // Privacy-safe event hooks. Nothing is transmitted unless the owner later
  // installs/configures Plausible and exposes window.plausible.
  function track(name,props={}){
    window.dispatchEvent(new CustomEvent('portfolio:interaction',{detail:{name,props}}));
    if(typeof window.plausible==='function') window.plausible(name,{props});
  }

  if(form) form.addEventListener('submit',submitContact);
  if(whatsapp) whatsapp.addEventListener('click',openWhatsapp);

  document.addEventListener('click',event=>{
    const target=event.target.closest('a,button');
    if(!target) return;
    const explicit=target.dataset.track;
    if(explicit){ track('CTA Click',{target:explicit}); return; }
    const href=target.getAttribute('href')||'';
    if(href.includes('github.com/')) track('GitHub Click');
    else if(href.includes('linkedin.com/')) track('LinkedIn Click');
    else if(href.includes('vivian-sibanda-cv.pdf')) track('CV Click');
    else if(href.startsWith('mailto:')) track('Email Click');
    else if(href.startsWith('tel:')) track('Phone Click');
    else if(href.includes('wa.me/')) track('WhatsApp Click');
    else if(href.startsWith('projects/')) track('Project Open',{project:href});
  },{passive:true});
})();
