import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Menu,
  X,
  Github,
  Linkedin,
  Mail,
  ArrowRight,
  Code,
  Layers,
  Zap,
  Globe,
  Cpu,
  Smartphone,
  Send,
  Download,
  BookOpen,
  Briefcase,
  PenTool,
  Database,
  ChevronDown,
  Phone,
  Sparkles,
  MessageSquare,
  Loader,
  ExternalLink,
  Award,
  Terminal,
  Monitor,
  Server,
  Wifi,
  Layout,
  ShoppingCart,
  MapPin,
  FileText,
  Sun,
  Moon,
} from "lucide-react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";

/**
 * ULTRA-MODERN REACT PORTFOLIO - ABHISHEK WANI
 * --------------------------------------------
 * Features:
 * - Deep Violet/Dark Cyber Aesthetic + Clean Light Mode
 * - Sticky Theme Toggler
 * - "Run-Away" Interactive Physics Objects
 * - Extended Landing Page Sections
 * - Working Contact Form
 * - Gemini AI Features
 */

// --- 1. UTILITY & CONFIGURATION ---

// Theme Configurations
const THEME_DARK = {
  mode: "dark",
  bg: "bg-[#0a0a0f]",
  bgGradient: "bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e]",
  textMain: "text-slate-100",
  textMuted: "text-slate-400",
  accent: "text-violet-400",
  accentBorder: "border-violet-500/30",
  glass: "backdrop-blur-xl bg-white/5 border border-white/10",
  buttonPrimary: "bg-white text-black hover:scale-105",
  buttonSecondary:
    "bg-transparent border border-white/20 text-white hover:bg-white/10",
  navText: "text-slate-400",
  navHover: "hover:text-white",
  navActive: "text-white",
  cardTitle: "text-white",
  iconBg: "bg-violet-500/20 text-violet-400",
  timelineBorder: "border-slate-800",
};

const THEME_LIGHT = {
  mode: "light",
  bg: "bg-slate-50",
  bgGradient: "bg-gradient-to-br from-indigo-50 via-white to-purple-50",
  textMain: "text-slate-900",
  textMuted: "text-slate-600",
  accent: "text-violet-600",
  accentBorder: "border-violet-200",
  glass: "backdrop-blur-xl bg-white/70 border border-slate-200 shadow-lg",
  buttonPrimary: "bg-slate-900 text-white hover:scale-105",
  buttonSecondary:
    "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100",
  navText: "text-slate-500",
  navHover: "hover:text-slate-900",
  navActive: "text-violet-700",
  cardTitle: "text-slate-900",
  iconBg: "bg-violet-100 text-violet-600",
  timelineBorder: "border-slate-300",
};

// Gemini API Helper
const callGemini = async (prompt) => {
  const apiKey = ""; // Injected at runtime
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    return (
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "System busy. Try again."
    );
  } catch (error) {
    console.error("AI Error:", error);
    return "Connection error.";
  }
};

// --- 2. CUSTOM HOOKS & PHYSICS ---

// Hook: Mouse Position for Parallax & Physics
const useMousePosition = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const handleMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);
  return mousePos;
};

// Hook: Run-Away Physics Logic
const useRunAway = (baseX, baseY, sensitivity = 150) => {
  const x = useMotionValue(baseX);
  const y = useMotionValue(baseY);
  const mouse = useMousePosition();

  useEffect(() => {
    if (!mouse.x && !mouse.y) return;

    // Calculate distance
    const dx = mouse.x - x.get();
    const dy = mouse.y - y.get();
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < sensitivity) {
      // Run away!
      const angle = Math.atan2(dy, dx);
      const moveDist = sensitivity - dist;
      const moveX = Math.cos(angle) * moveDist * -2.5;
      const moveY = Math.sin(angle) * moveDist * -2.5;

      x.set(baseX + moveX);
      y.set(baseY + moveY);
    } else {
      // Return to base slowly
      if (x.get() !== baseX) x.set(baseX);
      if (y.get() !== baseY) y.set(baseY);
    }
  }, [mouse, baseX, baseY, sensitivity, x, y]);

  return { x, y };
};

