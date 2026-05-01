import { useState, useEffect, useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useInView,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Wrench,
  TreePine,
  Hammer,
  Zap,
  Paintbrush,
  Droplet,
  Truck,
  Star,
  CheckCircle,
  Clock,
  Shield,
  ArrowRight,
  Menu,
  X,
  ChevronRight,
  Search,
  AlertTriangle,
  UserCheck,
} from "lucide-react";

// ─────────────────────────────────────────────
// Animated counter
// ─────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  useEffect(() => {
    if (inView) {
      const controls = animate(count, target, {
        duration: 1.8,
        ease: "easeOut",
        onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; },
      });
      return controls.stop;
    }
  }, [inView, target, suffix, count]);
  return <span ref={ref}>0{suffix}</span>;
}

// ─────────────────────────────────────────────
// Scene 1 – The Problem
// ─────────────────────────────────────────────
function Scene1({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.05, 0.22, 0.28], [0, 1, 1, 0]);
  const y = useTransform(progress, [0, 0.28], [20, -30]);
  const dropY1 = useTransform(progress, [0, 0.22], [0, 40]);
  const dropY2 = useTransform(progress, [0.02, 0.24], [0, 50]);
  const dropY3 = useTransform(progress, [0.04, 0.26], [0, 45]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
      {/* House with dripping water */}
      <div className="relative">
        {/* House body */}
        <div className="relative w-52 h-44">
          {/* Roof */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0"
            style={{ borderLeft: "80px solid transparent", borderRight: "80px solid transparent", borderBottom: "56px solid #1e293b" }} />
          {/* Walls */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120px] h-24 bg-[#1e293b] rounded-b-sm" />
          {/* Door */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-12 bg-secondary/40 rounded-t-full" />
          {/* Windows */}
          <div className="absolute top-16 left-6 w-8 h-8 bg-white/20 rounded-sm border border-white/10" />
          <div className="absolute top-16 right-6 w-8 h-8 bg-white/20 rounded-sm border border-white/10" />
          {/* Alert badge */}
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/40"
          >
            <AlertTriangle size={18} className="text-white fill-white" />
          </motion.div>
        </div>

        {/* Dripping pipe under house */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-3 h-6 bg-blue-400/60 rounded-b-full" />
        <motion.div style={{ y: dropY1 }} className="absolute -bottom-4 left-[calc(50%-2px)] w-1.5 h-4 bg-blue-400/80 rounded-full origin-top" />
        <motion.div style={{ y: dropY2 }} className="absolute -bottom-2 left-[calc(50%+6px)] w-1.5 h-3 bg-blue-300/70 rounded-full origin-top" />
        <motion.div style={{ y: dropY3 }} className="absolute -bottom-3 left-[calc(50%-8px)] w-1 h-3 bg-blue-300/60 rounded-full origin-top" />
      </div>

      <div className="text-center max-w-[260px]">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Cena 1 de 4</p>
        <h3 className="text-white text-2xl font-bold leading-snug">Precisa de ajuda em casa?</h3>
        <p className="text-white/55 text-sm mt-2 leading-relaxed">Problemas surgem. A questão é: quem você vai chamar?</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Scene 2 – The App
// ─────────────────────────────────────────────
function Scene2({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.22, 0.28, 0.47, 0.53], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.22, 0.53], [30, -20]);
  const phoneScale = useTransform(progress, [0.28, 0.47], [0.88, 1]);
  const card1X = useTransform(progress, [0.3, 0.45], [60, 0]);
  const card2X = useTransform(progress, [0.33, 0.47], [80, 0]);
  const card1Opacity = useTransform(progress, [0.3, 0.42], [0, 1]);
  const card2Opacity = useTransform(progress, [0.33, 0.45], [0, 1]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
      <div className="relative flex items-center gap-4">
        {/* Phone mockup */}
        <motion.div style={{ scale: phoneScale }} className="relative">
          <div className="w-32 h-56 bg-[#0f172a] rounded-[20px] border-2 border-white/20 shadow-2xl flex flex-col overflow-hidden">
            {/* Phone notch */}
            <div className="w-12 h-3 bg-black rounded-b-lg mx-auto mt-1 shrink-0" />
            {/* App screen */}
            <div className="flex-1 bg-secondary/80 p-2 flex flex-col gap-1.5">
              <div className="text-[7px] font-bold text-primary text-center">PRONTTO</div>
              <div className="bg-white/10 rounded-lg p-1.5 flex items-center gap-1">
                <Search size={7} className="text-white/50" />
                <span className="text-[6px] text-white/50">Que serviço você precisa?</span>
              </div>
              {[
                { icon: Droplet, name: "Encanamento", c: "text-cyan-400" },
                { icon: Zap, name: "Elétrica", c: "text-yellow-400" },
                { icon: Sparkles, name: "Limpeza", c: "text-blue-400" },
              ].map(({ icon: Icon, name, c }, i) => (
                <motion.div
                  key={name}
                  initial={false}
                  animate={{ opacity: 1, x: 0 }}
                  style={{ opacity: card1Opacity }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/8 rounded-md p-1.5 flex items-center gap-1.5"
                >
                  <Icon size={9} className={c} />
                  <span className="text-[6.5px] text-white/80 font-medium">{name}</span>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Glow */}
          <div className="absolute inset-0 rounded-[20px] bg-primary/20 blur-xl -z-10 scale-110" />
        </motion.div>

        {/* Floating result cards */}
        <div className="flex flex-col gap-3">
          <motion.div style={{ x: card1X, opacity: card1Opacity }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 w-36 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center text-[9px] font-bold text-primary">JR</div>
              <div>
                <p className="text-[8px] font-bold text-white">João Roberto</p>
                <p className="text-[7px] text-white/50">Encanador</p>
              </div>
            </div>
            <div className="flex items-center gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} size={7} className="text-primary fill-primary" />)}
              <span className="text-[7px] text-white/60 ml-1">4.9</span>
            </div>
          </motion.div>
          <motion.div style={{ x: card2X, opacity: card2Opacity }}
            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 w-36 shadow-lg"
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-full bg-green-500/30 flex items-center justify-center">
                <CheckCircle size={12} className="text-green-400" />
              </div>
              <div>
                <p className="text-[8px] font-bold text-white">Verificado</p>
                <p className="text-[7px] text-white/50">47 avaliações</p>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                style={{ width: card2Opacity.get() ? "92%" : "0%" }}
                animate={{ width: "92%" }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="text-center max-w-[280px]">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Cena 2 de 4</p>
        <h3 className="text-white text-2xl font-bold leading-snug">Encontre o profissional certo</h3>
        <p className="text-white/55 text-sm mt-2 leading-relaxed">Profissionais verificados, avaliados e prontos na sua região.</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Star row (avoids hooks inside map)
// ─────────────────────────────────────────────
function StarRow({ starsProgress }: { starsProgress: MotionValue<number> }) {
  const opacities = [
    useTransform(starsProgress, [0, 1], [0.15, 1]),
    useTransform(starsProgress, [1, 2], [0.15, 1]),
    useTransform(starsProgress, [2, 3], [0.15, 1]),
    useTransform(starsProgress, [3, 4], [0.15, 1]),
    useTransform(starsProgress, [4, 5], [0.15, 1]),
  ];
  const scales = [
    useTransform(starsProgress, [0, 1], [0.6, 1]),
    useTransform(starsProgress, [1, 2], [0.6, 1]),
    useTransform(starsProgress, [2, 3], [0.6, 1]),
    useTransform(starsProgress, [3, 4], [0.6, 1]),
    useTransform(starsProgress, [4, 5], [0.6, 1]),
  ];
  return (
    <div className="flex gap-1.5">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div key={i} style={{ opacity: opacities[i], scale: scales[i] }}>
          <Star size={22} className="text-primary fill-primary" />
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Scene 3 – The Professional
// ─────────────────────────────────────────────
function Scene3({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.47, 0.53, 0.72, 0.78], [0, 1, 1, 0]);
  const y = useTransform(progress, [0.47, 0.78], [30, -20]);
  const avatarScale = useTransform(progress, [0.53, 0.68], [0.5, 1]);
  const starsProgress = useTransform(progress, [0.55, 0.7], [0, 5]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-center gap-8 p-8">
      <div className="flex flex-col items-center gap-4">
        {/* Professional avatar */}
        <motion.div style={{ scale: avatarScale }} className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border-4 border-primary/50 flex items-center justify-center shadow-2xl shadow-primary/30">
            <UserCheck size={48} className="text-primary" />
          </div>
          {/* Verified badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 300 }}
            className="absolute -bottom-2 -right-2 w-9 h-9 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-secondary"
          >
            <CheckCircle size={18} className="text-white fill-white" />
          </motion.div>
          {/* Arriving indicator */}
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute -top-2 -left-2 px-2 py-1 bg-primary rounded-full text-[9px] font-bold text-white shadow-lg whitespace-nowrap"
          >
            A caminho...
          </motion.div>
        </motion.div>

        {/* Name and info */}
        <div className="text-center">
          <h4 className="text-white text-lg font-bold">Carlos Mendes</h4>
          <p className="text-white/50 text-sm">Encanador · 8 anos de experiência</p>
        </div>

        {/* Stars */}
        <StarRow starsProgress={starsProgress} />

        {/* Stats strip */}
        <div className="flex items-center gap-6 px-6 py-3 bg-white/8 rounded-2xl border border-white/10">
          {[
            { label: "Trabalhos", value: "247" },
            { label: "Tempo médio", value: "18min" },
            { label: "Taxa de sucesso", value: "99%" },
          ].map(({ label, value }) => (
            <div key={label} className="text-center">
              <p className="text-primary font-bold text-base">{value}</p>
              <p className="text-white/40 text-[10px]">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center max-w-[280px]">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Cena 3 de 4</p>
        <h3 className="text-white text-2xl font-bold leading-snug">Verificado. Avaliado. Prontto.</h3>
        <p className="text-white/55 text-sm mt-2 leading-relaxed">Só profissionais com alta performance aparecem para você.</p>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Scene 4 – The Result (CTA)
// ─────────────────────────────────────────────
function Scene4({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0.72, 0.78, 1], [0, 1, 1]);
  const y = useTransform(progress, [0.72, 0.9], [40, 0]);
  const checkScale = useTransform(progress, [0.78, 0.9], [0, 1]);
  const glowOpacity = useTransform(progress, [0.78, 1], [0, 1]);

  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-center gap-6 p-8">
      {/* Big checkmark */}
      <motion.div style={{ scale: checkScale }} className="relative">
        <motion.div style={{ opacity: glowOpacity }}
          className="absolute inset-0 rounded-full bg-green-500/30 blur-2xl scale-150"
        />
        <div className="relative w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/40">
          <CheckCircle size={60} className="text-white fill-white stroke-none" strokeWidth={0} />
        </div>
        {/* Particles */}
        {[0, 60, 120, 180, 240, 300].map((deg) => (
          <motion.div
            key={deg}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1, 0], opacity: [0, 1, 0] }}
            transition={{ delay: 0.3 + deg / 1800, duration: 1.2, repeat: Infinity, repeatDelay: 2 }}
            className="absolute w-2 h-2 rounded-full bg-primary"
            style={{
              top: "50%", left: "50%",
              transformOrigin: "center",
              transform: `rotate(${deg}deg) translateY(-60px) translateX(-50%)`,
            }}
          />
        ))}
      </motion.div>

      {/* Success message */}
      <div className="text-center max-w-[280px]">
        <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Cena 4 de 4</p>
        <h3 className="text-white text-2xl font-bold leading-snug">Problema resolvido.</h3>
        <p className="text-green-400 font-semibold text-base mt-1">Em menos de 20 minutos.</p>
        <p className="text-white/55 text-sm mt-3 leading-relaxed">
          Mais de 500 profissionais prontos para te atender agora.
        </p>
      </div>

      {/* CTA inside movie */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-3"
      >
        <Button className="rounded-[10px] bg-primary hover:bg-primary/90 text-white px-8 h-12 shadow-xl shadow-primary/40 text-sm font-bold">
          Encontrar Profissional <ArrowRight size={16} className="ml-1" />
        </Button>
        <p className="text-white/35 text-xs">Grátis · Sem compromisso</p>
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Progress dots
// ─────────────────────────────────────────────
function ProgressDots({ progress }: { progress: MotionValue<number> }) {
  const scenes = [
    useTransform(progress, [0, 0.25], [0, 1]),
    useTransform(progress, [0.25, 0.5], [0, 1]),
    useTransform(progress, [0.5, 0.75], [0, 1]),
    useTransform(progress, [0.75, 1], [0, 1]),
  ];
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
      {scenes.map((p, i) => (
        <motion.div key={i} className="relative h-1.5 rounded-full overflow-hidden bg-white/15 w-12">
          <motion.div style={{ scaleX: p }} className="absolute inset-0 bg-primary origin-left rounded-full" />
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────
// Scroll hint
// ─────────────────────────────────────────────
function ScrollHint({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [0, 0.08], [1, 0]);
  return (
    <motion.div style={{ opacity }} className="absolute bottom-8 right-6 flex flex-col items-center gap-1.5 z-20">
      <p className="text-white/40 text-[10px] uppercase tracking-widest">Scroll</p>
      <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }} className="w-4 h-7 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
        <div className="w-1 h-1.5 bg-white/50 rounded-full" />
      </motion.div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────
// Scroll-driven movie
// ─────────────────────────────────────────────
function ScrollMovie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });

  const heroBgOpacity = useTransform(smoothProgress, [0, 1], [1, 0.4]);
  const glow1Y = useTransform(smoothProgress, [0, 1], ["0%", "60%"]);
  const glow2Y = useTransform(smoothProgress, [0, 1], ["0%", "-40%"]);

  return (
    <div ref={containerRef} style={{ height: "350vh", position: "relative" }}>
      {/* Sticky container */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Navy background with animated glow */}
        <div className="absolute inset-0 bg-secondary">
          <motion.div style={{ y: glow1Y, opacity: heroBgOpacity }} className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-primary/25 rounded-full blur-[120px] pointer-events-none" />
          <motion.div style={{ y: glow2Y }} className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.035]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/* Scenes layer */}
        <div className="relative h-full z-10">
          <Scene1 progress={smoothProgress} />
          <Scene2 progress={smoothProgress} />
          <Scene3 progress={smoothProgress} />
          <Scene4 progress={smoothProgress} />
        </div>

        {/* Progress bar at top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-20">
          <motion.div style={{ scaleX: smoothProgress }} className="h-full bg-primary origin-left" />
        </div>

        {/* Progress dots */}
        <ProgressDots progress={smoothProgress} />

        {/* Scroll hint */}
        <ScrollHint progress={smoothProgress} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────
const services = [
  { icon: Sparkles, name: "Limpeza", color: "bg-blue-50 text-blue-500", border: "hover:border-blue-200" },
  { icon: Wrench, name: "Reparos", color: "bg-orange-50 text-orange-500", border: "hover:border-orange-200" },
  { icon: TreePine, name: "Jardinagem", color: "bg-green-50 text-green-500", border: "hover:border-green-200" },
  { icon: Hammer, name: "Montagem", color: "bg-purple-50 text-purple-500", border: "hover:border-purple-200" },
  { icon: Zap, name: "Elétrica", color: "bg-yellow-50 text-yellow-500", border: "hover:border-yellow-200" },
  { icon: Paintbrush, name: "Pintura", color: "bg-pink-50 text-pink-500", border: "hover:border-pink-200" },
  { icon: Droplet, name: "Encanamento", color: "bg-cyan-50 text-cyan-500", border: "hover:border-cyan-200" },
  { icon: Truck, name: "Mudança", color: "bg-indigo-50 text-indigo-500", border: "hover:border-indigo-200" },
];

const steps = [
  { icon: Search, number: "01", title: "Escolha o serviço", desc: "Selecione a categoria e nos conte o que você precisa com alguns detalhes." },
  { icon: Shield, number: "02", title: "Encontre o profissional", desc: "Receba orçamentos de profissionais verificados e avaliados na sua região." },
  { icon: Clock, number: "03", title: "Agende e pronto", desc: "Combine o dia e horário. O pagamento é feito de forma segura pela plataforma." },
];

const reviews = [
  { name: "Mariana Silva", city: "São Paulo, SP", text: "Precisei de um encanador com urgência no domingo. Em 30 minutos encontrei o Roberto que resolveu tudo rápido e com preço justo.", rating: 5 },
  { name: "Carlos Eduardo", city: "Belo Horizonte, MG", text: "Excelente plataforma! Já contratei para pintura e montagem de móveis. Todos os profissionais foram muito educados e caprichosos.", rating: 5 },
  { name: "Ana Paula", city: "Rio de Janeiro, RJ", text: "A segurança de saber que os profissionais são verificados faz toda a diferença. O aplicativo é super fácil de usar.", rating: 5 },
];

// ─────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────
export function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col font-sans text-secondary overflow-x-hidden">

      {/* ── HEADER ── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"}`}>
        <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <span className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${scrolled ? "text-secondary" : "text-white"}`}>
              PRON<span className="text-primary">TTO</span>
            </span>
          </motion.div>

          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="hidden md:flex items-center gap-8">
            {["servicos", "como-funciona", "para-prestadores"].map((id, i) => (
              <button key={id} onClick={() => scrollToSection(id)}
                className={`text-sm font-medium hover:text-primary transition-colors relative group ${scrolled ? "text-secondary/80" : "text-white/90"}`}>
                {["Serviços", "Como Funciona", "Para Prestadores"][i]}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </motion.nav>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="hidden md:flex items-center gap-3">
            <Button variant="outline" className={`rounded-[10px] text-sm ${scrolled ? "border-border text-secondary" : "border-white/30 text-white hover:bg-white/10"}`}>Minha Área</Button>
            <Button variant="ghost" className={`rounded-[10px] text-sm ${scrolled ? "text-secondary" : "text-white hover:bg-white/10"}`}>Entrar</Button>
            <Button className="rounded-[10px] text-sm bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30">Cadastre-se</Button>
          </motion.div>

          <button className={`md:hidden p-2 rounded-md transition-colors ${scrolled ? "text-secondary" : "text-white"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-border overflow-hidden">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {["servicos", "como-funciona", "para-prestadores"].map((id, i) => (
                  <button key={id} onClick={() => scrollToSection(id)} className="text-left py-2 text-secondary font-medium border-b border-border/50 last:border-0">
                    {["Serviços", "Como Funciona", "Para Prestadores"][i]}
                  </button>
                ))}
                <Button variant="outline" className="w-full mt-2 rounded-[10px]">Minha Área</Button>
                <Button className="w-full rounded-[10px] bg-primary text-white">Cadastre-se</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="flex-1">

        {/* ── HERO (above movie) ── */}
        <section className="relative pt-32 pb-20 md:pt-44 md:pb-20 bg-secondary text-white overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center flex flex-col items-center gap-6">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 text-sm text-white/80 w-fit">
                <Sparkles size={14} className="text-primary" />
                Serviços sob demanda
              </motion.div>

              <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
                O profissional certo,{" "}
                <span className="text-primary relative inline-block">
                  prontto
                  <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.7, ease: "easeOut" }}
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary/40 origin-left" />
                </span>{" "}
                pra você.
              </motion.h1>

              <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg md:text-xl text-white/70 max-w-[560px] leading-relaxed">
                Conectamos você aos melhores prestadores de serviço da sua região — limpeza, reparos, jardinagem, montagem e muito mais.
              </motion.p>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
                className="flex flex-col sm:flex-row gap-4 pt-2">
                <Button size="lg" className="rounded-[10px] bg-primary hover:bg-primary/90 text-white text-base px-8 h-14 shadow-xl shadow-primary/40 hover:scale-[1.02] transition-transform active:scale-[0.98]">
                  Encontrar Profissional <ChevronRight size={18} className="ml-1" />
                </Button>
                <Button size="lg" variant="outline" className="rounded-[10px] border-white/20 text-white hover:bg-white/10 text-base px-8 h-14">
                  Ver como funciona
                </Button>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.7 }}
                className="flex flex-wrap justify-center items-center gap-10 pt-8 border-t border-white/10 mt-4">
                {[{ target: 500, suffix: "+", label: "Profissionais" }, { target: 15, suffix: "+", label: "Categorias" }, { target: 4.8, suffix: "★", label: "Avaliação Média" }].map(stat => (
                  <div key={stat.label} className="flex flex-col items-center">
                    <span className="text-3xl font-bold text-white"><AnimatedCounter target={stat.target} suffix={stat.suffix} /></span>
                    <span className="text-sm text-white/50 mt-0.5">{stat.label}</span>
                  </div>
                ))}
              </motion.div>

              {/* Scroll-down nudge */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                className="flex flex-col items-center gap-2 mt-6">
                <p className="text-white/30 text-xs uppercase tracking-widest">Role para ver a história</p>
                <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}
                  className="w-5 h-8 rounded-full border border-white/20 flex items-start justify-center pt-1.5">
                  <div className="w-1.5 h-2 bg-white/50 rounded-full" />
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── SCROLL MOVIE ── */}
        <ScrollMovie />

        {/* ── SERVICES ── */}
        <section id="servicos" className="py-28 bg-background">
          <div className="container mx-auto px-4 md:px-6">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Categorias</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Serviços para todas as suas necessidades</h2>
              <p className="text-lg text-muted-foreground">De pequenos reparos a grandes projetos, encontre o profissional ideal.</p>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
              {services.map((service, index) => {
                const row = Math.floor(index / 4);
                const col = index % 4;
                return (
                  <motion.div key={service.name}
                    initial={{ opacity: 0, y: 40 + row * 10, x: (col - 1.5) * 10 }}
                    whileInView={{ opacity: 1, y: 0, x: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.55, delay: index * 0.07, ease: "easeOut" }}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}>
                    <Card className={`group cursor-pointer border-border/40 bg-white hover:shadow-xl transition-all duration-300 ${service.border}`}>
                      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
                        <motion.div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${service.color}`}
                          whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }} transition={{ duration: 0.4 }}>
                          <service.icon size={30} />
                        </motion.div>
                        <h3 className="font-bold text-base text-secondary group-hover:text-primary transition-colors">{service.name}</h3>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }} className="mt-12 text-center">
              <Button variant="outline" className="rounded-[10px] gap-2 hover:border-primary hover:text-primary transition-colors">
                Ver todas as categorias <ArrowRight size={16} />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section id="como-funciona" className="py-28 bg-secondary relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Como Funciona</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-white">Simples, rápido e seguro.</h2>
              <p className="text-lg text-white/60">Contratar um profissional nunca foi tão fácil. São apenas três passos.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-[2px] overflow-hidden">
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 origin-left" />
              </div>

              {steps.map((step, index) => (
                <motion.div key={step.title}
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: index * 0.2, ease: "easeOut" }}
                  className="relative z-10 flex flex-col items-center text-center gap-5">
                  <motion.div className="w-24 h-24 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-primary relative"
                    whileInView={{ borderColor: ["rgba(255,255,255,0.1)", "rgba(249,112,21,0.6)", "rgba(255,255,255,0.2)"] }}
                    transition={{ duration: 1.5, delay: index * 0.25 + 0.4 }} viewport={{ once: true }}>
                    <step.icon size={36} />
                    <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">{step.number}</span>
                  </motion.div>
                  <h3 className="text-xl font-bold text-white">{step.title}</h3>
                  <p className="text-white/55 leading-relaxed max-w-[260px]">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-28 bg-background relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0">
            <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full" preserveAspectRatio="none">
              <path d="M0 0L1440 0L1440 30C1200 60 960 0 720 30C480 60 240 0 0 30L0 0Z" fill="hsl(218 31% 12%)" />
            </svg>
          </div>
          <div className="container mx-auto px-4 md:px-6 pt-10">
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Depoimentos</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Quem usa, recomenda.</h2>
              <p className="text-lg text-muted-foreground">Milhares de clientes satisfeitos com os serviços prestados pela nossa comunidade.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, x: index === 0 ? -40 : index === 2 ? 40 : 0, y: index === 1 ? 40 : 0 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.65, delay: index * 0.15, ease: "easeOut" }}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}>
                  <Card className="h-full bg-white border-border/40 hover:shadow-xl hover:border-primary/20 transition-all duration-300">
                    <CardContent className="p-8 flex flex-col gap-5">
                      <div className="flex gap-1">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <motion.div key={i} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                            transition={{ delay: index * 0.15 + i * 0.08 + 0.3, type: "spring", stiffness: 300 }}>
                            <Star size={16} className="text-primary fill-primary" />
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-secondary/75 leading-relaxed flex-1 text-[15px]">"{review.text}"</p>
                      <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm shrink-0">{review.name.charAt(0)}</div>
                        <div>
                          <p className="font-bold text-sm text-secondary">{review.name}</p>
                          <p className="text-xs text-muted-foreground">{review.city}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA PROFESSIONALS ── */}
        <section id="para-prestadores" className="py-28 bg-primary relative overflow-hidden">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-white/10 opacity-30" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full border border-white/10 opacity-30" />

          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto text-center flex flex-col items-center gap-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-white text-sm font-semibold">Para Prestadores</span>
              <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">É profissional?<br />Aumente sua renda!</h2>
              <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed">
                Cadastre-se na Prontto e comece a receber clientes da sua região. Você define seus preços e horários — sem taxa de adesão.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" className="rounded-[10px] font-bold px-8 h-14 bg-white text-primary hover:bg-white/90 shadow-2xl shadow-black/20">
                    Quero ser um prestador <ArrowRight size={18} className="ml-2" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                  <Button size="lg" variant="outline" className="rounded-[10px] text-white border-white/30 hover:bg-white/15 px-8 h-14">Saiba mais</Button>
                </motion.div>
              </div>
              <div className="flex flex-wrap justify-center gap-x-8 gap-y-3 pt-4">
                {["Sem taxa de adesão", "Receba por Pix", "Você decide sua agenda"].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-2 text-white/80 text-sm">
                    <CheckCircle size={15} className="text-white/90" /> {benefit}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── FOOTER ── */}
      <footer className="bg-secondary pt-20 pb-10 text-white/60">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
            <div className="col-span-2 lg:col-span-2">
              <span className="text-3xl font-extrabold tracking-tight text-white block mb-5">PRON<span className="text-primary">TTO</span></span>
              <p className="mb-6 max-w-sm leading-relaxed">O marketplace de serviços domésticos que conecta você aos melhores profissionais da sua região.</p>
            </div>
            {[
              { title: "Plataforma", links: ["Como funciona", "Serviços", "Preços", "Avaliações"] },
              { title: "Profissionais", links: ["Cadastre-se", "Central de Ajuda", "Regras da Comunidade"] },
              { title: "Empresa", links: ["Sobre nós", "Contato", "Termos de Uso", "Privacidade"] },
            ].map((col) => (
              <div key={col.title}>
                <h4 className="font-bold text-white mb-5 text-sm uppercase tracking-wider">{col.title}</h4>
                <ul className="flex flex-col gap-3">
                  {col.links.map((link) => (<li key={link}><a href="#" className="text-sm hover:text-primary transition-colors">{link}</a></li>))}
                </ul>
              </div>
            ))}
          </motion.div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">&copy; {new Date().getFullYear()} Prontto. Todos os direitos reservados.</p>
            <div className="flex items-center gap-3">
              {["In", "Fb", "Ig"].map((social) => (
                <motion.div key={social} whileHover={{ scale: 1.15, backgroundColor: "hsl(24 94% 53%)" }}
                  className="w-9 h-9 rounded-full bg-white/8 flex items-center justify-center cursor-pointer text-xs font-bold text-white">
                  {social}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
