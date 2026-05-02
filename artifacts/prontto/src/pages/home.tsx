import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useTransform,
  useInView,
  useMotionValue,
  animate,
  type MotionValue,
} from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles, Wrench, TreePine, Hammer, Zap, Paintbrush,
  Droplet, Truck, Star, CheckCircle, Clock, Shield,
  ArrowRight, Menu, X, ChevronRight, Search, AlertTriangle,
  UserCheck, MapPin, Smartphone, ThumbsUp,
} from "lucide-react";

// ─── Animated counter ───────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(count, target, {
      duration: 1.8,
      ease: "easeOut",
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; },
    });
    return c.stop;
  }, [inView, target, suffix, count]);
  return <span ref={ref}>0{suffix}</span>;
}

// ─── Scene illustrations ─────────────────────────────────────────────────────

/** Scene 1 – "O Problema" */
function IllustrationProblem({ p }: { p: MotionValue<number> }) {
  const alertPulse = useTransform(p, [0, 0.1, 0.2], [1, 1.2, 1]);
  const drop1Y = useTransform(p, [0, 0.25], [0, 55]);
  const drop2Y = useTransform(p, [0.02, 0.25], [0, 70]);
  const drop3Y = useTransform(p, [0.04, 0.25], [0, 48]);
  const drop1O = useTransform(p, [0, 0.04, 0.22, 0.25], [0, 1, 1, 0]);
  const drop2O = useTransform(p, [0.02, 0.06, 0.22, 0.25], [0, 1, 1, 0]);
  const drop3O = useTransform(p, [0.04, 0.08, 0.22, 0.25], [0, 1, 1, 0]);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Glow behind */}
      <div className="absolute inset-0 rounded-full bg-red-500/10 blur-3xl" />

      {/* House SVG */}
      <svg viewBox="0 0 200 200" className="absolute w-56 h-56">
        {/* Roof */}
        <polygon points="100,20 180,90 20,90" fill="#1e2d45" stroke="#2d4060" strokeWidth="2" />
        {/* Wall */}
        <rect x="35" y="88" width="130" height="90" rx="4" fill="#1a2740" stroke="#2d4060" strokeWidth="2" />
        {/* Door */}
        <rect x="82" y="130" width="36" height="48" rx="6" fill="#0f1d2e" />
        <circle cx="113" cy="155" r="3" fill="#f97015" />
        {/* Left window */}
        <rect x="46" y="105" width="34" height="28" rx="4" fill="#0f1d2e" stroke="#2d4060" strokeWidth="1.5" />
        <line x1="63" y1="105" x2="63" y2="133" stroke="#2d4060" strokeWidth="1" />
        <line x1="46" y1="119" x2="80" y2="119" stroke="#2d4060" strokeWidth="1" />
        {/* Right window — cracked */}
        <rect x="120" y="105" width="34" height="28" rx="4" fill="#0f1d2e" stroke="#ef4444" strokeWidth="1.5" />
        <polyline points="132,108 138,115 130,120 140,130" stroke="#ef4444" strokeWidth="1.5" fill="none" />
        {/* Pipe stub below right window */}
        <rect x="129" y="133" width="8" height="14" rx="2" fill="#2d4060" />
      </svg>

      {/* Alert badge */}
      <motion.div
        style={{ scale: alertPulse }}
        className="absolute top-2 right-4 w-11 h-11 bg-red-500 rounded-full flex items-center justify-center shadow-xl shadow-red-500/50 z-10"
      >
        <AlertTriangle size={20} className="text-white" />
      </motion.div>

      {/* Water drops */}
      <motion.div style={{ bottom: "32px", left: "calc(50% + 5px)", position: "absolute", width: "8px", height: "12px", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", backgroundColor: "rgb(34 211 238 / 0.9)", y: drop1Y, opacity: drop1O }} />
      <motion.div style={{ bottom: "36px", left: "calc(50% + 14px)", position: "absolute", width: "6px", height: "10px", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", backgroundColor: "rgb(103 232 249 / 0.8)", y: drop2Y, opacity: drop2O }} />
      <motion.div style={{ bottom: "34px", left: "calc(50% - 4px)", position: "absolute", width: "4px", height: "8px", borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%", backgroundColor: "rgb(34 211 238 / 0.7)", y: drop3Y, opacity: drop3O }} />

      {/* Puddle at bottom */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-cyan-500/20 rounded-full blur-sm" />

      {/* Scene label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-white/30 text-[10px] uppercase tracking-[0.2em]">01 / 04</span>
      </div>
    </div>
  );
}

/** Scene 2 – "A Busca" */
function IllustrationSearch({ p }: { p: MotionValue<number> }) {
  const phoneScale = useTransform(p, [0.25, 0.35], [0.75, 1]);
  const card1O = useTransform(p, [0.3, 0.4], [0, 1]);
  const card1X = useTransform(p, [0.3, 0.42], [40, 0]);
  const card2O = useTransform(p, [0.35, 0.45], [0, 1]);
  const card2X = useTransform(p, [0.35, 0.47], [40, 0]);
  const card3O = useTransform(p, [0.4, 0.5], [0, 1]);
  const card3X = useTransform(p, [0.4, 0.52], [40, 0]);

  return (
    <div className="relative w-72 h-72 flex items-center justify-center">
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl" />

      {/* Phone */}
      <motion.div style={{ scale: phoneScale }} className="relative z-10">
        <div className="w-28 h-52 bg-[#0a1628] rounded-[22px] border-2 border-white/20 shadow-2xl shadow-black/60 overflow-hidden flex flex-col">
          {/* Notch */}
          <div className="w-10 h-3 bg-black rounded-b-xl mx-auto mt-1 shrink-0" />
          {/* Status bar */}
          <div className="flex items-center justify-between px-3 py-1 shrink-0">
            <span className="text-[6px] text-white/40">9:41</span>
            <div className="flex gap-0.5">
              <div className="w-2 h-1 bg-white/40 rounded-sm" />
              <div className="w-1 h-1 bg-white/40 rounded-sm" />
            </div>
          </div>
          {/* App header */}
          <div className="px-2.5 py-1 shrink-0">
            <div className="text-[8px] font-extrabold text-primary tracking-tight">PRONTTO</div>
          </div>
          {/* Search bar */}
          <div className="mx-2 mb-2 px-2 py-1.5 bg-white/10 rounded-lg flex items-center gap-1.5 shrink-0">
            <Search size={7} className="text-white/40" />
            <span className="text-[6px] text-white/40">encanamento...</span>
          </div>
          {/* Matches */}
          <div className="flex-1 flex flex-col gap-1.5 px-2 pb-2 overflow-hidden">
            {["João R.", "Carlos M.", "Pedro S."].map((name, i) => (
              <div key={name} className="bg-white/8 rounded-md p-1.5 flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-primary/30 flex items-center justify-center text-[6px] font-bold text-primary shrink-0">
                  {name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[6px] font-bold text-white truncate">{name}</div>
                  <div className="flex gap-0.5 mt-0.5">
                    {[1,2,3,4,5].map(s => <Star key={s} size={4} className="text-primary fill-primary" />)}
                  </div>
                </div>
                <div className="text-[6px] text-green-400 font-bold shrink-0">{i === 0 ? "4km" : i === 1 ? "6km" : "8km"}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Phone glow */}
        <div className="absolute -inset-2 rounded-[28px] bg-primary/15 blur-xl -z-10" />
      </motion.div>

      {/* Floating result cards */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-20">
        {[
          { name: "João Roberto", dist: "4 km", rating: "4.9", jobs: "247", o: card1O, x: card1X },
          { name: "Carlos Mendes", dist: "6 km", rating: "4.8", jobs: "189", o: card2O, x: card2X },
          { name: "Pedro Santos", dist: "8 km", rating: "4.7", jobs: "134", o: card3O, x: card3X },
        ].map(({ name, dist, rating, jobs, o, x }) => (
          <motion.div key={name} style={{ opacity: o, x }}
            className="bg-secondary/90 backdrop-blur border border-white/15 rounded-xl px-3 py-2 w-40 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-white text-[9px] font-bold">{name}</span>
              <span className="text-green-400 text-[8px] font-semibold">{dist}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <Star size={8} className="text-primary fill-primary" />
              <span className="text-white/60 text-[8px]">{rating} · {jobs} serviços</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
        <span className="text-white/30 text-[10px] uppercase tracking-[0.2em]">02 / 04</span>
      </div>
    </div>
  );
}

/** Scene 3 – "A Chegada" */
function IllustrationArrival({ p }: { p: MotionValue<number> }) {
  const avatarScale = useTransform(p, [0.5, 0.62], [0.6, 1]);
  const badgeScale = useTransform(p, [0.58, 0.68], [0, 1]);
  const etaO = useTransform(p, [0.6, 0.7], [0, 1]);
  const routeW = useTransform(p, [0.55, 0.72], ["0%", "100%"]);
  const pinO = useTransform(p, [0.68, 0.75], [0, 1]);

  return (
    <div className="relative w-72 h-72 flex flex-col items-center justify-center gap-3">
      <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-3xl" />

      {/* Map background card */}
      <div className="absolute inset-4 rounded-2xl bg-[#0f1d2e] border border-white/10 overflow-hidden">
        {/* Fake map grid */}
        <div className="absolute inset-0 opacity-[0.15]"
          style={{ backgroundImage: "linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        {/* Route line */}
        <div className="absolute top-1/2 left-[15%] right-[20%] h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div style={{ width: routeW }} className="h-full bg-primary rounded-full" />
        </div>
        {/* Destination pin */}
        <motion.div style={{ opacity: pinO }}
          className="absolute right-[18%] top-[calc(50%-16px)] flex flex-col items-center">
          <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white flex items-center justify-center shadow-lg">
            <CheckCircle size={12} className="text-white" />
          </div>
          <div className="w-2 h-2 bg-green-500 rotate-45 -mt-1" />
        </motion.div>
      </div>

      {/* Professional card floating on top */}
      <motion.div style={{ scale: avatarScale }} className="relative z-10 flex flex-col items-center gap-2 bg-secondary/95 backdrop-blur-md border border-white/20 rounded-2xl px-6 py-4 shadow-2xl">
        {/* Avatar */}
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/40 to-blue-600/30 border-2 border-primary/50 flex items-center justify-center">
            <UserCheck size={32} className="text-primary" />
          </div>
          {/* Verified */}
          <motion.div style={{ scale: badgeScale }}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-secondary flex items-center justify-center">
            <CheckCircle size={12} className="text-white fill-white" strokeWidth={0} />
          </motion.div>
        </div>
        <div className="text-center">
          <p className="text-white text-sm font-bold">Carlos Mendes</p>
          <p className="text-white/50 text-[11px]">Encanador Verificado</p>
          <div className="flex justify-center gap-0.5 mt-1">
            {[1,2,3,4,5].map(s => <Star key={s} size={10} className="text-primary fill-primary" />)}
          </div>
        </div>
        {/* ETA badge */}
        <motion.div style={{ opacity: etaO }}
          className="flex items-center gap-1.5 bg-primary/20 border border-primary/30 rounded-full px-3 py-1">
          <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.2, repeat: Infinity }}
            className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-primary text-[10px] font-bold">A caminho · ~12 min</span>
        </motion.div>
      </motion.div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
        <span className="text-white/30 text-[10px] uppercase tracking-[0.2em]">03 / 04</span>
      </div>
    </div>
  );
}

/** Scene 4 – "Resolvido" */
function IllustrationResult({ p }: { p: MotionValue<number> }) {
  const checkScale = useTransform(p, [0.75, 0.88], [0, 1]);
  const glowO = useTransform(p, [0.78, 0.95], [0, 1]);
  const ringScale1 = useTransform(p, [0.8, 0.92], [0.5, 1.6]);
  const ringO1 = useTransform(p, [0.8, 0.88, 0.92], [0, 0.4, 0]);
  const ringScale2 = useTransform(p, [0.84, 0.96], [0.5, 1.9]);
  const ringO2 = useTransform(p, [0.84, 0.92, 0.96], [0, 0.25, 0]);
  const starsO = useTransform(p, [0.85, 0.95], [0, 1]);
  const starsX = useTransform(p, [0.85, 0.95], [-20, 0]);

  return (
    <div className="relative w-72 h-72 flex flex-col items-center justify-center gap-4">
      {/* Ripple rings */}
      <motion.div style={{ scale: ringScale1, opacity: ringO1 }}
        className="absolute inset-0 m-auto w-32 h-32 rounded-full border-2 border-green-400" />
      <motion.div style={{ scale: ringScale2, opacity: ringO2 }}
        className="absolute inset-0 m-auto w-32 h-32 rounded-full border-2 border-green-400" />

      {/* Glow */}
      <motion.div style={{ opacity: glowO }}
        className="absolute inset-0 m-auto w-40 h-40 rounded-full bg-green-500/25 blur-2xl" />

      {/* Main check circle */}
      <motion.div style={{ scale: checkScale }} className="relative z-10">
        <div className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-2xl shadow-green-500/50">
          <CheckCircle size={56} className="text-white" strokeWidth={2.5} />
        </div>
      </motion.div>

      {/* Stars and text */}
      <motion.div style={{ opacity: starsO, x: starsX }}
        className="relative z-10 flex flex-col items-center gap-2 bg-secondary/90 border border-white/15 rounded-2xl px-6 py-3 shadow-xl">
        <div className="flex gap-1">
          {[1,2,3,4,5].map(s => <Star key={s} size={16} className="text-primary fill-primary" />)}
        </div>
        <p className="text-white text-sm font-bold">Serviço concluído!</p>
        <p className="text-white/50 text-[11px]">Em 18 minutos · R$ 120</p>
        <div className="flex items-center gap-1.5 mt-1">
          <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
            <ThumbsUp size={10} className="text-primary" />
          </div>
          <span className="text-primary text-[10px] font-semibold">Prontto. Problema resolvido.</span>
        </div>
      </motion.div>

      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
        <span className="text-white/30 text-[10px] uppercase tracking-[0.2em]">04 / 04</span>
      </div>
    </div>
  );
}

// ─── Scroll-locked movie ─────────────────────────────────────────────────────
const SCENES = [
  {
    range: [0, 0.25] as [number, number],
    label: "O Problema",
    headline: "Algo quebrou em casa?",
    body: "Vazamentos, elétrica, limpeza ou montagem — imprevistos acontecem. A pergunta é: quem você vai chamar?",
    color: "text-red-400",
  },
  {
    range: [0.25, 0.5] as [number, number],
    label: "A Solução",
    headline: "Abra o Prontto. Encontre o certo.",
    body: "Dezenas de profissionais verificados na sua região, com avaliações reais e disponibilidade imediata.",
    color: "text-blue-400",
  },
  {
    range: [0.5, 0.75] as [number, number],
    label: "A Chegada",
    headline: "Profissional a caminho em minutos.",
    body: "Acompanhe em tempo real. Sem esperas longas, sem telefonemas perdidos. Só você e o profissional certo.",
    color: "text-primary",
  },
  {
    range: [0.75, 1] as [number, number],
    label: "O Resultado",
    headline: "Problema resolvido. Simples assim.",
    body: "Pagamento seguro pela plataforma, avaliação garantida e histórico de todos os seus serviços num só lugar.",
    color: "text-green-400",
  },
];

// Simple piecewise-linear interpolation — no MotionValue needed
function lerp(v: number, input: number[], output: number[]): number {
  if (v <= input[0]) return output[0];
  if (v >= input[input.length - 1]) return output[output.length - 1];
  for (let i = 0; i < input.length - 1; i++) {
    if (v >= input[i] && v <= input[i + 1]) {
      const t = (v - input[i]) / (input[i + 1] - input[i]);
      return output[i] + t * (output[i + 1] - output[i]);
    }
  }
  return output[0];
}

function SceneText({ scene, progress }: { scene: (typeof SCENES)[0]; progress: number }) {
  const [lo, hi] = scene.range;
  const isFirst = lo === 0;
  const isLast = hi === 1;

  const opacity = isFirst
    ? lerp(progress, [0, hi - 0.07, hi], [1, 1, 0])
    : isLast
      ? lerp(progress, [lo, lo + 0.06, 1], [0, 1, 1])
      : lerp(progress, [lo, lo + 0.06, hi - 0.07, hi], [0, 1, 1, 0]);

  const y = isFirst
    ? lerp(progress, [0, hi], [0, -28])
    : isLast
      ? lerp(progress, [lo, lo + 0.1, 1], [28, 0, 0])
      : lerp(progress, [lo, lo + 0.1, hi - 0.1, hi], [28, 0, 0, -28]);

  return (
    <div
      style={{ opacity, transform: `translateY(${y}px)` }}
      className="absolute inset-0 flex flex-col justify-center gap-5"
    >
      <span className={`text-xs font-bold uppercase tracking-[0.2em] ${scene.color}`}>{scene.label}</span>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">{scene.headline}</h2>
      <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-sm">{scene.body}</p>
      {isLast && (
        <Button className="w-fit rounded-[10px] bg-primary hover:bg-primary/90 text-white px-8 h-12 shadow-xl shadow-primary/40 text-sm font-bold mt-2">
          Encontrar Profissional <ArrowRight size={16} className="ml-1.5" />
        </Button>
      )}
    </div>
  );
}

function ScrollMovie() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  // p MotionValue kept only for illustration internal micro-animations
  const p = useMotionValue(0);

  const update = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const v = Math.max(0, Math.min(1, -el.getBoundingClientRect().top / scrollable));
    setProgress(v);
    p.set(v);
  }, [p]);

  useEffect(() => {
    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => window.removeEventListener("scroll", update);
  }, [update]);

  // All values computed directly from progress — no useTransform chains
  const s1O = lerp(progress, [0, 0.22, 0.28], [1, 1, 0]);
  const s2O = lerp(progress, [0.22, 0.28, 0.47, 0.53], [0, 1, 1, 0]);
  const s3O = lerp(progress, [0.47, 0.53, 0.72, 0.78], [0, 1, 1, 0]);
  const s4O = lerp(progress, [0.72, 0.78, 1], [0, 1, 1]);

  const barW = `${progress * 100}%`;

  const dotScales = SCENES.map((s) =>
    lerp(progress, [s.range[0], s.range[1]], [0, 1])
  );

  const hintOpacity = lerp(progress, [0, 0.08], [1, 0]);

  return (
    <div ref={containerRef} style={{ height: "400vh", position: "relative" }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-secondary">
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-white/10 z-30">
          <div style={{ width: barW }} className="h-full bg-primary transition-none" />
        </div>

        {/* Main layout */}
        <div className="relative h-full z-10 flex items-center">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">

            {/* Left – text narration */}
            <div className="relative h-64 lg:h-80">
              {SCENES.map((scene) => (
                <SceneText key={scene.label} scene={scene} progress={progress} />
              ))}
            </div>

            {/* Right – illustrations */}
            <div className="flex items-center justify-center h-64 lg:h-80 relative">
              <div style={{ opacity: s1O }} className="absolute inset-0 flex items-center justify-center">
                <IllustrationProblem p={p} />
              </div>
              <div style={{ opacity: s2O }} className="absolute inset-0 flex items-center justify-center">
                <IllustrationSearch p={p} />
              </div>
              <div style={{ opacity: s3O }} className="absolute inset-0 flex items-center justify-center">
                <IllustrationArrival p={p} />
              </div>
              <div style={{ opacity: s4O }} className="absolute inset-0 flex items-center justify-center">
                <IllustrationResult p={p} />
              </div>
            </div>
          </div>
        </div>

        {/* Scene dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {SCENES.map((s, i) => (
            <div key={s.label} className="relative flex flex-col items-center gap-1.5">
              <div className="relative w-16 h-1 bg-white/15 rounded-full overflow-hidden">
                <div
                  style={{ transform: `scaleX(${dotScales[i]})`, transformOrigin: "left" }}
                  className="absolute inset-0 bg-primary rounded-full"
                />
              </div>
              <span className="text-white/25 text-[8px] uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll hint */}
        <div style={{ opacity: hintOpacity }} className="absolute bottom-6 right-8 flex flex-col items-center gap-1.5 z-20">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 1.4, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center pt-1.5">
            <div className="w-1.5 h-2 bg-white/50 rounded-full" />
          </motion.div>
          <span className="text-white/30 text-[9px] uppercase tracking-widest">Role</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page data ───────────────────────────────────────────────────────────────
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

// ─── Main page ───────────────────────────────────────────────────────────────
export function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
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
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}
            className="flex items-center gap-1 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <span className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${scrolled ? "text-secondary" : "text-white"}`}>
              PRON<span className="text-primary">TTO</span>
            </span>
          </motion.div>

          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="hidden md:flex items-center gap-8">
            {(["servicos", "como-funciona", "para-prestadores"] as const).map((id, i) => (
              <button key={id} onClick={() => scrollToSection(id)}
                className={`text-sm font-medium hover:text-primary transition-colors relative group ${scrolled ? "text-secondary/80" : "text-white/90"}`}>
                {["Serviços", "Como Funciona", "Para Prestadores"][i]}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </motion.nav>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
            className="hidden md:flex items-center gap-3">
            <Button variant="outline" className={`rounded-[10px] text-sm ${scrolled ? "border-border text-secondary" : "border-white/30 text-white hover:bg-white/10"}`}>Minha Área</Button>
            <Button variant="ghost" className={`rounded-[10px] text-sm ${scrolled ? "text-secondary" : "text-white hover:bg-white/10"}`}>Entrar</Button>
            <Button className="rounded-[10px] text-sm bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/30">Cadastre-se</Button>
          </motion.div>

          <button className={`md:hidden p-2 rounded-md ${scrolled ? "text-secondary" : "text-white"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
              className="md:hidden bg-white border-t border-border overflow-hidden">
              <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                {(["servicos", "como-funciona", "para-prestadores"] as const).map((id, i) => (
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

        {/* ── HERO ── */}
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
                <Button size="lg" className="rounded-[10px] bg-primary hover:bg-primary/90 text-white text-base px-8 h-14 shadow-xl shadow-primary/40">
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

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                className="flex flex-col items-center gap-2 mt-4">
                <p className="text-white/30 text-xs uppercase tracking-widest">Role para ver a história</p>
                <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 1.4, repeat: Infinity }}
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
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 0.7 }}
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
                    viewport={{ once: true, amount: 0 }}
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
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto mb-20">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Como Funciona</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-white">Simples, rápido e seguro.</h2>
              <p className="text-lg text-white/60">Contratar um profissional nunca foi tão fácil. São apenas três passos.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+40px)] right-[calc(16.66%+40px)] h-[2px] overflow-hidden">
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 1.2, delay: 0.5, ease: "easeInOut" }}
                  className="h-full bg-gradient-to-r from-primary/40 via-primary to-primary/40 origin-left" />
              </div>
              {steps.map((step, index) => (
                <motion.div key={step.title}
                  initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }}
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
            <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 0.7 }}
              className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-primary text-sm font-semibold uppercase tracking-widest">Depoimentos</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 mb-4 text-secondary">Quem usa, recomenda.</h2>
              <p className="text-lg text-muted-foreground">Milhares de clientes satisfeitos com os serviços prestados pela nossa comunidade.</p>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((review, index) => (
                <motion.div key={index}
                  initial={{ opacity: 0, x: index === 0 ? -40 : index === 2 ? 40 : 0, y: index === 1 ? 40 : 0 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }} viewport={{ once: true, amount: 0 }}
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
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 30 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0 }} transition={{ duration: 0.8, ease: "easeOut" }}
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
