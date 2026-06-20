/* ============================================================
   Prontto — popup de captação
   Abre após 5 min de navegação (tempo acumulado entre páginas),
   apenas para usuários NÃO logados. Uma vez por sessão.
   ============================================================ */
(function(){
  const DELAY_MS = 5 * 60 * 1000;          // 5 minutos
  const KEY_START = 'prontto_visit_start';  // 1º acesso
  const KEY_SHOWN = 'prontto_popup_shown';  // já exibido nesta sessão
  const KEY_AUTH  = 'prontto_auth';         // '1' = logado

  // usuário logado? então nunca mostra
  function isLogged(){
    try { return localStorage.getItem(KEY_AUTH) === '1'; } catch(e){ return false; }
  }
  // permite marcar login/logout a partir de outras telas
  window.ProntoAuth = {
    login(){ try{ localStorage.setItem(KEY_AUTH,'1'); }catch(e){} },
    logout(){ try{ localStorage.removeItem(KEY_AUTH); }catch(e){} }
  };

  if (isLogged()) return;

  // já exibido nesta sessão? não repete
  let shown = false;
  try { shown = sessionStorage.getItem(KEY_SHOWN) === '1'; } catch(e){}
  if (shown) return;

  // marca o início do 1º acesso (persistente entre páginas da sessão)
  let start = 0;
  try {
    start = parseInt(sessionStorage.getItem(KEY_START) || '0', 10);
    if (!start) { start = Date.now(); sessionStorage.setItem(KEY_START, String(start)); }
  } catch(e){ start = Date.now(); }

  const remaining = Math.max(0, DELAY_MS - (Date.now() - start));

  function buildPopup(){
    const ov = document.createElement('div');
    ov.className = 'pop-overlay';
    ov.setAttribute('role','dialog');
    ov.setAttribute('aria-modal','true');
    ov.setAttribute('aria-label','Precisando de ajuda?');
    ov.innerHTML =
      '<div class="pop">'
      + '<button class="pop__close" aria-label="Fechar">&times;</button>'
      + '<div class="pop__emoji"><i class="ri-customer-service-2-line"></i></div>'
      + '<h2 class="pop__h">Precisando de ajuda?</h2>'
      + '<p class="pop__sub">Conecte-se aos melhores profissionais e receba até <b>4 orçamentos</b>.</p>'
      + '<div class="pop__actions">'
      +   '<a href="cadastrar.html" class="btn btn-laranja">Solicitar um orçamento</a>'
      +   '<a href="index.html#categorias" class="btn btn-out">Ver outros serviços</a>'
      +   '<button class="pop__ghost" type="button" data-pro>Sou um profissional</button>'
      + '</div>'
      + '</div>';
    document.body.appendChild(ov);

    requestAnimationFrame(()=> ov.classList.add('open'));

    function close(){
      ov.classList.remove('open');
      try { sessionStorage.setItem(KEY_SHOWN, '1'); } catch(e){}
      setTimeout(()=> ov.remove(), 300);
    }
    ov.querySelector('.pop__close').addEventListener('click', close);
    ov.addEventListener('click', e => { if (e.target === ov) close(); });
    document.addEventListener('keydown', function esc(e){
      if (e.key === 'Escape'){ close(); document.removeEventListener('keydown', esc); }
    });
    ov.querySelector('[data-pro]').addEventListener('click', ()=>{ location.href = 'cadastrar.html'; });
  }

  function schedule(){
    setTimeout(()=>{ if (!isLogged()) buildPopup(); }, remaining);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', schedule);
  } else {
    schedule();
  }
})();
