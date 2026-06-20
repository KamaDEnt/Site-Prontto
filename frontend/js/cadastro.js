/* ============================================================
   Prontto — Cadastro em etapas
   1) Identifica tipo (Contratante x Prestador)
   2) Coleta o máximo de dados para validação
   ============================================================ */
(function(){
  const PC = window.ProntoCats;
  const CIDADES = ['São Paulo/SP','Guarulhos/SP','Osasco/SP','Santo André/SP','São Bernardo/SP','Campinas/SP','Rio de Janeiro/RJ','Belo Horizonte/MG','Curitiba/PR','Porto Alegre/RS'];

  const state = { tipo:null, step:0 };

  const FLOWS = {
    contratante: ['Tipo','Dados pessoais','Endereço','Concluir'],
    prestador:   ['Tipo','Dados pessoais','Perfil profissional','Documentos','Concluir']
  };

  const stepsEl = document.getElementById('cadSteps');
  const bodyEl  = document.getElementById('cadBody');
  const footEl  = document.getElementById('cadFootLogin');

  function labels(){ return state.tipo ? FLOWS[state.tipo] : ['Tipo','Dados','…','Concluir']; }

  function renderSteps(){
    const ls = labels();
    let html = '';
    ls.forEach((lb,i)=>{
      const cls = i<state.step ? 'done' : (i===state.step ? 'active' : '');
      const mark = i<state.step ? '✓' : (i+1);
      html += '<div class="cad-step '+cls+'"><span class="cad-step__n">'+mark+'</span><span class="cad-step__lb">'+lb+'</span></div>';
      if(i<ls.length-1) html += '<span class="cad-step__bar '+(i<state.step?'done':'')+'"></span>';
    });
    stepsEl.innerHTML = html;
  }

  /* ---------- blocos de campos reutilizáveis ---------- */
  function fld(o){
    const opt = o.opt ? ' <span class="opt">(opcional)</span>' : '';
    const full = o.full ? ' cad-fld--full' : '';
    let control;
    if(o.type==='select'){
      control = '<select id="'+o.id+'">'+o.options.map(v=>'<option>'+v+'</option>').join('')+'</select>';
    } else if(o.type==='textarea'){
      control = '<textarea id="'+o.id+'" placeholder="'+(o.ph||'')+'"></textarea>';
    } else {
      control = '<input id="'+o.id+'" type="'+(o.type||'text')+'" placeholder="'+(o.ph||'')+'"'+(o.val?' value="'+o.val+'"':'')+'>';
    }
    return '<div class="cad-fld'+full+'"><label for="'+o.id+'">'+o.label+opt+'</label>'+control+(o.hint?'<div class="cad-fld__hint">'+o.hint+'</div>':'')+'</div>';
  }
  function upload(o){
    return '<div class="cad-fld cad-fld--full"><label>'+o.label+(o.opt?' <span class="opt">(opcional)</span>':'')+'</label>'
      + '<label class="cad-up"><input type="file" hidden><span class="cad-up__ic" aria-hidden="true">'+o.ic+'</span>'
      + '<span class="cad-up__txt"><b>'+o.b+'</b><span>'+o.s+'</span></span></label></div>';
  }
  function checks(name, items){
    return '<div class="cad-checks">'+items.map((it,i)=>(
      '<label class="cad-check"><input type="checkbox" name="'+name+'" value="'+it+'"><span>'+it+'</span></label>'
    )).join('')+'</div>';
  }

  /* ---------- conteúdo de cada passo ---------- */
  function stepTipo(){
    return ''
    + '<div class="cad-card">'
    + '<div class="cad-card__title">Como você quer usar o Prontto?</div>'
    + '<div class="cad-card__hint">Selecione o tipo de conta. Você poderá ajustar depois nas configurações.</div>'
    + '<div class="cad-types">'
    +   typeCard('contratante','🏠','Quero contratar','Encontre profissionais e receba orçamentos para o que você precisa.')
    +   typeCard('prestador','🧰','Quero trabalhar','Ofereça seus serviços, receba pedidos e aumente sua renda.')
    + '</div>'
    + '<div class="cad-nav"><a href="index.html" class="btn btn-out">Cancelar</a><div class="cad-nav__spacer"></div>'
    +   '<button type="button" class="btn btn-laranja" id="btnNext" '+(state.tipo?'':'disabled style="opacity:.5;cursor:not-allowed"')+'>Continuar</button></div>'
    + '</div>';
  }
  function typeCard(key,ic,t,d){
    const sel = state.tipo===key ? ' sel' : '';
    return '<button type="button" class="cad-type'+sel+'" data-tipo="'+key+'">'
      + '<span class="cad-type__check" aria-hidden="true">✓</span>'
      + '<span class="cad-type__ic" aria-hidden="true">'+ic+'</span>'
      + '<span class="cad-type__t">'+t+'</span><span class="cad-type__d">'+d+'</span></button>';
  }

  function stepDadosContratante(){
    return card('Seus dados', 'Precisamos confirmar sua identidade para uma contratação segura.',
      '<div class="cad-grid">'
      + fld({id:'nome',label:'Nome completo',full:true,ph:'Como no seu documento'})
      + fld({id:'cpf',label:'CPF',ph:'000.000.000-00'})
      + fld({id:'nasc',label:'Data de nascimento',type:'date'})
      + fld({id:'email',label:'E-mail',type:'email',ph:'seu@email.com'})
      + fld({id:'cel',label:'Celular',type:'tel',ph:'(11) 99999-9999'})
      + fld({id:'senha',label:'Senha',type:'password',ph:'Mínimo 8 caracteres'})
      + fld({id:'senha2',label:'Confirmar senha',type:'password',ph:'Repita a senha'})
      + '</div>', true);
  }
  function stepEnderecoContratante(){
    return card('Endereço', 'Usado para encontrar profissionais perto de você.',
      '<div class="cad-grid">'
      + fld({id:'cep',label:'CEP',ph:'00000-000'})
      + fld({id:'estado',label:'Estado',type:'select',options:['SP','RJ','MG','PR','RS','SC','BA','PE','CE','GO','DF','Outro']})
      + fld({id:'logr',label:'Endereço',full:true,ph:'Rua, avenida...'})
      + fld({id:'num',label:'Número',ph:'123'})
      + fld({id:'compl',label:'Complemento',opt:true,ph:'Apto, bloco...'})
      + fld({id:'bairro',label:'Bairro',ph:'Seu bairro'})
      + fld({id:'cidade',label:'Cidade',ph:'Sua cidade'})
      + '</div>'
      + termos(), true);
  }

  function stepDadosPrestador(){
    return card('Seus dados', 'Quanto mais completo, mais confiança seu perfil transmite — e mais rápido é validado.',
      '<div class="cad-grid">'
      + fld({id:'pessoa',label:'Tipo de cadastro',full:true,type:'select',options:['Pessoa Física (CPF)','Pessoa Jurídica (CNPJ / MEI)']})
      + fld({id:'nome',label:'Nome completo / Razão social',full:true,ph:'Seu nome ou nome da empresa'})
      + fld({id:'doc',label:'CPF / CNPJ',ph:'000.000.000-00'})
      + fld({id:'nasc',label:'Data de nascimento / fundação',type:'date'})
      + fld({id:'email',label:'E-mail',type:'email',ph:'seu@email.com'})
      + fld({id:'cel',label:'Celular / WhatsApp',type:'tel',ph:'(11) 99999-9999'})
      + fld({id:'senha',label:'Senha',type:'password',ph:'Mínimo 8 caracteres'})
      + fld({id:'senha2',label:'Confirmar senha',type:'password',ph:'Repita a senha'})
      + '</div>', true);
  }
  function stepPerfilPrestador(){
    const cats = PC.CATS.map(c=>c.label);
    return card('Perfil profissional', 'Conte o que você faz e onde atende. Isso conecta você aos pedidos certos.',
      '<div class="cad-section-label">Categorias de atuação</div>'
      + checks('cat', cats)
      + '<div class="cad-section-label">Cidades onde atende</div>'
      + checks('cidade', CIDADES)
      + '<div class="cad-grid" style="margin-top:22px">'
      + fld({id:'exp',label:'Anos de experiência',type:'select',options:['Menos de 1 ano','1 a 3 anos','3 a 5 anos','5 a 10 anos','Mais de 10 anos']})
      + fld({id:'valor',label:'Valor médio do serviço',opt:true,ph:'Ex.: R$ 150'})
      + fld({id:'desc',label:'Sobre você e seu trabalho',full:true,type:'textarea',ph:'Descreva sua experiência, especialidades e diferenciais...'})
      + fld({id:'foto',label:'URL da foto de perfil',full:true,opt:true,ph:'https://...',hint:'Um perfil com foto recebe mais contatos.'})
      + '</div>', true);
  }
  function stepDocumentosPrestador(){
    return card('Documentos e validação', 'Enviamos seus dados para análise. Documentos aceleram a aprovação do seu perfil.',
      '<div class="cad-section-label">Documentos para verificação</div>'
      + '<div class="cad-grid">'
      + upload({label:'Documento com foto (RG ou CNH)',ic:'🆔',b:'Enviar arquivo',s:'JPG, PNG ou PDF até 10MB'})
      + upload({label:'Comprovante de residência',ic:'🏠',b:'Enviar arquivo',s:'Conta recente em seu nome'})
      + upload({label:'Selfie segurando o documento',ic:'🤳',b:'Enviar arquivo',s:'Para conferência de identidade'})
      + upload({label:'Certificados / cursos',ic:'📜',b:'Enviar arquivo',s:'Opcional — reforça sua qualificação',opt:true})
      + '</div>'
      + '<div class="cad-section-label">Dados para recebimento</div>'
      + '<div class="cad-grid">'
      + fld({id:'pixtipo',label:'Tipo de chave Pix',type:'select',options:['CPF/CNPJ','E-mail','Celular','Chave aleatória']})
      + fld({id:'pix',label:'Chave Pix',ph:'Sua chave para receber pagamentos'})
      + fld({id:'banco',label:'Banco',full:true,opt:true,ph:'Ex.: Nubank, Itaú, Caixa...'})
      + '</div>'
      + termos(), true);
  }

  function card(title,hint,inner,withNav){
    return '<div class="cad-card"><div class="cad-card__title">'+title+'</div><div class="cad-card__hint">'+hint+'</div>'
      + inner
      + (withNav? nav() : '')
      + '</div>';
  }
  function nav(){
    const isLast = state.step === labels().length-2; // último passo antes de "Concluir"
    return '<div class="cad-nav">'
      + '<button type="button" class="btn btn-out" id="btnBack">Voltar</button>'
      + '<div class="cad-nav__spacer"></div>'
      + '<button type="button" class="btn btn-laranja" id="btnNext">'+(isLast?'Criar conta':'Continuar')+'</button>'
      + '</div>';
  }
  function termos(){
    return '<label class="cad-terms"><input type="checkbox" id="termos"> <span>Li e concordo com os <a href="#">Termos de Uso</a> e a <a href="#">Política de Privacidade</a>, e autorizo a verificação dos dados informados.</span></label>';
  }
  function stepDone(){
    const pres = state.tipo==='prestador';
    return '<div class="cad-card"><div class="cad-done">'
      + '<div class="cad-done__ic" aria-hidden="true">✓</div>'
      + '<h2>'+(pres?'Cadastro enviado para análise!':'Conta criada com sucesso!')+'</h2>'
      + '<p>'+(pres
          ? 'Recebemos seus dados e documentos. Nossa equipe vai validar seu perfil e avisaremos por e-mail assim que ele estiver aprovado.'
          : 'Tudo pronto! Agora você já pode encontrar profissionais e solicitar orçamentos.')+'</p>'
      + '<a href="'+(pres?'seja-profissional.html':'index.html')+'" class="btn btn-laranja btn-lg">'+(pres?'Voltar ao início':'Encontrar profissionais')+'</a>'
      + '</div></div>';
  }

  /* ---------- render por índice ---------- */
  function render(){
    renderSteps();
    footEl.style.display = state.step===0 ? '' : 'none';
    let html='';
    if(state.step===0){ html=stepTipo(); }
    else if(state.tipo==='contratante'){
      if(state.step===1) html=stepDadosContratante();
      else if(state.step===2) html=stepEnderecoContratante();
      else html=stepDone();
    } else { // prestador
      if(state.step===1) html=stepDadosPrestador();
      else if(state.step===2) html=stepPerfilPrestador();
      else if(state.step===3) html=stepDocumentosPrestador();
      else html=stepDone();
    }
    bodyEl.innerHTML = html;
    bind();
    window.scrollTo({top:0,behavior:'smooth'});
  }

  function bind(){
    // seleção de tipo
    bodyEl.querySelectorAll('.cad-type').forEach(btn=>{
      btn.addEventListener('click',()=>{
        state.tipo = btn.dataset.tipo;
        bodyEl.querySelectorAll('.cad-type').forEach(b=>b.classList.remove('sel'));
        btn.classList.add('sel');
        const nx=document.getElementById('btnNext');
        if(nx){ nx.disabled=false; nx.style.opacity='1'; nx.style.cursor='pointer'; }
        renderSteps();
      });
    });
    // checkboxes visual
    bodyEl.querySelectorAll('.cad-check input').forEach(inp=>{
      inp.addEventListener('change',()=>inp.closest('.cad-check').classList.toggle('sel',inp.checked));
    });
    // upload feedback
    bodyEl.querySelectorAll('.cad-up input[type=file]').forEach(inp=>{
      inp.addEventListener('change',()=>{
        if(inp.files && inp.files[0]){
          const b=inp.closest('.cad-up').querySelector('.cad-up__txt b');
          const s=inp.closest('.cad-up').querySelector('.cad-up__txt span');
          b.textContent='✓ '+inp.files[0].name;
          s.textContent='Arquivo selecionado';
          inp.closest('.cad-up').style.borderColor='#1f8a5b';
        }
      });
    });
    const back=document.getElementById('btnBack');
    if(back) back.addEventListener('click',()=>{ if(state.step>0){ state.step--; render(); } });
    const next=document.getElementById('btnNext');
    if(next) next.addEventListener('click',()=>{
      if(state.step===0 && !state.tipo) return;
      state.step++;
      render();
    });
  }

  render();
})();
