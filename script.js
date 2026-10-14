
(function(){

  // v0.12.1: Safari can occasionally carry the previous document's scroll
  // v0.14: Safari can restore platform/program pages from the back/forward cache
  // with the previous scroll offset. That puts the page hero behind the sticky
  // header. Platform and program detail pages therefore start at the top unless an
  // explicit URL fragment is present. This also runs on BFCache pageshow.
  if((document.body.classList.contains('platform-detail') || document.body.classList.contains('program-detail')) && !location.hash){
    try{ history.scrollRestoration = 'manual'; }catch(e){}
    const resetPlatformScroll = ()=>{
      if(location.hash) return;
      window.scrollTo(0,0);
      document.documentElement.scrollTop = 0;
      if(document.body) document.body.scrollTop = 0;
    };
    resetPlatformScroll();
    requestAnimationFrame(()=>requestAnimationFrame(resetPlatformScroll));
    setTimeout(resetPlatformScroll, 0);
    setTimeout(resetPlatformScroll, 80);
    window.addEventListener('load', resetPlatformScroll, {once:true});
    window.addEventListener('pageshow', resetPlatformScroll);
  }

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('header.topbar > nav.nav');
  if(menuToggle && nav){
    // Always start closed on mobile, regardless of cached state.
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded','false');
    menuToggle.textContent = '☰';

    const setMenu = (open)=>{
      nav.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      menuToggle.setAttribute('aria-label', open ? 'Menü schließen' : 'Menü öffnen');
      menuToggle.textContent = open ? '×' : '☰';
    };

    menuToggle.addEventListener('click', ()=>{
      setMenu(!nav.classList.contains('open'));
    });

    nav.querySelectorAll('a').forEach(a=>{
      a.addEventListener('click', ()=>{
        if(window.matchMedia('(max-width:800px)').matches) setMenu(false);
      });
    });

    window.addEventListener('resize', ()=>{
      if(!window.matchMedia('(max-width:800px)').matches){
        nav.classList.remove('open');
        menuToggle.setAttribute('aria-expanded','false');
        menuToggle.textContent='☰';
      }
    });
  }

  const modal = document.querySelector('.modal');
  const modalTitle = document.querySelector('#modal-title');
  const modalBody = document.querySelector('#modal-body');
  const close = document.querySelector('.close');

  const profiles = {
    ibm: {
      title:'IBM PS/2 Model 77 486',
      html:`<div class="profile-grid">
        <div class="profile-box"><h3>Historisches Profil</h3><p>1992 · Machine Type 9577 · 486SX/33 oder 486DX2/66 · 32-Bit Micro Channel · XGA-2 · SCSI.</p></div>
        <div class="profile-box"><h3>MultiEra Lab</h3><ul><li>MS-DOS 6.22</li><li>Windows for Workgroups 3.11</li><li>SCSI / BlueSCSI</li><li>Netzwerk- und Browsertests</li></ul></div>
      </div>`
    },
    centris: {
      title:'Macintosh Centris 650',
      html:`<div class="profile-grid">
        <div class="profile-box"><h3>Historisches Profil</h3><p>1993 · 68LC040 oder 68040 mit 25 MHz · 4/8 MB ab Werk · SCSI · NuBus.</p></div>
        <div class="profile-box"><h3>MultiEra Lab</h3><ul><li>Mac OS 8.1</li><li>Netscape / Internet Explorer</li><li>Legacy-Webseite</li><li>SCSI / BlueSCSI</li></ul></div>
      </div>`
    },
    lcii: {
      title:'Macintosh LC II',
      html:`<div class="profile-grid">
        <div class="profile-box"><h3>Historisches Profil</h3><p>1992 · Motorola 68030 mit 16 MHz · 4 MB ab Werk · maximal 10 MB adressierbar · LC PDS.</p></div>
        <div class="profile-box"><h3>MultiEra Lab</h3><ul><li>System 7.x</li><li>Netscape Navigator 2/3</li><li>Legacy-Webseite</li><li>Low-End-68k-Browsergrenzen</li></ul></div>
      </div>`
    },
    c64: {
      title:'Commodore 64C',
      html:`<div class="profile-grid">
        <div class="profile-box"><h3>Historisches Profil</h3><p>1986 · MOS 6510/8500 · ca. 1 MHz · 64 KB RAM · VIC-II · SID.</p></div>
        <div class="profile-box"><h3>MultiEra Lab</h3><ul><li>8-Bit Edition</li><li>Contiki</li><li>RR-Net / Ethernet</li><li>HTTP / DHCP</li></ul></div>
      </div>`
    }
  };

  if(modal && modalTitle && modalBody && close){
    document.querySelectorAll('[data-profile]').forEach(el=>{
      el.addEventListener('click', e=>{
        e.preventDefault();
        const p = profiles[el.dataset.profile];
        if(!p) return;
        modalTitle.textContent = p.title;
        modalBody.innerHTML = p.html;
        modal.classList.add('open');
      });
    });
    function hide(){ modal.classList.remove('open'); }
    close.addEventListener('click', hide);
    modal.addEventListener('click', e=>{ if(e.target===modal) hide(); });
    document.addEventListener('keydown', e=>{ if(e.key==='Escape') hide(); });
  }

  const search = document.querySelector('#site-search');
  const searchButton = document.querySelector('#search-button');
  if(search && searchButton){
    const runSearch = ()=>{
      const q = search.value.trim().toLowerCase();
      if(!q) return;
      const targets=[...document.querySelectorAll('[data-search], article, section')];
      const hit=targets.find(x=>(x.dataset.search||'').toLowerCase().includes(q) || x.textContent.toLowerCase().includes(q));
      if(hit){
        hit.scrollIntoView({behavior:'smooth',block:'center'});
        hit.style.outline='2px solid #ff8a00';
        setTimeout(()=>hit.style.outline='',1800);
      }
    };
    searchButton.addEventListener('click',runSearch);
    search.addEventListener('keydown',e=>{if(e.key==='Enter') runSearch();});
  }
})();
