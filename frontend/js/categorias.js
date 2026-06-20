/* ============================================================
   Prontto — dados de categorias + menu compartilhado
   Usado na Home e na página de categoria (categoria.html)
   ============================================================ */
(function(){
  const ICON = {
    reformas:"ri-hammer-line",
    pintura:"ri-brush-line",
    limpeza:"ri-home-heart-line",
    clima:"ri-temp-cold-line",
    jardim:"ri-plant-line",
    montagem:"ri-tools-line",
    mudanca:"ri-truck-line",
    assistencia:"ri-computer-line",
    seguranca:"ri-shield-check-line",
    serralheria:"ri-door-lock-line",
    autos:"ri-car-line"
  };

  const CATS = [
    {key:'reformas',label:'Reformas e Reparos',emoji:'🔨',groups:[
      {t:'Elétrica',i:['Instalação elétrica','Tomadas e interruptores','Quadro de distribuição','Chuveiro elétrico','Iluminação']},
      {t:'Hidráulica',i:['Vazamentos','Desentupimento','Instalação de torneira','Caixa d’água','Aquecedor']},
      {t:'Alvenaria',i:['Pedreiro','Reboco e massa','Assentamento de piso','Pequenos reparos','Muros']},
      {t:'Gesso e Drywall',i:['Forro de gesso','Sancas','Paredes de drywall','Molduras']},
    ]},
    {key:'pintura',label:'Pintura',emoji:'🎨',groups:[
      {t:'Residencial',i:['Pintura interna','Pintura externa','Textura','Grafiato']},
      {t:'Acabamentos',i:['Verniz e laca','Pintura de portões','Efeitos decorativos','Massa corrida']},
      {t:'Comercial',i:['Lojas e escritórios','Fachadas','Galpões','Sinalização']},
    ]},
    {key:'limpeza',label:'Limpeza',emoji:'🧹',groups:[
      {t:'Residencial',i:['Diarista','Faxina','Limpeza pós-obra','Passar roupa']},
      {t:'Especializada',i:['Limpeza de vidros','Estofados e sofás','Carpetes e tapetes','Caixa d’água']},
      {t:'Comercial',i:['Escritórios','Condomínios','Lojas','Pós-evento']},
    ]},
    {key:'clima',label:'Climatização',emoji:'❄️',groups:[
      {t:'Ar-condicionado',i:['Instalação','Higienização','Manutenção','Recarga de gás']},
      {t:'Refrigeração',i:['Geladeira','Freezer','Câmara fria','Bebedouro']},
      {t:'Ventilação',i:['Exaustores','Coifas','Cortinas de ar']},
    ]},
    {key:'jardim',label:'Jardinagem',emoji:'🌱',groups:[
      {t:'Jardim',i:['Corte de grama','Poda de árvores','Paisagismo','Plantio']},
      {t:'Área externa',i:['Limpeza de quintal','Piscina','Dedetização','Jardim vertical']},
    ]},
    {key:'montagem',label:'Montagem e Móveis',emoji:'🪑',groups:[
      {t:'Montagem',i:['Móveis em geral','Móveis planejados','Guarda-roupa','Estantes']},
      {t:'Marcenaria',i:['Móveis sob medida','Restauração','Portas e janelas','Pequenos reparos']},
    ]},
    {key:'mudanca',label:'Mudança',emoji:'📦',groups:[
      {t:'Mudança',i:['Residencial','Comercial','Içamento','Guarda-móveis']},
      {t:'Transporte',i:['Frete','Carreto','Entregas','Motorista']},
    ]},
    {key:'assistencia',label:'Assistência Técnica',emoji:'🛠️',groups:[
      {t:'Eletrodomésticos',i:['Máquina de lavar','Geladeira','Microondas','Fogão e cooktop']},
      {t:'Eletrônicos',i:['TV','Computador e notebook','Celular','Som e home theater']},
    ]},
    {key:'seguranca',label:'Segurança',emoji:'🛡️',groups:[
      {t:'Monitoramento',i:['Câmeras / CFTV','Alarmes','Cerca elétrica','Interfone']},
      {t:'Acesso',i:['Portão eletrônico','Fechaduras digitais','Controle de acesso']},
    ]},
    {key:'serralheria',label:'Serralheria',emoji:'⚙️',groups:[
      {t:'Estruturas',i:['Portões','Grades e corrimãos','Estruturas metálicas','Solda']},
      {t:'Esquadrias',i:['Janelas de alumínio','Portas de ferro','Toldos e coberturas']},
    ]},
    {key:'autos',label:'Autos',emoji:'🚗',groups:[
      {t:'Mecânica',i:['Mecânico','Elétrica automotiva','Funilaria e pintura','Borracharia']},
      {t:'Cuidados',i:['Lavagem e estética','Película / insulfilm','Som automotivo','Guincho']},
    ]},
  ];

  function slugify(str){
    return str.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  }
  function catLink(key){ return 'categoria.html?cat='+key; }
  function subLink(key,item){ return 'categoria.html?cat='+key+'&sub='+slugify(item); }

  /* Imagens das subcategorias (slug -> extensão). Sem entrada = sem imagem. */
  const SUBIMG = {
    'instalacao-eletrica':'jpg','tomadas-e-interruptores':'jpg','quadro-de-distribuicao':'jpg','chuveiro-eletrico':'jpg','iluminacao':'jpg',
    'vazamentos':'jpg','instalacao-de-torneira':'jpg','caixa-d-agua':'jpg','aquecedor':'jpg',
    'pedreiro':'jpg','reboco-e-massa':'jpg','assentamento-de-piso':'jpg','pequenos-reparos':'jpg','muros':'jpg',
    'forro-de-gesso':'jpg','sancas':'jpg','paredes-de-drywall':'jpg','molduras':'jpg',
    'pintura-interna':'jpg','pintura-externa':'jpg','textura':'jpg','grafiato':'jpg',
    'verniz-e-laca':'jpg','pintura-de-portoes':'jpg','efeitos-decorativos':'jpg','massa-corrida':'jpg',
    'lojas-e-escritorios':'jpg','fachadas':'jpg','galpoes':'jpg','sinalizacao':'jpg',
    'diarista':'jpg','faxina':'jpg','limpeza-pos-obra':'jpg','passar-roupa':'jpg',
    'limpeza-de-vidros':'jpg','estofados-e-sofas':'jpg','carpetes-e-tapetes':'jpg',
    'escritorios':'jpg','condominios':'jpg','lojas':'jpg','pos-evento':'jpg',
    'instalacao':'jpg','higienizacao':'jpg','manutencao':'jpg','recarga-de-gas':'jpg',
    'geladeira':'jpg','freezer':'jpg','camara-fria':'jpg','bebedouro':'jpg',
    'exaustores':'jpg','coifas':'png','cortinas-de-ar':'png',
    'corte-de-grama':'jpg','poda-de-arvores':'jpg','paisagismo':'jpg','plantio':'jpg',
    'limpeza-de-quintal':'jpg','piscina':'jpg','dedetizacao':'jpg','jardim-vertical':'jpg',
    'moveis-em-geral':'jpg','moveis-planejados':'jpg','guarda-roupa':'png','estantes':'jpg',
    'moveis-sob-medida':'jpg','restauracao':'jpg',
    'residencial':'png','comercial':'png','guarda-moveis':'png','frete':'png','carreto':'png','entregas':'png','motorista':'png',
    'maquina-de-lavar':'jpg','microondas':'jpg','fogao-e-cooktop':'jpg',
    'tv':'png','computador-e-notebook':'png','celular':'png','som-e-home-theater':'png',
    'cameras-cftv':'png','cerca-eletrica':'png','interfone':'png','portao-eletronico':'png','fechaduras-digitais':'png','controle-de-acesso':'png',
    'portoes':'png','grades-e-corrimaos':'png','estruturas-metalicas':'png','solda':'png'
  };
  function subImg(slug){ return SUBIMG[slug] ? 'img/sub/'+slug+'.'+SUBIMG[slug] : null; }
  function subImgFor(item){ return subImg(slugify(item)); }
  /* Imagem de capa por categoria (usada no hero quando não há subcategoria) */
  const CATIMG = { 'autos':'jpg', 'serralheria':'jpg', 'limpeza':'jpg', 'assistencia':'jpg' };
  function catImg(key){ return CATIMG[key] ? 'img/cat/'+key+'.'+CATIMG[key] : null; }
  function findCat(key){ return CATS.find(c=>c.key===key); }
  function findSub(cat,subSlug){
    if(!subSlug)return null;
    for(const g of cat.groups){
      for(const it of g.i){ if(slugify(it)===subSlug) return it; }
    }
    return null;
  }

  /* Monta a barra de categorias + mega-menu dentro de #catbar */
  function initCatbar(){
    const row=document.getElementById('catRow');
    const mega=document.getElementById('mega');
    const megaIn=document.getElementById('megaIn');
    const catbar=document.getElementById('catbar');
    if(!row||!mega||!megaIn||!catbar)return;
    let hideTimer=null;

    CATS.forEach((c,idx)=>{
      const a=document.createElement('a');
      a.className='catbar__item';
      a.href=catLink(c.key);
      a.dataset.idx=idx;
      a.innerHTML="<i class='"+ICON[c.key]+"'></i><span>"+c.label+"</span>";
      a.addEventListener('mouseenter',()=>openMega(idx,a));
      a.addEventListener('focus',()=>openMega(idx,a));
      row.appendChild(a);
    });

    function openMega(idx,btn){
      clearTimeout(hideTimer);
      document.querySelectorAll('.catbar__item').forEach(el=>el.classList.remove('active'));
      btn.classList.add('active');
      const c=CATS[idx];
      megaIn.innerHTML=c.groups.map(g=>(
        "<div class='mega__col'><h5><a href='"+catLink(c.key)+"' style='color:inherit'>"+g.t+"</a></h5>"+
        g.i.map(it=>"<a href='"+subLink(c.key,it)+"'>"+it+"</a>").join('')+"</div>"
      )).join('');
      mega.classList.add('open');
    }
    function closeMega(){
      if(window.__nohide)return;
      hideTimer=setTimeout(()=>{
        mega.classList.remove('open');
        document.querySelectorAll('.catbar__item').forEach(el=>el.classList.remove('active'));
      },140);
    }
    catbar.addEventListener('mouseleave',closeMega);
    window.openMega=openMega;
    mega.addEventListener('mouseenter',()=>clearTimeout(hideTimer));
    catbar.addEventListener('mouseenter',()=>clearTimeout(hideTimer));
    document.addEventListener('keydown',e=>{if(e.key==='Escape'){mega.classList.remove('open');document.querySelectorAll('.catbar__item').forEach(el=>el.classList.remove('active'));}});
  }

  // expõe globalmente
  window.ProntoCats = { ICON, CATS, slugify, catLink, subLink, subImg, subImgFor, catImg, findCat, findSub, initCatbar };

  // ── Menu mobile (hambúrguer) ────────────────────
  function initBurger(){
    const burger=document.querySelector('.hdr__burger');
    const menu=document.querySelector('.hdr__menu');
    if(!burger||!menu)return;
    burger.addEventListener('click',e=>{ e.stopPropagation(); menu.classList.toggle('open'); });
    document.addEventListener('click',e=>{ if(!menu.contains(e.target)&&!burger.contains(e.target)) menu.classList.remove('open'); });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initBurger);
  else initBurger();
})();
