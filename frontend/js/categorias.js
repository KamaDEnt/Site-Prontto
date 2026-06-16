/* ============================================================
   Prontto — dados de categorias + menu compartilhado
   Usado na Home e na página de categoria (categoria.html)
   ============================================================ */
(function(){
  const ICON = {
    reformas:"<path d='M14.6 6.4a3.8 3.8 0 0 1-5 5L4 17l3 3 5.6-5.6a3.8 3.8 0 0 1 5-5l-2.7 2.7-2.3-2.3 2.7-2.7z'/>",
    pintura:"<path d='M3 21c2.5 0 4-1.6 4-4l8.5-8.5-3-3L4 14c-2 0-4 1.5-4 4z' transform='translate(1 0)'/><path d='M14 6l3-3 4 4-3 3'/>",
    limpeza:"<path d='M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z'/>",
    clima:"<path d='M12 2v20M3 7l18 10M21 7L3 17'/>",
    jardim:"<path d='M20 4s-7 .5-11 4.5S5 19 5 19s6.5 1 10.5-4S20 4 20 4z'/><path d='M5 19 13 11'/>",
    montagem:"<path d='M15 7 8 14l2 2 7-7zM14 6l3-3 4 4-3 3'/><path d='M8 14l-5 5 2 2 5-5'/>",
    mudanca:"<rect x='1' y='6' width='13' height='10' rx='1'/><path d='M14 9h4l3 3v4h-7z'/><circle cx='6' cy='18' r='1.7'/><circle cx='18' cy='18' r='1.7'/>",
    assistencia:"<rect x='6' y='6' width='12' height='12' rx='1.5'/><path d='M9 1.5v3M15 1.5v3M9 19.5v3M15 19.5v3M1.5 9h3M1.5 15h3M19.5 9h3M19.5 15h3'/>",
    seguranca:"<path d='M12 2 20 5v6c0 5-3.4 8-8 11-4.6-3-8-6-8-11V5l8-3z'/>",
    serralheria:"<path d='M13 2 4 14h7l-1 8 9-12h-7l1-8z'/>",
    autos:"<path d='M3 13l2-5a2 2 0 0 1 2-1.3h10A2 2 0 0 1 19 8l2 5v5h-3v-2H6v2H3z'/><circle cx='7' cy='15.5' r='1.3'/><circle cx='17' cy='15.5' r='1.3'/>"
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
      a.innerHTML="<svg viewBox='0 0 24 24'>"+ICON[c.key]+"</svg><span>"+c.label+"</span>";
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
  window.ProntoCats = { ICON, CATS, slugify, catLink, subLink, findCat, findSub, initCatbar };
})();
