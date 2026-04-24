// ── HAMBURGER ─────────────────────────────────
function toggleMenu(){
  const menu=document.getElementById('mobileMenu');
  const btn=document.querySelector('.hamburger');
  if(!menu)return;
  menu.classList.toggle('open');
  const open=menu.classList.contains('open');
  if(btn)btn.setAttribute('aria-expanded',open?'true':'false');
}

// ── NAV SCROLL ────────────────────────────────
window.addEventListener('scroll',()=>{
  document.getElementById('nav').classList.toggle('scrolled',window.scrollY>20);
});

// ── TABS HOW (accueil) ─────────────────────────
function switchTab(tab,btn){
  document.querySelectorAll('.how-tab').forEach(b=>b.classList.remove('active'));
  document.querySelectorAll('.how-content').forEach(c=>c.classList.remove('active'));
  btn.classList.add('active');
  const pane=document.getElementById('tab-'+tab);
  if(pane)pane.classList.add('active');
  observeReveal();
}

// ── FAQ (accueil) ─────────────────────────────
function toggleFaq(item){
  const wasOpen=item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i=>{
    i.classList.remove('open');
    const q=i.querySelector('.faq-q');
    if(q)q.setAttribute('aria-expanded','false');
  });
  if(!wasOpen){
    item.classList.add('open');
    const q=item.querySelector('.faq-q');
    if(q)q.setAttribute('aria-expanded','true');
  }
}
function filterFaq(cat,btn){
  document.querySelectorAll('.faq-cat').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.faq-item').forEach(item=>{
    item.style.display=(cat==='all'||item.dataset.cat===cat)?'':'none';
  });
}

// ── FORM ──────────────────────────────────────
function submitForm(){
  const t=document.getElementById('toast');
  if(!t)return;
  t.classList.add('show');
  setTimeout(()=>t.classList.remove('show'),4000);
}

// ── SCROLL REVEAL ─────────────────────────────
function observeReveal(){
  setTimeout(()=>{
    const els=document.querySelectorAll('main .reveal');
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target)}});
    },{threshold:.1});
    els.forEach(el=>{if(!el.classList.contains('visible'))io.observe(el)});
  },50);
}

document.addEventListener('DOMContentLoaded',()=>{
  observeReveal();
  const contactForm=document.querySelector('form[action*="formspree.io"]');
  if(contactForm){
    contactForm.addEventListener('submit',async function(e){
      e.preventDefault();
      const action=(this.getAttribute('action')||'').trim();
      if(!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9_-]+$/.test(action)){
        // TODO: définir action="https://formspree.io/f/xxxxxxxx" sur le <form> pour activer l'envoi Formspree
        return;
      }
      try{
        const res=await fetch(action,{method:'POST',body:new FormData(this),headers:{Accept:'application/json'}});
        if(res.ok){submitForm();this.reset();}
      }catch(err){}
    });
  }
});