// --- 3. SHARED COMPONENTS ---

// Typewriter Component
const Typewriter = ({ phrases, speed = 100, pause = 2000, theme }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  // Blinking cursor effect
  useEffect(() => {
    const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  // Typing logic
  useEffect(() => {
    if (index >= phrases.length) {
      setIndex(0); // Loop back
      return;
    }

    if (subIndex === phrases[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), pause);
      return () => clearTimeout(timeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? speed / 2 : speed
    );

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases, speed, pause]);

  return (
    <span className={`font-mono ${theme.accent}`}>
      {phrases[index].substring(0, subIndex)}
      <span className={`${blink ? "opacity-100" : "opacity-0"} ml-1`}>|</span>
    </span>
  );
};

// Run-Away Object Component
const RunAwayObject = ({
  children,
  className,
  initialX,
  initialY,
  sensitivity,
}) => {
  const { x, y } = useRunAway(initialX, initialY, sensitivity);
  const springX = useSpring(x, { stiffness: 40, damping: 10 });
  const springY = useSpring(y, { stiffness: 40, damping: 10 });

  const idleParams = useMemo(
    () => ({
      yOffset: Math.random() * 30 - 15,
      rotate: Math.random() * 50 - 25,
      scale: 0.9 + Math.random() * 0.2,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 2,
    }),
    []
  );

  return (
    <motion.div
      style={{ x: springX, y: springY, position: "absolute", left: 0, top: 0 }}
      className={`pointer-events-none z-0 ${className}`}
    >
      <motion.div
        animate={{
          y: [0, idleParams.yOffset, 0],
          rotate: [0, idleParams.rotate, 0],
          scale: [1, idleParams.scale, 1],
        }}
        transition={{
          duration: idleParams.duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay: idleParams.delay,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

// Background Layer
const BackgroundLayer = ({ theme }) => {
  const { x, y } = useMousePosition();
  const moveX = x * 0.02;
  const moveY = y * 0.02;

  const strokeColor =
    theme.mode === "dark"
      ? "rgba(167, 139, 250, 0.1)"
      : "rgba(99, 102, 241, 0.1)";
  const circle1Fill =
    theme.mode === "dark"
      ? "rgba(124, 58, 237, 0.05)"
      : "rgba(124, 58, 237, 0.1)";
  const circle2Fill =
    theme.mode === "dark"
      ? "rgba(59, 130, 246, 0.05)"
      : "rgba(59, 130, 246, 0.1)";

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <div
        className={`absolute inset-0 ${theme.bgGradient} opacity-100 transition-colors duration-500`}
      />
      <motion.div
        className="absolute inset-0 opacity-20"
        animate={{ x: -moveX, y: -moveY }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      >
        <svg
          className="absolute w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={strokeColor}
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          <circle
            cx="10%"
            cy="20%"
            r="200"
            fill={circle1Fill}
            filter="blur(50px)"
          />
          <circle
            cx="90%"
            cy="80%"
            r="300"
            fill={circle2Fill}
            filter="blur(60px)"
          />
        </svg>
      </motion.div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
    </div>
  );
};

// Navigation Header
const Header = ({ activePage, setActivePage, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navs = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div
        className={`max-w-7xl mx-auto rounded-full ${theme.glass} px-6 py-3 flex justify-between items-center shadow-2xl transition-all duration-300`}
      >
        <div
          onClick={() => setActivePage("home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
            A
          </div>
          <span
            className={`${theme.textMain} font-bold tracking-tight text-lg hidden sm:block`}
          >
            Abhishek<span className={theme.accent}>.Dev</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          {navs.map((n) => (
            <button
              key={n.id}
              onClick={() => setActivePage(n.id)}
              className={`text-sm font-medium transition-all relative ${
                activePage === n.id
                  ? theme.navActive
                  : `${theme.navText} ${theme.navHover}`
              }`}
            >
              {n.label}
              {activePage === n.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-violet-500 shadow-[0_0_10px_#8b5cf6]"
                />
              )}
            </button>
          ))}
        </nav>
        <button
          className={`md:hidden ${theme.textMain}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`absolute top-20 left-6 right-6 ${theme.glass} rounded-2xl p-6 md:hidden flex flex-col gap-4 shadow-2xl`}
          >
            {navs.map((n) => (
              <button
                key={n.id}
                onClick={() => {
                  setActivePage(n.id);
                  setIsOpen(false);
                }}
                className={`text-left text-lg font-medium p-2 rounded-lg ${
                  activePage === n.id
                    ? "bg-black/5 text-violet-600"
                    : theme.textMuted
                }`}
              >
                {n.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

// --- 4. PAGE COMPONENTS ---

const HomePage = ({ setActivePage, theme }) => {
  // Generate random positions and shapes for particles
  const shapes = useMemo(() => {
    return Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x:
        Math.random() *
        (typeof window !== "undefined" ? window.innerWidth : 1000),
      y:
        Math.random() *
        (typeof window !== "undefined" ? window.innerHeight : 800),
      size: Math.random() * 60 + 20,
      color:
        i % 3 === 0
          ? "bg-violet-500"
          : i % 3 === 1
          ? "bg-blue-500"
          : "bg-fuchsia-500",
      shape: i % 2 === 0 ? "rounded-full" : "rounded-3xl",
    }));
  }, []);

  return (
    <div className="relative">
      {/* 1. HERO SECTION (Full Height) */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        {/* Run-Away Elements Layer (Only in Hero) */}
        {shapes.map((s) => (
          <RunAwayObject
            key={s.id}
            initialX={s.x}
            initialY={s.y}
            sensitivity={180}
          >
            <div
              className={`${s.color} ${s.shape} blur-2xl opacity-10`}
              style={{ width: s.size, height: s.size }}
            />
          </RunAwayObject>
        ))}

        {/* Hero Content */}
        <div className="z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            {/* ANIME AVATAR */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative w-48 h-48 mx-auto mb-8 group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-blue-600 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 animate-pulse" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/10 shadow-2xl bg-black">
                {/* IMPORTANT: 
                  Place your image named 'avatar.png' in the 'public' folder.
                */}
                <img
                  src="avatar.png"
                  alt="Abhishek Wani Avatar"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src =
                      "";
                  }} // Fallback if local file not found
                />
              </div>
              {/* Floating Tech Badge */}
              <div
                className={`absolute -bottom-2 -right-2 ${
                  theme.mode === "dark" ? "bg-[#0a0a0f]" : "bg-white"
                } border border-violet-500/50 p-3 rounded-full shadow-lg animate-bounce`}
              >
                <Code size={24} className="text-violet-400" />
              </div>
            </motion.div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 backdrop-blur-md text-violet-300 text-sm font-medium mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
              </span>
              Available for Work
            </div>

            {/* Massive Name */}
            <h1
              className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${
                theme.mode === "dark"
                  ? "from-white via-slate-200 to-slate-500"
                  : "from-slate-900 via-slate-700 to-slate-500"
              } drop-shadow-2xl`}
            >
              ABHISHEK WANI
            </h1>

            {/* Typewriter Subtitle */}
            <div
              className={`text-xl sm:text-2xl md:text-3xl font-light ${theme.textMuted} h-10`}
            >
              I{" "}
              <Typewriter
                phrases={[
                  "Build Modern Web Apps",
                  "Create Dynamic UIs",
                  "Love Coding & Design",
                  "Solve Complex Problems",
                ]}
                theme={theme}
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <button
                onClick={() => setActivePage("projects")}
                className={`px-8 py-4 ${theme.buttonPrimary} font-bold rounded-full transition-transform flex items-center gap-2 shadow-lg`}
              >
                View My Work <ArrowRight size={20} />
              </button>
              <button
                onClick={() => setActivePage("contact")}
                className={`px-8 py-4 ${theme.buttonSecondary} font-bold rounded-full transition-colors backdrop-blur-sm`}
              >
                Contact Me
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS & SUMMARY SECTION */}
      <section className={`py-20 px-6 border-t ${theme.glass}`}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          {[
            { num: "04+", label: "Years Experience" },
            { num: "20+", label: "Projects Built" },
            { num: "100%", label: "Client Satisfaction" },
            { num: "24/7", label: "Support Available" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`text-center p-6 rounded-2xl border ${theme.accentBorder} hover:border-violet-500 transition-colors`}
            >
              <div className={`text-4xl font-bold ${theme.textMain} mb-2`}>
                {stat.num}
              </div>
              <div
                className={`text-sm ${theme.accent} font-medium uppercase tracking-wider`}
              >
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. WORKFLOW SECTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2
              className={`text-3xl md:text-5xl font-bold ${theme.textMain} mb-4`}
            >
              How I Work
            </h2>
            <p className={theme.textMuted}>
              My process ensures high-quality results from concept to
              deployment.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {[
              {
                icon: <Layout size={32} />,
                title: "1. Design & Plan",
                desc: "I start by visualizing the architecture and UI/UX to ensure a solid foundation.",
              },
              {
                icon: <Code size={32} />,
                title: "2. Develop",
                desc: "Writing clean, scalable code using modern frameworks like React and Tailwind.",
              },
              {
                icon: <Rocket size={32} />,
                title: "3. Deploy & Scale",
                desc: "Launching your product with performance optimization and SEO in mind.",
              },
            ].map((step, idx) => (
              <div
                key={idx}
                className={`p-8 rounded-3xl ${theme.glass} relative overflow-hidden`}
              >
                <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 mb-6">
                  {step.icon}
                </div>
                <h3 className={`text-2xl font-bold ${theme.textMain} mb-4`}>
                  {step.title}
                </h3>
                <p className={`${theme.textMuted} leading-relaxed`}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TECH STACK MARQUEE */}
      <section
        className={`py-12 ${theme.glass} border-y border-white/5 overflow-hidden`}
      >
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className={`flex gap-12 text-2xl font-bold ${theme.textMuted} uppercase tracking-widest opacity-50`}
            >
              <span>React</span> <span>•</span>
              <span>Tailwind</span> <span>•</span>
              <span>TypeScript</span> <span>•</span>
              <span>Next.js</span> <span>•</span>
              <span>Node.js</span> <span>•</span>
              <span>Figma</span> <span>•</span>
              <span>Firebase</span> <span>•</span>
              <span>Python</span> <span>•</span>
              <span>Three.js</span> <span>•</span>
            </div>
          ))}
        </div>
      </section>

      {/* Marquee Animation Style */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};

// Helper for Workflow Icon
const Rocket = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const AboutPage = ({ theme }) => {
  const timeline = [
    {
      year: "2024 - Present",
      title: "Computer Operator & Tech Support",
      place: "TVSM School, Nepanagar",
      desc: "Managing IT operations and student data systems.",
    },
    {
      year: "2023 - 2024",
      title: "Business Owner",
      place: "Shree Sai Kripa Online Services",
      desc: "Managed own cyber cafe business, handling digital services.",
    },
    {
      year: "2023",
      title: "Diploma in CS",
      place: "TSEC Polytechnic, Burhanpur",
      desc: "Graduated with 8.7 CGPA.",
    },
    {
      year: "2020 - 2022",
      title: "Computer Instructor",
      place: "Sunrise Computer Institute",
      desc: "Taught programming basics and office suites.",
    },
  ];

  return (
    <section className="min-h-screen pt-24 px-6 max-w-5xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`text-4xl font-bold ${theme.textMain} mb-12 flex items-center gap-3`}
      >
        <div className="w-12 h-1 bg-violet-500 rounded-full" /> About Me
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Bio */}
        <div className={`space-y-6 text-lg ${theme.textMuted} leading-relaxed`}>
          <p>
            I'm a{" "}
            <span className="text-violet-400 font-bold">
              Computer Science Student
            </span>{" "}
            & Developer based in Nepanagar, MP. My journey bridges the gap
            between academic theory and real-world application.
          </p>
          <p>
            With over{" "}
            <span className={`font-bold ${theme.textMain}`}>4+ years</span> of
            experience ranging from teaching to running my own business, I bring
            a unique perspective to software development. I understand not just
            code, but the *business value* it drives.
          </p>
          <div
            className={`p-6 rounded-2xl ${theme.iconBg} bg-opacity-10 border ${theme.accentBorder} mt-8`}
          >
            <h3
              className={`font-bold mb-2 flex items-center gap-2 ${theme.textMain}`}
            >
              <Briefcase size={20} /> Current Status
            </h3>
            <p className="text-sm">
              Pursuing B.Tech in CS at SDITS (Dadaji College), Khandwa (Expected
              2026).
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div
          className={`relative border-l-2 ${theme.timelineBorder} ml-4 space-y-10`}
        >
          {timeline.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="relative pl-8"
            >
              <div
                className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-violet-500 border-4 ${
                  theme.mode === "dark" ? "border-[#0a0a0f]" : "border-slate-50"
                }`}
              />
              <span className="text-sm text-violet-400 font-mono">
                {item.year}
              </span>
              <h4 className={`text-xl font-bold ${theme.textMain} mt-1`}>
                {item.title}
              </h4>
              <p className={`${theme.textMuted} text-sm mb-2`}>{item.place}</p>
              <p className={`${theme.textMuted} opacity-80 text-sm`}>
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SkillsPage = ({ theme }) => {
  const categories = [
    {
      title: "Frontend",
      icon: <Globe />,
      skills: [
        "React.js",
        "Tailwind CSS",
        "HTML5/CSS3",
        "JavaScript (ES6+)",
        "Framer Motion",
      ],
    },
    {
      title: "Tools & Design",
      icon: <PenTool />,
      skills: [
        "VS Code",
        "Git/GitHub",
        "Adobe Photoshop",
        "CorelDraw",
        "Figma",
      ],
    },
    {
      title: "Operations",
      icon: <Database />,
      skills: [
        "Tally Prime",
        "MS Office Suite",
        "System Maintenance",
        "Data Management",
      ],
    },
  ];

  return (
    <section className="min-h-screen pt-24 px-6 max-w-6xl mx-auto">
      <motion.h2
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`text-4xl font-bold ${theme.textMain} mb-12 flex items-center gap-3`}
      >
        <div className="w-12 h-1 bg-violet-500 rounded-full" /> Technical
        Arsenal
      </motion.h2>

      <div className="grid md:grid-cols-3 gap-8">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.2 }}
            className={`p-8 rounded-3xl ${theme.glass} group hover:border-violet-500/50 transition-colors`}
          >
            <div
              className={`w-14 h-14 ${theme.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
            >
              {React.cloneElement(cat.icon, { size: 32 })}
            </div>
            <h3 className={`text-2xl font-bold ${theme.textMain} mb-6`}>
              {cat.title}
            </h3>
            <div className="space-y-4">
              {cat.skills.map((skill, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <div
                    className={`flex justify-between text-sm ${theme.textMuted}`}
                  >
                    <span>{skill}</span>
                    <span className="text-violet-500/50">85%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: "85%" }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="h-full bg-gradient-to-r from-violet-600 to-blue-600 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ProjectsPage = ({ theme }) => {
  const projects = [
    {
      title: "School Management System",
      desc: "A comprehensive dashboard for managing student records (UDISE+), fees, and attendance.",
      tags: ["React", "Data Visualization", "Admin Panel"],
      icon: <BookOpen size={40} className="text-blue-400" />,
    },
    {
      title: "E-Commerce Portfolio",
      desc: "A high-performance product showcase with cart functionality and payment gateway integration.",
      tags: ["Next.js", "Stripe", "Tailwind"],
      icon: <ShoppingCart size={40} className="text-violet-400" />,
    },
    {
      title: "Cyber Cafe Network",
      desc: "Local networking setup and management software for a business handling 50+ daily users.",
      tags: ["Networking", "System Admin", "Hardware"],
      icon: <Server size={40} className="text-green-400" />,
    },
    {
      title: "Smart Inventory Dashboard",
      desc: "Accounting and inventory tracking tool designed for small retail businesses, inspired by Tally.",
      tags: ["React", "Charts.js", "Firebase"],
      icon: <Database size={40} className="text-yellow-400" />,
    },
    {
      title: "AI Resume Builder",
      desc: "An intelligent app that formats and generates PDF resumes using OpenAI/Gemini API.",
      tags: ["AI API", "PDF Generation", "React"],
      icon: <FileText size={40} className="text-pink-400" />,
    },
    {
      title: "Local Tourism Guide",
      desc: "A mobile-friendly web app promoting local heritage sites in Nepanagar and MP.",
      tags: ["PWA", "Maps API", "UI/UX"],
      icon: <MapPin size={40} className="text-teal-400" />,
    },
  ];

  return (
    <section className="min-h-screen pt-24 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl md:text-5xl font-bold ${theme.textMain} mb-4`}
        >
          Featured Projects
        </motion.h2>
        <p className={`${theme.textMuted} max-w-2xl mx-auto`}>
          A selection of work that demonstrates my ability to solve real-world
          problems with code.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((p, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -10 }}
            transition={{ duration: 0.3 }}
            className={`rounded-3xl p-8 ${theme.glass} relative overflow-hidden group flex flex-col`}
          >
            {/* Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10 flex-1 flex flex-col">
              <div
                className={`mb-6 p-4 rounded-2xl w-fit border ${theme.accentBorder} bg-black/5`}
              >
                {p.icon}
              </div>
              <h3 className={`text-2xl font-bold ${theme.textMain} mb-3`}>
                {p.title}
              </h3>
              <p className={`${theme.textMuted} mb-6 leading-relaxed flex-1`}>
                {p.desc}
              </p>

              <div className="flex flex-wrap gap-2 mb-8">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className={`px-3 py-1 rounded-full text-xs font-mono bg-violet-500/10 ${theme.accent}`}
                  >
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-auto">
                <button className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold text-sm transition-colors">
                  Live Demo
                </button>
                <button
                  className={`p-2 border ${theme.accentBorder} rounded-lg ${theme.textMain} hover:bg-violet-500/10 transition-colors`}
                >
                  <Github size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Consultant Feature */}
      <div className="mt-20">
        <AiConsultant theme={theme} />
      </div>
    </section>
  );
};

// AI Consultant Component (Refactored)
const AiConsultant = ({ theme }) => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!input) return;
    setLoading(true);
    const prompt = `Act as a senior tech strategist. Suggest 3 innovative digital project ideas for a client in the "${input}" industry that a Full Stack Developer could build. Return concise HTML list.`;
    const res = await callGemini(prompt);
    setResponse(res.replace(/```html|```/g, ""));
    setLoading(false);
  };

  return (
    <div
      className={`max-w-4xl mx-auto rounded-3xl p-8 md:p-12 relative overflow-hidden border ${theme.accentBorder} ${theme.glass}`}
    >
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-violet-600/20 blur-[100px] rounded-full" />

      <div className="relative z-10">
        <div className={`flex items-center gap-3 mb-4 ${theme.accent}`}>
          <Sparkles size={24} />
          <span className="font-bold tracking-wider uppercase text-sm">
            AI Project Consultant
          </span>
        </div>
        <h3 className={`text-2xl font-bold ${theme.textMain} mb-4`}>
          Not sure what to build next?
        </h3>
        <p className={`${theme.textMuted} mb-8 max-w-xl`}>
          Enter an industry or problem space, and my AI agent will generate 3
          high-impact project concepts for us to collaborate on.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Real Estate, Bakery, School..."
            className={`flex-1 bg-transparent border ${theme.accentBorder} rounded-xl px-6 py-4 ${theme.textMain} focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 transition-all placeholder-slate-500`}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`px-8 py-4 ${theme.buttonPrimary} rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50`}
          >
            {loading ? <Loader className="animate-spin" /> : "Generate Ideas"}
          </button>
        </div>

        {response && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className={`mt-8 p-6 rounded-xl border ${theme.accentBorder} ${theme.textMuted} prose prose-invert`}
            dangerouslySetInnerHTML={{ __html: response }}
          />
        )}
      </div>
    </div>
  );
};

const ContactPage = ({ theme }) => {
  // Use state for Inputs to keep UI in sync, but submit logic will use FormData directly
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [draftPrompt, setDraftPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'sending', 'success', 'error'

  const handleDraft = async () => {
    if (!draftPrompt) return;
    setLoading(true);
    const res = await callGemini(
      `Write a professional inquiry email to a developer named Abhishek about: "${draftPrompt}". Keep it under 50 words. No subject line.`
    );
    setFormData((prev) => ({ ...prev, message: res }));
    setLoading(false);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormStatus("sending");

    // Create new FormData object from the event target (the form)
    const data = new FormData(event.target);
    data.append("access_key", "74f6bf6e-a44f-4047-a199-49d6f70edd3c");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data,
      });

      const resData = await response.json();

      if (resData.success) {
        setFormStatus("success");
        event.target.reset();
        setFormData({ name: "", email: "", message: "" }); // Clear React state
        setTimeout(() => setFormStatus(null), 5000); // Reset status after 5s
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error("Form Error:", error);
      setFormStatus("error");
    }
  };

  return (
    <section className="min-h-screen pt-24 px-6 max-w-6xl mx-auto flex items-center">
      <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className={`text-5xl font-bold ${theme.textMain} mb-6`}>
            Let's Create <br />
            <span className="text-violet-400">Something Epic.</span>
          </h2>
          <p className={`${theme.textMuted} text-lg mb-12`}>
            I'm currently available for freelance projects and open to full-time
            opportunities.
          </p>

          <div className="space-y-6">
            <div className={`flex items-center gap-4 ${theme.textMain}`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.iconBg}`}
              >
                <Phone size={20} />
              </div>
              <div>
                <p className={`text-sm ${theme.textMuted}`}>Phone</p>
                <p className="font-bold">+91 88275 87252</p>
              </div>
            </div>
            <div className={`flex items-center gap-4 ${theme.textMain}`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.iconBg}`}
              >
                <Mail size={20} />
              </div>
              <div>
                <p className={`text-sm ${theme.textMuted}`}>Email</p>
                <p className="font-bold">abhishekwani12344@gmail.com</p>
              </div>
            </div>
            <div className={`flex items-center gap-4 ${theme.textMain}`}>
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.iconBg}`}
              >
                <Globe size={20} />
              </div>
              <div>
                <p className={`text-sm ${theme.textMuted}`}>Location</p>
                <p className="font-bold">Nepanagar, MP, India</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-8 rounded-3xl ${theme.glass} shadow-2xl relative`}>
          {/* Magic Draft Input */}
          <div
            className={`mb-6 p-4 rounded-xl border ${theme.accentBorder} bg-violet-500/10`}
          >
            <div className="flex justify-between items-center mb-2">
              <span
                className={`text-xs font-bold ${theme.accent} flex items-center gap-1`}
              >
                <Sparkles size={12} /> AI MAGIC DRAFT
              </span>
            </div>
            <div className="flex gap-2">
              <input
                value={draftPrompt}
                onChange={(e) => setDraftPrompt(e.target.value)}
                placeholder="What do you want to say?"
                className={`flex-1 bg-transparent text-sm ${theme.textMain} placeholder:text-slate-500 focus:outline-none`}
              />
              <button
                onClick={handleDraft}
                disabled={loading}
                className="text-xs bg-violet-600 px-3 py-1 rounded-md text-white font-bold hover:bg-violet-500 disabled:opacity-50"
              >
                {loading ? "..." : "Draft"}
              </button>
            </div>
          </div>

          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                required
                placeholder="Name"
                className={`w-full bg-transparent border ${theme.accentBorder} rounded-xl p-4 ${theme.textMain} focus:border-violet-500 outline-none`}
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                name="email"
                required
                placeholder="Email"
                className={`w-full bg-transparent border ${theme.accentBorder} rounded-xl p-4 ${theme.textMain} focus:border-violet-500 outline-none`}
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <textarea
              name="message"
              required
              rows={4}
              value={formData.message}
              onChange={(e) =>
                setFormData({ ...formData, message: e.target.value })
              }
              placeholder="Tell me about your project..."
              className={`w-full bg-transparent border ${theme.accentBorder} rounded-xl p-4 ${theme.textMain} focus:border-violet-500 outline-none`}
            />
            <button
              type="submit"
              disabled={formStatus === "sending"}
              className={`w-full py-4 ${theme.buttonPrimary} font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {formStatus === "sending" ? (
                <Loader className="animate-spin" />
              ) : (
                <>
                  Send Message <Send size={18} />
                </>
              )}
            </button>
            {formStatus === "success" && (
              <p className="text-green-400 text-center text-sm font-bold mt-2">
                Message sent successfully!
              </p>
            )}
            {formStatus === "error" && (
              <p className="text-red-400 text-center text-sm font-bold mt-2">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = ({ theme }) => (
  <footer
    className={`py-8 border-t ${theme.glass} text-center relative z-10 backdrop-blur-sm mt-auto`}
  >
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <p className={`${theme.textMain} font-bold text-lg`}>
          Abhishek<span className="text-violet-400">.Dev</span>
        </p>
        <p className={`${theme.textMuted} text-sm`}>
          Building digital experiences that matter.
        </p>
      </div>

      <div className="flex gap-6">
        <a
          href="https://linkedin.com/abhishekwani0904"
          target="_blank"
          rel="noreferrer"
          className={`${theme.textMuted} hover:text-violet-400 transition-colors transform hover:scale-110`}
        >
          <Linkedin size={20} />
        </a>
        <a
          href="mailto:abhishekwani12344@gmail.com"
          className={`${theme.textMuted} hover:text-violet-400 transition-colors transform hover:scale-110`}
        >
          <Mail size={20} />
        </a>
        <a
          href="#"
          className={`${theme.textMuted} hover:text-violet-400 transition-colors transform hover:scale-110`}
        >
          <Github size={20} />
        </a>
      </div>

      <div className="text-center md:text-right">
        <p className={`${theme.textMuted} text-sm`}>
          © {new Date().getFullYear()} Abhishek Wani.
        </p>
        <p className={`${theme.textMuted} opacity-70 text-xs mt-1`}>
          Powered by React & Gemini AI
        </p>
      </div>
    </div>
  </footer>
);

// --- 5. MAIN APP ---

const App = () => {
  const [activePage, setActivePage] = useState("home");
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Compute current theme object
  const theme = isDarkMode ? THEME_DARK : THEME_LIGHT;

  return (
    <div
      className={`min-h-screen ${theme.bg} ${theme.textMain} font-sans selection:bg-violet-500 selection:text-white overflow-hidden flex flex-col transition-colors duration-500`}
    >
      <BackgroundLayer theme={theme} />
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        theme={theme}
      />

      {/* Sticky Theme Toggler */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-violet-500 shadow-xl hover:scale-110 transition-transform active:scale-95"
        title="Toggle Theme"
      >
        {isDarkMode ? (
          <Sun size={24} fill="currentColor" />
        ) : (
          <Moon size={24} fill="currentColor" />
        )}
      </button>

      <AnimatePresence mode="wait">
        <motion.main
          key={activePage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="flex-grow pb-20"
        >
          {activePage === "home" && (
            <HomePage setActivePage={setActivePage} theme={theme} />
          )}
          {activePage === "about" && <AboutPage theme={theme} />}
          {activePage === "skills" && <SkillsPage theme={theme} />}
          {activePage === "projects" && <ProjectsPage theme={theme} />}
          {activePage === "contact" && <ContactPage theme={theme} />}
        </motion.main>
      </AnimatePresence>

      <Footer theme={theme} />
    </div>
  );
};

export default App;