/* ============================================================
   Prontto — renderização da página de categoria
   Lê ?cat=KEY&sub=slug e foca no serviço selecionado
   ============================================================ */
(function(){
  const PC = window.ProntoCats;
  PC.initCatbar();

  const params = new URLSearchParams(location.search);
  const catKey = params.get('cat') || 'reformas';
  const subSlug = params.get('sub');
  const cat = PC.findCat(catKey) || PC.CATS[0];
  const sub = PC.findSub(cat, subSlug);

  // foco: o serviço selecionado (sub) ou a categoria inteira
  const foco = sub || cat.label;
  const focoBaixo = foco.charAt(0).toLowerCase() + foco.slice(1);
  document.title = 'Prontto — ' + foco;

  // lista plana de todos os serviços da categoria
  const flat = [];
  cat.groups.forEach(g => g.i.forEach(it => flat.push(it)));

  const CIDADES = ['São Paulo','Rio de Janeiro','Belo Horizonte','Brasília','Curitiba','Porto Alegre','Salvador','Fortaleza','Campinas','Goiânia','Recife','Manaus'];
  const NOMES = ['Lara','Vitor Gabriel','Esther','Lavínia','Cauã','Thiago','João Miguel','Yuri','Ana Paula','Roberto','Bernardo','Helena'];
  const RWNOMES = ['Ana Paula','Roberto Silva','Bernardo Fernandes'];

  // pega N itens da lista de serviços (cíclico)
  const pick = (arr,n,off=0)=>{const o=[];for(let k=0;k<n;k++)o.push(arr[(k+off)%arr.length]);return o;};

  // ---- Breadcrumb ----
  const crumb = '<div class="wrap"><nav class="crumb" aria-label="Você está em">'
    + '<a href="Home.html">Prontto</a><span>›</span>'
    + '<a href="'+PC.catLink(cat.key)+'">'+cat.label+'</a>'
    + (sub ? '<span>›</span><b>'+sub+'</b>' : '')
    + '</nav></div>';

  // ---- Hero ----
  const hero = ''
    + '<section class="cat-hero"><div class="wrap"><div class="cat-hero__in">'
    +   '<div class="cat-hero__txt">'
    +     '<h1>Precisando de '+(sub?'serviços de '+sub:cat.label)+'?</h1>'
    +     '<p class="cat-hero__sub">Milhares de profissionais avaliados por clientes, permitindo você negociar apenas com os melhores.</p>'
    +     '<ul class="cat-hero__pts">'
    +       '<li><span class="ic ic--shield">🛡️</span> Até 4 orçamentos grátis e seguros</li>'
    +       '<li><span class="ic ic--star">⭐</span> Profissionais avaliados</li>'
    +       '<li><span class="ic ic--play">▶</span> Veja como funciona o Prontto</li>'
    +     '</ul>'
    +   '</div>'
    +   '<div class="cat-hero__art"><span class="ph-tag">foto · profissional de '+cat.label+'</span></div>'
    + '</div></div></section>';

  // ---- Bloco laranja: lista de serviços + sidebar ----
  const serviceRows = flat.map(it =>
    '<a class="svc-row" href="cadastrar.html">'+it+'<span class="chev">›</span></a>'
  ).join('');

  const reviews = RWNOMES.map((nome,k)=>(
    '<div class="cat-review">'
    + '<div class="cat-review__by"><b>'+nome+'</b> avaliou:</div>'
    + '<div class="cat-review__stars">★★★★★</div>'
    + '<p class="cat-review__text">'+[
        'Fui muito bem atendida, com um trabalho de qualidade. Valeu a pena, orçamento grátis e não é caro. Obrigada!',
        'Excelentes profissionais, rápidos, honestos e com bom preço. Recomendo muito.',
        'O profissional é excelente, atendeu com rapidez, atenção e solucionou o problema. Recomendo!'
      ][k]+'</p>'
    + '<div class="cat-review__for">para <b>'+['Antônio Santos','Vanessa Silva','Adriana Prado'][k]+'</b> / '+foco+'</div>'
    + '</div>'
  )).join('');

  const pick_block = ''
    + '<section class="cat-pick"><div class="wrap"><div class="cat-pick__in">'
    +   '<div class="cat-pick__panel"><div class="cat-pick__card">'
    +     '<h2>Qual serviço de '+foco+' está precisando?</h2>'
    +     '<div class="cat-search"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.7" y2="16.7"/></svg><input type="text" placeholder="O que você precisa?"></div>'
    +     '<div class="svc-list">'+serviceRows+'</div>'
    +     '<div class="cat-pick__note">Orçamentos em até 60 minutos</div>'
    +   '</div></div>'
    +   '<aside class="cat-side">'
    +     '<div class="cat-rate"><div class="cat-rate__num">4.86 <span>/ 5</span></div><div class="cat-rate__stars">★★★★★</div><div class="cat-rate__count">149 clientes avaliaram nossos profissionais</div></div>'
    +     '<div class="cat-reviews"><h3>Avaliações de quem contratou</h3>'+reviews+'</div>'
    +   '</aside>'
    + '</div></div></section>';

  // ---- CTA especialista ----
  const spec = ''
    + '<section class="cat-spec"><div class="wrap">'
    +   '<h2>Você é especialista em '+cat.label+'?</h2>'
    +   '<p>O Prontto recebe milhares de pedidos por mês e pode ajudar a aumentar a sua renda.</p>'
    +   '<a href="cadastrar.html" class="btn btn-laranja btn-lg">Quero me cadastrar</a>'
    + '</div></section>';

  // ---- Custos médios ----
  const precos = [[500,300,800],[300,450,600],[300,200,1500],[150,200,400],[200,1600,3000]];
  const costItems = pick(flat,4).map((svc,k)=>{
    const p = precos[k%precos.length];
    return '<div class="cost-card">'
      + '<div class="cost-card__label">Custo médio estimado</div>'
      + '<div class="cost-card__val">'+brl(p[0])+'</div>'
      + '<div class="cost-card__svc">'+svc+'</div>'
      + '<div class="cost-card__range"><div><span>Menor custo</span><b>'+brl(p[1])+'</b></div><div><span>Maior custo</span><b>'+brl(p[2])+'</b></div></div>'
      + '</div>';
  }).join('');
  const costs = ''
    + '<section class="sec sec--tint"><div class="wrap">'
    +   '<div class="sec__head"><h2>Custos médios</h2><p>Conheça o custo estimado para alguns serviços</p></div>'
    +   '<div class="costs">'+costItems+'</div>'
    + '</div></section>';

  // ---- Pedidos similares ----
  const pedidoTxts = [
    'Gostaria de saber o valor para '+focoBaixo+'. Zona oeste, que atenda a região.',
    'Preciso de um orçamento para '+focoBaixo+'. Pode ser ainda esta semana?',
    'Quero contratar '+focoBaixo+' com qualidade e bom preço. Aguardo propostas.',
    'Procuro profissional para '+focoBaixo+'. Atendimento no período da manhã.',
    'Preciso resolver o quanto antes. Alguém disponível para '+focoBaixo+'?',
    'Bom dia! Solicito orçamento de '+focoBaixo+' para a minha residência.',
    'Trabalho com '+focoBaixo+' recorrente, busco parceria de longo prazo.',
    'Gostaria de agendar '+focoBaixo+' para o próximo fim de semana.'
  ];
  const reqItems = NOMES.slice(0,8).map((nome,k)=>(
    '<div class="req-card">'
    + '<div class="req-card__h"><b>'+nome+'</b> contratou especialista em '+focoBaixo+'</div>'
    + '<div class="req-card__txt">'+pedidoTxts[k%pedidoTxts.length]+'</div>'
    + '<div class="req-card__done"><span class="ck">✓</span> Pedido atendido</div>'
    + '</div>'
  )).join('');
  const reqs = ''
    + '<section class="sec"><div class="wrap">'
    +   '<div class="sec__head"><h2>Veja alguns pedidos similares para '+foco+'</h2><p>Esses são os últimos pedidos para essa categoria</p></div>'
    +   '<div class="reqs">'+reqItems+'</div>'
    + '</div></section>';

  // ---- FAQ ----
  const faqData = [
    {q:'O que é '+focoBaixo+'?', a:'<p>'+foco+' reúne serviços executados por profissionais capacitados, com foco em qualidade, segurança e bom acabamento.</p><p>No Prontto você descreve o que precisa, recebe orçamentos de profissionais avaliados e contrata com tranquilidade.</p>'},
    {q:'Qual profissional realiza '+focoBaixo+'?', a:'<p>Profissionais especializados na categoria '+cat.label+', com experiência comprovada e avaliações reais de clientes que já contrataram pela plataforma.</p>'},
    {q:'Como funciona a contratação no Prontto?', a:'<p>É simples: faça o seu pedido gratuitamente, receba propostas de profissionais da sua região, compare avaliações e preços e escolha o melhor. Você paga com segurança somente após a conclusão do serviço.</p>'},
    {q:'Quanto custa '+focoBaixo+'?', a:'<p>O valor varia conforme o tipo de serviço, a complexidade e a sua região. Por isso o ideal é solicitar orçamentos — eles são gratuitos e chegam em até 60 minutos.</p>'},
    {q:'Que outros serviços de '+cat.label+' posso contratar no Prontto?', a:'<p>Você encontra profissionais qualificados para '+flat.slice(0,4).join(', ')+' e muitos outros.</p>'}
  ];
  const faqItems = faqData.map(f=>(
    '<div class="faq__item"><button class="faq__q">'+f.q+'<span class="mk">+</span></button>'
    + '<div class="faq__a"><div class="faq__a-in">'+f.a+'</div></div></div>'
  )).join('');
  const faq = ''
    + '<section class="sec sec--tint"><div class="wrap">'
    +   '<div class="sec__head"><h2>Perguntas Frequentes</h2></div>'
    +   '<div class="faq">'+faqItems+'</div>'
    + '</div></section>';

  // ---- Serviços similares (links) ----
  const similarLinks = flat.map(it =>
    '<a href="'+PC.subLink(cat.key,it)+'">Especialistas em '+it+'</a>'
  ).join('');
  const similar = ''
    + '<section class="sec"><div class="wrap">'
    +   '<div class="sec__head" style="text-align:left;max-width:none;margin-bottom:28px"><h2>Veja serviços similares em '+cat.label+'</h2></div>'
    +   '<div class="linkgrid">'+similarLinks+'</div>'
    + '</div></section>';

  // ---- Cidades ----
  const cityLinks = CIDADES.map(c =>
    '<a href="'+PC.catLink(cat.key)+'">'+foco+' em '+c+'</a>'
  ).join('');
  const cities = ''
    + '<section class="sec sec--tint"><div class="wrap">'
    +   '<div class="sec__head" style="text-align:left;max-width:none;margin-bottom:28px"><h2>Encontre '+foco+' nas principais cidades</h2></div>'
    +   '<div class="linkgrid">'+cityLinks+'</div>'
    + '</div></section>';

  document.getElementById('cat-main').innerHTML =
    crumb + hero + pick_block + spec + costs + reqs + faq + similar + cities;

  // rodapé: serviços = categorias
  document.getElementById('ftServ').innerHTML =
    PC.CATS.map(c => '<a href="'+PC.catLink(c.key)+'">'+c.label+'</a>').join('');

  // FAQ accordion
  document.querySelectorAll('.faq__q').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const item=btn.closest('.faq__item');
      const ans=item.querySelector('.faq__a');
      const open=item.classList.toggle('open');
      ans.style.maxHeight = open ? ans.scrollHeight+'px' : '0';
    });
  });

  function brl(n){ return 'R$ ' + n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2}); }

  window.scrollTo(0,0);
})();
