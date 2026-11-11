import React, { useState, useRef, useId } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap,
  Users,
  ShieldCheck,
  CalendarCheck,
  CreditCard,
  Bell,
  BookOpen,
  ArrowRight,
  Sparkles,
  Heart,
  Award,
  Layers,
  School,
  Lock,
} from 'lucide-react';
import {
  staggerContainer,
  wordVariants,
  fadeUpVariant,
  springPillVariant,
  cardRevealLeft,
  cardRevealRight,
  featureItemVariant,
} from '@/lib/animations';

// --- Particle configuration (22 lightweight ambient particles) ---
const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: `${(i * 4.5 + 3) % 94}%`,
  top: `${(i * 7 + 10) % 85}%`,
  size: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 2.5,
  duration: 8 + (i % 7) * 2,
  delay: (i % 6) * 0.8,
  type: i % 5 === 0 ? 'star' : 'dot',
}));

// --- Animated SVG Checkbox with Stroke Draw Animation ---
function AnimatedCheck({ color = '#3B5BDB' }: { color?: string }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <motion.circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="2"
        initial={{ pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      <motion.path
        d="M8 12.5L10.5 15L16 9.5"
        stroke={color}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: shouldReduceMotion ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, delay: 0.2, ease: 'easeOut' }}
      />
    </svg>
  );
}

