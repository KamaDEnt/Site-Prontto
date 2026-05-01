import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Sparkles, Wrench, TreePine, Hammer, Zap, 
  Paintbrush, Droplet, Truck, Star, CheckCircle, 
  Clock, Shield, ArrowRight, Menu, X 
} from "lucide-react";

export function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const services = [
    { icon: Sparkles, name: "Limpeza", color: "bg-blue-100 text-blue-600" },
    { icon: Wrench, name: "Reparos", color: "bg-orange-100 text-orange-600" },
    { icon: TreePine, name: "Jardinagem", color: "bg-green-100 text-green-600" },
    { icon: Hammer, name: "Montagem", color: "bg-purple-100 text-purple-600" },
    { icon: Zap, name: "Elétrica", color: "bg-yellow-100 text-yellow-600" },
    { icon: Paintbrush, name: "Pintura", color: "bg-pink-100 text-pink-600" },
    { icon: Droplet, name: "Encanamento", color: "bg-cyan-100 text-cyan-600" },
    { icon: Truck, name: "Mudança", color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-secondary">
      {/* Header */}
      <header 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <span className={`text-2xl font-extrabold tracking-tight ${scrolled ? 'text-secondary' : 'text-white'}`}>
              PRON<span className="text-primary">TTO</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection('servicos')} className={`text-sm font-medium hover:text-primary transition-colors ${scrolled ? 'text-secondary/80' : 'text-white/90'}`}>Serviços</button>
            <button onClick={() => scrollToSection('como-funciona')} className={`text-sm font-medium hover:text-primary transition-colors ${scrolled ? 'text-secondary/80' : 'text-white/90'}`}>Como Funciona</button>
            <button onClick={() => scrollToSection('para-prestadores')} className={`text-sm font-medium hover:text-primary transition-colors ${scrolled ? 'text-secondary/80' : 'text-white/90'}`}>Para Prestadores</button>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="outline" className={`rounded-[10px] ${scrolled ? 'border-border text-secondary' : 'border-white/20 text-white hover:bg-white/10'}`}>Minha Área</Button>
            <Button variant="ghost" className={`rounded-[10px] ${scrolled ? 'text-secondary' : 'text-white hover:bg-white/10'}`}>Entrar</Button>
            <Button className="rounded-[10px] bg-primary text-white hover:bg-primary/90">Cadastre-se</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className={`md:hidden p-2 rounded-md ${scrolled ? 'text-secondary' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-t border-border overflow-hidden"
            >
              <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
                <button onClick={() => scrollToSection('servicos')} className="text-left py-2 text-secondary font-medium">Serviços</button>
                <button onClick={() => scrollToSection('como-funciona')} className="text-left py-2 text-secondary font-medium">Como Funciona</button>
                <button onClick={() => scrollToSection('para-prestadores')} className="text-left py-2 text-secondary font-medium">Para Prestadores</button>
                <div className="h-px w-full bg-border my-2" />
                <Button variant="outline" className="w-full justify-center rounded-[10px]">Minha Área</Button>
                <Button variant="ghost" className="w-full justify-center rounded-[10px]">Entrar</Button>
                <Button className="w-full justify-center rounded-[10px] bg-primary text-white">Cadastre-se</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 bg-secondary text-white overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
          
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="flex flex-col gap-6"
              >
                <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
                  O profissional certo,<br />
                  <span className="text-primary">prontto</span> pra você.
                </motion.h1>
                
                <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/80 max-w-[600px] leading-relaxed">
                  Conectamos você aos melhores prestadores de serviço da sua região. Limpeza, reparos, jardinagem, montagem e muito mais — tudo em um só lugar.
                </motion.p>
                
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button size="lg" className="rounded-[10px] bg-primary hover:bg-primary/90 text-white text-base px-8 h-14">
                    Encontrar Profissional
                  </Button>
                  <Button size="lg" variant="outline" className="rounded-[10px] border-white/20 text-white hover:bg-white/10 text-base px-8 h-14">
                    Ver Categorias
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/10 mt-4">
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">500+</span>
                    <span className="text-sm text-white/60">Profissionais</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white">15+</span>
                    <span className="text-sm text-white/60">Categorias</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-2xl font-bold text-white flex items-center gap-1">
                      4.8<Star className="fill-primary text-primary" size={20} />
                    </span>
                    <span className="text-sm text-white/60">Avaliação Média</span>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="relative lg:h-[600px] flex justify-center items-center"
              >
                <div className="relative w-full max-w-[500px] aspect-square">
                  <img 
                    src="/hero-illustration.png" 
                    alt="Profissionais de serviços" 
                    className="object-contain w-full h-full drop-shadow-2xl rounded-2xl"
                  />
                  
                  {/* Floating badges */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="absolute -top-4 -left-4 bg-white text-secondary p-3 rounded-xl shadow-xl flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">Profissional Verificado</p>
                      <p className="text-xs text-muted-foreground">João - Encanador</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="absolute -bottom-4 -right-4 bg-white text-secondary p-3 rounded-xl shadow-xl flex items-center gap-3"
                  >
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <Star className="text-primary fill-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold">5.0 Avaliação</p>
                      <p className="text-xs text-muted-foreground">Serviço de Limpeza</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicos" className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
                Serviços para todas as suas necessidades
              </h2>
              <p className="text-lg text-muted-foreground">
                De pequenos reparos a grandes projetos, encontre o profissional ideal para deixar sua casa do jeito que você quer.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {services.map((service, index) => (
                <motion.div
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="group hover:border-primary/50 hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 bg-white">
                    <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.color} group-hover:scale-110 transition-transform duration-300`}>
                        <service.icon size={32} />
                      </div>
                      <h3 className="font-bold text-lg">{service.name}</h3>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" className="rounded-[10px] gap-2">
                Ver todas as categorias <ArrowRight size={16} />
              </Button>
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section id="como-funciona" className="py-24 bg-secondary/5">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
                Como Funciona
              </h2>
              <p className="text-lg text-muted-foreground">
                Contratar um profissional nunca foi tão fácil e seguro.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative">
              {/* Connecting line for desktop */}
              <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-border -translate-y-1/2 z-0" />

              {[
                {
                  icon: Sparkles,
                  title: "1. Escolha o serviço",
                  desc: "Selecione a categoria e nos conte o que você precisa com alguns detalhes."
                },
                {
                  icon: Shield,
                  title: "2. Encontre o profissional",
                  desc: "Receba orçamentos de profissionais verificados e avaliados na sua região."
                },
                {
                  icon: Clock,
                  title: "3. Agende e pronto",
                  desc: "Combine o dia e horário. O pagamento é feito de forma segura pela plataforma."
                }
              ].map((step, index) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center gap-4"
                >
                  <div className="w-20 h-20 rounded-full bg-white shadow-md border border-border flex items-center justify-center text-primary mb-2">
                    <step.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-secondary">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust/Testimonials */}
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
                Quem usa, recomenda.
              </h2>
              <p className="text-lg text-muted-foreground">
                Milhares de clientes satisfeitos com os serviços prestados pela nossa comunidade.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Mariana Silva",
                  role: "Cliente",
                  text: "Precisei de um encanador com urgência no domingo. Em 30 minutos encontrei o Roberto que resolveu tudo rápido e com preço justo."
                },
                {
                  name: "Carlos Eduardo",
                  role: "Cliente",
                  text: "Excelente plataforma! Já contratei para pintura e montagem de móveis. Todos os profissionais foram muito educados e caprichosos."
                },
                {
                  name: "Ana Paula",
                  role: "Cliente",
                  text: "A segurança de saber que os profissionais são verificados faz toda a diferença. O aplicativo é super fácil de usar."
                }
              ].map((review, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full bg-white border-border/50 hover:shadow-md transition-all">
                    <CardContent className="p-8 flex flex-col gap-6">
                      <div className="flex gap-1 text-primary">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} size={18} className="fill-current" />
                        ))}
                      </div>
                      <p className="text-secondary/80 italic flex-1">"{review.text}"</p>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-secondary">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA para Prestadores */}
        <section id="para-prestadores" className="py-24 bg-primary relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/10 skew-x-12 translate-x-32" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
              <h2 className="text-3xl md:text-5xl font-bold text-white">
                É profissional? Aumente sua renda!
              </h2>
              <p className="text-lg md:text-xl text-white/90 max-w-2xl">
                Cadastre-se na Prontto e comece a receber clientes da sua região. Você define seus preços e horários.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" variant="secondary" className="rounded-[10px] text-primary font-bold px-8 h-14 bg-white hover:bg-white/90">
                  Quero ser um prestador
                </Button>
                <Button size="lg" variant="outline" className="rounded-[10px] text-white border-white/30 hover:bg-white/10 px-8 h-14">
                  Saiba mais
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-secondary pt-20 pb-10 text-white/70">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <span className="text-3xl font-extrabold tracking-tight text-white block mb-6">
                PRON<span className="text-primary">TTO</span>
              </span>
              <p className="mb-6 max-w-sm">
                O marketplace de serviços domésticos que conecta você aos melhores profissionais da sua região.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-6">Plataforma</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="hover:text-primary transition-colors">Como funciona</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Serviços</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Avaliações</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Profissionais</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="hover:text-primary transition-colors">Cadastre-se</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Regras da Comunidade</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Empresa</h4>
              <ul className="flex flex-col gap-4">
                <li><a href="#" className="hover:text-primary transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidade</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {new Date().getFullYear()} Prontto. Todos os direitos reservados.</p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                {/* Social icons placeholders */}
                <span className="font-bold text-white">In</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="font-bold text-white">Fb</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer">
                <span className="font-bold text-white">Ig</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