// --- Interactive 3D Tilt Ecosystem Card Component ---
function EcosystemCard({ shouldReduceMotion }: { shouldReduceMotion: boolean | null }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [6, -6]);
  const rotateY = useTransform(x, [-100, 100], [-6, 6]);

  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);

    const relX = ((e.clientX - rect.left) / rect.width) * 100;
    const relY = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x: relX, y: relY });
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <div className="relative my-8 sm:my-10 w-full max-w-2xl perspective-1000">
      {/* 3B: Sunrise Radial Glow behind the ecosystem card */}
      <div
        className="absolute inset-0 -inset-x-8 -inset-y-8 bg-gradient-to-r from-[#3B5BDB]/25 via-[#8B5CF6]/30 to-[#38BDF8]/20 rounded-full blur-3xl pointer-events-none animate-sunrise-glow"
        aria-hidden="true"
      />

      {/* 4B: Four Floating Icon Badges with independent floats and hover wiggle */}
      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -10, 0],
                rotate: [-4, 6, -4],
                scale: [1, 1.05, 1],
              }
        }
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        whileHover={{ scale: 1.18, rotate: 12 }}
        className="absolute -top-4 -left-4 sm:left-4 z-20 w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white flex items-center justify-center text-[#8B5CF6] cursor-pointer transition-shadow hover:shadow-[#8B5CF6]/30"
        title="Knowledge & Learning Materials"
      >
        <BookOpen size={22} />
      </motion.div>

      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -12, 0],
                rotate: [6, -6, 6],
                scale: [1, 1.04, 1],
              }
        }
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
        whileHover={{ scale: 1.18, rotate: -12 }}
        className="absolute -top-6 -right-2 sm:right-6 z-20 w-12 h-12 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white flex items-center justify-center text-[#3B5BDB] cursor-pointer transition-shadow hover:shadow-[#3B5BDB]/30"
        title="Academic Excellence"
      >
        <Award size={22} />
      </motion.div>

      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -9, 0],
                rotate: [-6, 5, -6],
                scale: [1, 1.06, 1],
              }
        }
        transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1.2 }}
        whileHover={{ scale: 1.18, rotate: 14 }}
        className="absolute -bottom-4 left-10 z-20 w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white flex items-center justify-center text-[#16A36A] cursor-pointer transition-shadow hover:shadow-[#16A36A]/30"
        title="Student Wellbeing"
      >
        <Heart size={20} />
      </motion.div>

      <motion.div
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -11, 0],
                rotate: [4, -5, 4],
                scale: [1, 1.05, 1],
              }
        }
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.8 }}
        whileHover={{ scale: 1.18, rotate: -14 }}
        className="absolute -bottom-3 right-12 z-20 w-11 h-11 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-white flex items-center justify-center text-[#38BDF8] cursor-pointer transition-shadow hover:shadow-[#38BDF8]/30"
        title="Innovation & Technology"
      >
        <Sparkles size={20} />
      </motion.div>

      {/* 4A: Main Card Floating Motion & 4D: Interactive 3D Tilt */}
      <motion.div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={
          shouldReduceMotion
            ? {}
            : {
                y: [0, -10, 0],
              }
        }
        transition={{
          y: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative mx-auto rounded-3xl p-[2px] overflow-hidden shadow-2xl transition-shadow duration-300"
      >
        {/* 4C: Rotating Conic Border Gradient (Indigo, Violet, Blue) */}
        <div
          className="absolute -inset-[100%] animate-spin-slow opacity-80"
          style={{
            background:
              'conic-gradient(from 0deg, #172554, #3B5BDB, #8B5CF6, #38BDF8, #8B5CF6, #3B5BDB, #172554)',
          }}
        />

        {/* Inner Card Container */}
        <div className="relative rounded-[22px] bg-gradient-to-b from-white/95 to-[#F8FAFC]/95 p-6 sm:p-8 border border-white shadow-inner flex flex-col sm:flex-row items-center gap-6 overflow-hidden backdrop-blur-md">
          {/* Cursor Follow Moving Light Highlight */}
          {isHovered && !shouldReduceMotion && (
            <div
              className="absolute pointer-events-none inset-0 opacity-40 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 240px at ${mousePos.x}% ${mousePos.y}%, rgba(255, 255, 255, 0.9), transparent 70%)`,
              }}
            />
          )}

          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-tr from-[#172554] via-[#3B5BDB] to-[#8B5CF6] flex items-center justify-center text-white shrink-0 shadow-xl ring-4 ring-[#DBE4FF]">
            <School size={56} className="text-white drop-shadow-md" />
          </div>

          <div className="text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#3B5BDB]/10 text-[#3B5BDB]">
                State-of-the-Art Infrastructure
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#16A36A]/10 text-[#16A36A]">
                CBSE & Matriculation
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-[#172554] leading-tight">
              Sunrise Digital Campus Ecosystem
            </h2>
            <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
              Real-time attendance registers, continuous academic assessments, secure fee invoicing, and transparent parent-teacher communications.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- Interactive Portal Card with Spotlight Glow & Magnetic Button ---
interface PortalCardProps {
  type: 'parent' | 'admin';
  title: string;
  badge: string;
  badgeColor: string;
  badgeTextColor: string;
  badgeBorder: string;
  description: string;
  icon: React.ElementType;
  iconGradient: string;
  buttonText: string;
  buttonGradient: string;
  buttonShadow: string;
  helperText: string;
  features: { label: string; color: string }[];
  onNavigate: () => void;
  shouldReduceMotion: boolean | null;
}

function PortalCard({
  type,
  title,
  badge,
  badgeColor,
  badgeTextColor,
  badgeBorder,
  description,
  icon: Icon,
  iconGradient,
  buttonText,
  buttonGradient,
  buttonShadow,
  helperText,
  features,
  onNavigate,
  shouldReduceMotion,
}: PortalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic button offset
  const btnX = useMotionValue(0);
  const btnY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleBtnMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldReduceMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);
    btnX.set(x * 0.15);
    btnY.set(y * 0.15);
  };

  const handleBtnMouseLeave = () => {
    btnX.set(0);
    btnY.set(0);
  };

  const revealVariant = type === 'parent' ? cardRevealLeft : cardRevealRight;

  return (
    <motion.div
      ref={cardRef}
      variants={revealVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      whileHover={
        shouldReduceMotion
          ? {}
          : {
              y: -8,
              scale: 1.02,
              transition: { duration: 0.28, ease: 'easeOut' },
            }
      }
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-3xl p-1 bg-gradient-to-br from-white/80 via-white/40 to-white/90 shadow-xl hover:shadow-2xl transition-all duration-300"
    >
      {/* 5B: Animated Border Gradient & Spotlight Glow following cursor */}
      {isHovered && !shouldReduceMotion && (
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 300px at ${mousePos.x}px ${mousePos.y}px, ${
              type === 'parent' ? 'rgba(139, 92, 246, 0.25)' : 'rgba(56, 189, 248, 0.25)'
            }, transparent 80%)`,
          }}
        />
      )}

      <div className="relative h-full rounded-[22px] bg-white/95 backdrop-blur-xl p-7 sm:p-8 flex flex-col justify-between border border-white/80 overflow-hidden">
        <div>
          {/* Header & Icon */}
          <div className="flex items-center justify-between mb-5">
            <div
              className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${iconGradient} text-white flex items-center justify-center shadow-lg group-hover:rotate-3 transition-transform`}
            >
              <Icon size={28} />
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor} ${badgeTextColor} border ${badgeBorder}`}
            >
              {badge}
            </span>
          </div>

          <h3 className="text-2xl font-black text-[#172554] tracking-tight">{title}</h3>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1.5 leading-relaxed">{description}</p>

          {/* 5C: Feature Checklist with Staggered Entrance & SVG Check Draw */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="mt-6 pt-5 border-t border-[#F1F5F9] space-y-2.5"
          >
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                variants={featureItemVariant}
                className="flex items-center gap-2.5 text-xs text-[#334155] font-medium"
              >
                <div className="w-5 h-5 rounded-full bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-center shrink-0">
                  <AnimatedCheck color={feat.color} />
                </div>
                <span>{feat.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 5D: Portal Action Button with Shimmer Sweep & Magnetic Float */}
        <div className="mt-8 pt-4">
          <motion.button
            onClick={onNavigate}
            onMouseMove={handleBtnMouseMove}
            onMouseLeave={handleBtnMouseLeave}
            style={{
              x: shouldReduceMotion ? 0 : btnX,
              y: shouldReduceMotion ? 0 : btnY,
            }}
            whileTap={{ scale: 0.98 }}
            className={`relative w-full overflow-hidden bg-gradient-to-r ${buttonGradient} text-white font-bold text-sm ${buttonShadow} py-4 rounded-xl flex items-center justify-center gap-2 group-hover:gap-3 transition-all cursor-pointer`}
          >
            {/* Shimmer sweep effect */}
            <div
              className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none animate-shimmer-sweep"
              aria-hidden="true"
            />
            <span className="relative z-10">{buttonText}</span>
            <ArrowRight size={18} className="relative z-10 transition-transform group-hover:translate-x-1" />
          </motion.button>
          <p className="text-[11px] text-center text-[#94A3B8] mt-2 font-medium">{helperText}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// MAIN UPGRADED LANDING PAGE COMPONENT
// ============================================================================
export function WelcomeLandingPage() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();

  // Scroll Progress Indicator (6C)
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // 3A: Gradient Orbs Drifting Configuration (20-30s loops)
  const driftingOrbs = [
    {
      size: 'w-80 h-80',
      color: 'from-[#3B5BDB]/20 via-[#8B5CF6]/20 to-transparent',
      animate: {
        x: [0, 45, -30, 0],
        y: [0, -60, 40, 0],
        scale: [1, 1.12, 0.94, 1],
      },
      duration: 22,
      delay: 0,
      style: { left: '4%', top: '8%' },
    },
    {
      size: 'w-96 h-96',
      color: 'from-[#38BDF8]/20 via-[#3B5BDB]/15 to-transparent',
      animate: {
        x: [0, -50, 40, 0],
        y: [0, 50, -45, 0],
        scale: [1, 0.95, 1.1, 1],
      },
      duration: 26,
      delay: 2,
      style: { right: '4%', top: '12%' },
    },
    {
      size: 'w-88 h-88',
      color: 'from-[#F472B6]/15 via-[#8B5CF6]/15 to-transparent',
      animate: {
        x: [0, 40, -50, 0],
        y: [0, 40, -55, 0],
        scale: [1, 1.08, 0.92, 1],
      },
      duration: 24,
      delay: 1,
      style: { left: '18%', bottom: '8%' },
    },
    {
      size: 'w-72 h-72',
      color: 'from-[#16A36A]/15 via-[#38BDF8]/15 to-transparent',
      animate: {
        x: [0, -35, 35, 0],
        y: [0, -45, 45, 0],
        scale: [1, 1.1, 0.95, 1],
      },
      duration: 20,
      delay: 3,
      style: { right: '14%', bottom: '12%' },
    },
  ];

  // Heading split for word-by-word animation (Section 2)
  const headingWords = ['Welcome', 'to'];

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-[#F8FAFC] via-[#EFF6FF] to-[#F5F3FF] text-[#172033] flex flex-col justify-between overflow-x-hidden selection:bg-[#3B5BDB] selection:text-white">
      {/* 6C: Top Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#172554] via-[#3B5BDB] to-[#8B5CF6] z-50 origin-left"
        style={{ scaleX }}
      />

      {/* 3: BACKGROUND ANIMATION LAYER (Orbs, Sunrise Glow, Particles) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* 3A: Slowly Drifting Gradient Orbs */}
        {driftingOrbs.map((orb, idx) => (
          <motion.div
            key={idx}
            className={`absolute rounded-full bg-gradient-to-tr ${orb.color} ${orb.size} blur-3xl`}
            style={orb.style}
            animate={shouldReduceMotion ? {} : orb.animate}
            transition={{
              duration: orb.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: orb.delay,
            }}
          />
        ))}

        {/* 3C: 22 Lightweight Floating Ambient Particles */}
        {!shouldReduceMotion &&
          PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute animate-particle pointer-events-none"
              style={{
                left: p.left,
                top: p.top,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            >
              {p.type === 'star' ? (
                <Sparkles size={8} className="text-[#8B5CF6]/40" />
              ) : (
                <div
                  className="rounded-full bg-[#3B5BDB]/35"
                  style={{ width: `${p.size}px`, height: `${p.size}px` }}
                />
              )}
            </div>
          ))}

        {/* Subtle geometric dot grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#172554 1.5px, transparent 1.5px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* 6: TOP BRAND HEADER WITH MICRO-INTERACTIONS */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          {/* 6B: Logo with Bounce, Rotation & Glow on Hover */}
          <motion.div
            whileHover={
              shouldReduceMotion
                ? {}
                : {
                    scale: 1.12,
                    rotate: [0, -8, 8, 0],
                    boxShadow: '0 0 25px rgba(59, 91, 219, 0.45)',
                    transition: { duration: 0.45 },
                  }
            }
            className="w-11 h-11 bg-gradient-to-tr from-[#172554] via-[#3B5BDB] to-[#8B5CF6] rounded-2xl flex items-center justify-center shadow-lg shadow-[#3B5BDB]/25 ring-2 ring-white cursor-pointer"
          >
            <GraduationCap size={24} className="text-white" />
          </motion.div>
          <div>
            <span className="font-extrabold text-base sm:text-lg text-[#172554] tracking-tight block leading-tight">
              Sunrise International School
            </span>
            <span className="text-[11px] font-semibold text-[#64748B] tracking-wider uppercase">
              Excellence in Education • Estd. 1998
            </span>
          </div>
        </div>

        {/* 6A: Academic Year Status with Pulsing Status Ring */}
        <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-white/80 shadow-xs text-xs font-semibold text-[#172554]">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span>Academic Year 2026–2027 Portal Active</span>
        </div>
      </motion.header>

      {/* HERO SECTION */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 md:py-10 flex-1 flex flex-col items-center justify-center">
        {/* 2: Welcome Text Sequence with Word-by-Word Animation */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          {/* Spring entrance pill with rotating sparkle */}
          <motion.div
            variants={springPillVariant}
            initial="hidden"
            animate="visible"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#DBE4FF] via-[#EDE9FE] to-[#FCE7F3] border border-white/60 text-xs font-bold text-[#3B5BDB] shadow-xs"
          >
            <Sparkles size={14} className="text-[#8B5CF6] animate-spin-slow" />
            <span>Unified Educational Platform</span>
          </motion.div>

          {/* Staggered Word-by-Word Heading */}
          <motion.h1
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="text-3xl sm:text-5xl md:text-6xl font-black text-[#172554] tracking-tight leading-[1.15]"
          >
            {headingWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className="inline-block mr-2 sm:mr-3"
              >
                {word}
              </motion.span>
            ))}

            {/* "Sunrise School" with Indigo -> Violet -> Royal Blue animated gradient shimmer */}
            <motion.span
              variants={wordVariants}
              className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#3B5BDB] via-[#8B5CF6] to-[#4F46E5] animate-text-shimmer"
            >
              Sunrise School
            </motion.span>
          </motion.h1>

          {/* Subtitle with slight upward movement and smooth transition */}
          <motion.p
            variants={fadeUpVariant}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.35 }}
            className="text-sm sm:text-lg text-[#475569] font-medium max-w-2xl mx-auto"
          >
            Connecting Parents, Teachers & Students through an intelligent, seamless and modern digital campus experience.
          </motion.p>
        </div>

        {/* 4: SUNRISE DIGITAL CAMPUS ECOSYSTEM CARD */}
        <EcosystemCard shouldReduceMotion={shouldReduceMotion} />

        {/* 7: CHOOSE YOUR PORTAL SECTION WITH SCROLL REVEAL */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <motion.span
            initial={{ letterSpacing: '0.15em' }}
            whileInView={{ letterSpacing: '0.22em' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-xs font-bold uppercase text-[#3B5BDB] block mb-1"
          >
            ACCESS GATEWAY
          </motion.span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554]">Choose Your Portal</h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Select your destination to access student records or school administration tools
          </p>
        </motion.div>

        {/* 5: TWO INTERACTIVE PORTAL CARDS (Parent & Staff) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full max-w-4xl">
          {/* Card 1: Parent Portal */}
          <PortalCard
            type="parent"
            title="Parent Portal"
            badge="For Parents & Guardians"
            badgeColor="bg-[#EDE9FE]"
            badgeTextColor="text-[#7C3AED]"
            badgeBorder="border-[#DDD6FE]"
            description="Stay connected with your child's learning journey and school activities."
            icon={Users}
            iconGradient="from-[#3B5BDB] to-[#8B5CF6]"
            buttonText="Continue as Parent"
            buttonGradient="from-[#3B5BDB] via-[#4F46E5] to-[#8B5CF6]"
            buttonShadow="shadow-lg shadow-[#3B5BDB]/30"
            helperText="Sign in with registered mobile number & OTP"
            features={[
              { label: 'Real-time Daily Attendance', color: '#3B5BDB' },
              { label: 'Academic Performance & Marks', color: '#8B5CF6' },
              { label: 'School Announcements & Circulars', color: '#F472B6' },
              { label: 'Fee Invoices & Digital Receipts', color: '#16A36A' },
            ]}
            onNavigate={() => navigate('/parent/login')}
            shouldReduceMotion={shouldReduceMotion}
          />

          {/* Card 2: Admin & Staff Portal */}
          <PortalCard
            type="admin"
            title="Admin & Staff Portal"
            badge="Staff & Administration"
            badgeColor="bg-[#DBE4FF]"
            badgeTextColor="text-[#1E40AF]"
            badgeBorder="border-[#BFDBFE]"
            description="Manage school activities with one unified, role-based platform."
            icon={ShieldCheck}
            iconGradient="from-[#172554] via-[#1E3A8A] to-[#3B5BDB]"
            buttonText="Continue to Staff Portal"
            buttonGradient="from-[#172554] via-[#1E3A8A] to-[#3B5BDB]"
            buttonShadow="shadow-lg shadow-[#172554]/25"
            helperText="Super Admin, School Admin, Teacher & Accountant login"
            features={[
              { label: 'Student, Parent & Teacher Rosters', color: '#172554' },
              { label: 'Role-Based Dashboards (Admin/Teacher/Accountant)', color: '#3B5BDB' },
              { label: 'Timetable & Exam Marks Entry', color: '#8B5CF6' },
              { label: 'Fee Accounting & Ledger Receipts', color: '#16A36A' },
            ]}
            onNavigate={() => navigate('/login')}
            shouldReduceMotion={shouldReduceMotion}
          />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 w-full border-t border-[#E2E8F0]/80 bg-white/40 backdrop-blur-md py-4 px-6 text-center text-xs text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Sunrise International School. All rights reserved.</p>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1">
              <Lock size={12} className="text-emerald-600" />
              PostgreSQL Row Level Security
            </span>
            <span>•</span>
            <span>Supabase Realtime Cloud</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
