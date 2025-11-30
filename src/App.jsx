import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Menu, X, Github, Linkedin, Mail, ArrowRight, Code, Layers, Zap, Globe, 
  Cpu, Smartphone, Send, Download, BookOpen, Briefcase, PenTool, Database, 
  ChevronDown, Phone, Loader, ExternalLink, Award,
  Terminal, Monitor, Server, Wifi, Layout, ShoppingCart, MapPin, FileText,
  Sun, Moon, CheckCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * ULTRA-MODERN REACT PORTFOLIO - ABHISHEK WANI
 * --------------------------------------------
 * Features:
 * - Custom "Birds" Flocking Background (Vanta.js style)
 * - Deep Violet/Dark Cyber Aesthetic + Clean Light Mode
 * - Sticky Theme Toggler
 * - Extended Landing Page Sections
 * - Working Contact Form (Web3Forms)
 * - Cleaned & Optimized Codebase
 */

// --- 1. UTILITY & CONFIGURATION ---

// Theme Configurations
const THEME_DARK = {
  mode: 'dark',
  bg: "bg-[#0a0a0f]",
  textMain: "text-slate-100",
  textMuted: "text-slate-400",
  accent: "text-violet-400",
  accentBorder: "border-violet-500/30",
  glass: "backdrop-blur-xl bg-black/40 border border-white/10",
  buttonPrimary: "bg-white text-black hover:scale-105",
  buttonSecondary: "bg-transparent border border-white/20 text-white hover:bg-white/10",
  navText: "text-slate-400",
  navHover: "hover:text-white",
  navActive: "text-white",
  cardTitle: "text-white",
  iconBg: "bg-violet-500/20 text-violet-400",
  timelineBorder: "border-slate-800",
  skillCardBg: "bg-slate-900/50 hover:bg-slate-800",
  // Birds Config
  birdsBg: "#0a0a0f",
  birdsColor: "#7c3aed", // Violet
  birdsAlpha: 0.6
};

const THEME_LIGHT = {
  mode: 'light',
  bg: "bg-slate-50",
  textMain: "text-slate-900",
  textMuted: "text-slate-600",
  accent: "text-violet-600",
  accentBorder: "border-violet-200",
  glass: "backdrop-blur-xl bg-white/70 border border-slate-200 shadow-lg",
  buttonPrimary: "bg-slate-900 text-white hover:scale-105",
  buttonSecondary: "bg-transparent border border-slate-300 text-slate-700 hover:bg-slate-100",
  navText: "text-slate-500",
  navHover: "hover:text-slate-900",
  navActive: "text-violet-700",
  cardTitle: "text-slate-900",
  iconBg: "bg-violet-100 text-violet-600",
  timelineBorder: "border-slate-300",
  skillCardBg: "bg-white hover:bg-slate-50 border border-slate-100",
  // Birds Config
  birdsBg: "#f8fafc",
  birdsColor: "#4f46e5", // Indigo
  birdsAlpha: 0.8
};

// --- 2. CUSTOM BACKGROUNDS ---

// Vanta-Style Birds Effect (Boids Algorithm)
const BirdsBackground = ({ theme }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width, height;
    let boids = [];
    let animationFrameId;
    
    // Configuration
    const numBoids = 100;
    const visualRange = 75;
    const speedLimit = 4;
    const minSpeed = 2;
    const turnFactor = 0.2;
    const margin = 50; 

    const resize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const distance = (b1, b2) => Math.sqrt((b1.x - b2.x) ** 2 + (b1.y - b2.y) ** 2);

    class Boid {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = Math.random() * 10 - 5;
        this.vy = Math.random() * 10 - 5;
        this.size = Math.random() * 2 + 2; 
      }

      cohesion(boids) {
        let centerX = 0, centerY = 0, numNeighbors = 0;
        for (let other of boids) {
          if (distance(this, other) < visualRange) {
            centerX += other.x;
            centerY += other.y;
            numNeighbors++;
          }
        }
        if (numNeighbors > 0) {
          centerX /= numNeighbors;
          centerY /= numNeighbors;
          this.vx += (centerX - this.x) * 0.0005;
          this.vy += (centerY - this.y) * 0.0005;
        }
      }

      separation(boids) {
        let moveX = 0, moveY = 0;
        for (let other of boids) {
          if (other !== this && distance(this, other) < 20) {
            moveX += this.x - other.x;
            moveY += this.y - other.y;
          }
        }
        this.vx += moveX * 0.05;
        this.vy += moveY * 0.05;
      }

      alignment(boids) {
        let avgVX = 0, avgVY = 0, numNeighbors = 0;
        for (let other of boids) {
          if (distance(this, other) < visualRange) {
            avgVX += other.vx;
            avgVY += other.vy;
            numNeighbors++;
          }
        }
        if (numNeighbors > 0) {
          avgVX /= numNeighbors;
          avgVY /= numNeighbors;
          this.vx += (avgVX - this.vx) * 0.05;
          this.vy += (avgVY - this.vy) * 0.05;
        }
      }

      keepWithinBounds() {
        if (this.x < margin) this.vx += turnFactor;
        if (this.x > width - margin) this.vx -= turnFactor;
        if (this.y < margin) this.vy += turnFactor;
        if (this.y > height - margin) this.vy -= turnFactor;
      }

      limitSpeed() {
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        if (speed > speedLimit) {
          this.vx = (this.vx / speed) * speedLimit;
          this.vy = (this.vy / speed) * speedLimit;
        }
        if (speed < minSpeed) {
           this.vx = (this.vx / speed) * minSpeed;
           this.vy = (this.vy / speed) * minSpeed;
        }
      }

      update() {
        this.cohesion(boids);
        this.separation(boids);
        this.alignment(boids);
        this.keepWithinBounds();
        this.limitSpeed();

        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        const angle = Math.atan2(this.vy, this.vx);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(this.size * 2, 0);
        ctx.lineTo(-this.size, this.size);
        ctx.lineTo(-this.size, -this.size);
        ctx.lineTo(this.size * 2, 0);
        ctx.fillStyle = theme.birdsColor;
        ctx.globalAlpha = theme.birdsAlpha;
        ctx.fill();
        ctx.restore();
      }
    }

    const init = () => {
      boids = [];
      for (let i = 0; i < numBoids; i++) {
        boids.push(new Boid());
      }
    };

    const animate = () => {
      if (!ctx) return;
      ctx.fillStyle = theme.birdsBg;
      ctx.fillRect(0, 0, width, height); 
      
      boids.forEach(boid => {
        boid.update();
        boid.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]); 

  return <canvas ref={canvasRef} className="fixed inset-0 z-[-1]" />;
};

// --- 3. SHARED COMPONENTS ---

// Loading Screen
const LoadingScreen = () => {
  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0f] text-white"
    >
      <div className="relative mb-8">
        <div className="w-20 h-20 bg-violet-600 rounded-2xl animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold">A</div>
      </div>
      <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-violet-600 to-blue-500"
        />
      </div>
      <p className="mt-4 text-slate-500 font-mono text-sm">Initializing System...</p>
    </motion.div>
  );
};

// Typewriter Component
const Typewriter = ({ phrases, speed = 100, pause = 2000, theme }) => {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [blink, setBlink] = useState(true);

  useEffect(() => {
    const timeout2 = setTimeout(() => setBlink((prev) => !prev), 500);
    return () => clearTimeout(timeout2);
  }, [blink]);

  useEffect(() => {
    if (index >= phrases.length) { setIndex(0); return; }
    if (subIndex === phrases[index].length + 1 && !reverse) {
      const timeout = setTimeout(() => setReverse(true), pause);
      return () => clearTimeout(timeout);
    }
    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % phrases.length);
      return;
    }
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, phrases, speed, pause]);

  return (
    <span className={`font-mono ${theme.accent}`}>
      {phrases[index].substring(0, subIndex)}
      <span className={`${blink ? 'opacity-100' : 'opacity-0'} ml-1`}>|</span>
    </span>
  );
};

// Navigation Header
const Header = ({ activePage, setActivePage, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navs = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className={`max-w-7xl mx-auto rounded-full ${theme.glass} px-6 py-3 flex justify-between items-center shadow-2xl transition-all duration-300`}>
        <div 
          onClick={() => setActivePage('home')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform">
            A
          </div>
          <span className={`${theme.textMain} font-bold tracking-tight text-lg hidden sm:block`}>
            Abhishek<span className={theme.accent}>.Dev</span>
          </span>
        </div>
        <nav className="hidden md:flex gap-8">
          {navs.map((n) => (
            <button
              key={n.id}
              onClick={() => setActivePage(n.id)}
              className={`text-sm font-medium transition-all relative ${activePage === n.id ? theme.navActive : `${theme.navText} ${theme.navHover}`}`}
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
        <button className={`md:hidden ${theme.textMain}`} onClick={() => setIsOpen(!isOpen)}>
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
                onClick={() => { setActivePage(n.id); setIsOpen(false); }}
                className={`text-left text-lg font-medium p-2 rounded-lg ${activePage === n.id ? 'bg-black/5 text-violet-600' : theme.textMuted}`}
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
  return (
    <div className="relative">
      {/* 1. HERO SECTION (Full Height) */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        
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
                {/* IMPORTANT: Place 'avatar.png' in 'public' folder */}
                <img 
                  src="avatar.png" 
                  alt="Avatar" 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => { e.target.src = "https://img.freepik.com/premium-photo/3d-avatar-boy-character-digital-universe-metaverse-gamers_1132551-93975.jpg" }}
                />
              </div>
              <div className={`absolute -bottom-2 -right-2 ${theme.mode === 'dark' ? 'bg-[#0a0a0f]' : 'bg-white'} border border-violet-500/50 p-3 rounded-full shadow-lg animate-bounce`}>
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
            <h1 className={`text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b ${theme.mode === 'dark' ? 'from-white via-slate-200 to-slate-500' : 'from-slate-900 via-slate-700 to-slate-500'} drop-shadow-2xl`}>
              ABHISHEK WANI
            </h1>

            {/* Typewriter Subtitle */}
            <div className={`text-xl sm:text-2xl md:text-3xl font-light ${theme.textMuted} h-10`}>
              I <Typewriter phrases={["Build Modern Web Apps", "Create Dynamic UIs", "Love Coding & Design", "Solve Complex Problems"]} theme={theme} />
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap justify-center gap-4 pt-8">
              <button 
                onClick={() => setActivePage('projects')}
                className={`px-8 py-4 ${theme.buttonPrimary} font-bold rounded-full transition-transform flex items-center gap-2 shadow-lg`}
              >
                View My Work <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => setActivePage('contact')}
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
          {[{ num: "04+", label: "Years Experience" }, { num: "20+", label: "Projects Built" }, { num: "100%", label: "Client Satisfaction" }, { num: "24/7", label: "Support Available" }].map((stat, idx) => (
             <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1 }}
               className={`text-center p-6 rounded-2xl border ${theme.accentBorder} hover:border-violet-500 transition-colors`}
             >
                <div className={`text-4xl font-bold ${theme.textMain} mb-2`}>{stat.num}</div>
                <div className={`text-sm ${theme.accent} font-medium uppercase tracking-wider`}>{stat.label}</div>
             </motion.div>
          ))}
        </div>
      </section>

      {/* 3. WORKFLOW SECTION */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
           <div className="mb-16 text-center">
             <h2 className={`text-3xl md:text-5xl font-bold ${theme.textMain} mb-4`}>How I Work</h2>
             <p className={theme.textMuted}>My process ensures high-quality results from concept to deployment.</p>
           </div>
           
           <div className="grid md:grid-cols-3 gap-8 relative z-10">
             {[
               { icon: <Layout size={32} />, title: "1. Design & Plan", desc: "I start by visualizing the architecture and UI/UX to ensure a solid foundation." },
               { icon: <Code size={32} />, title: "2. Develop", desc: "Writing clean, scalable code using modern frameworks like React and Tailwind." },
               { icon: <Rocket size={32} />, title: "3. Deploy & Scale", desc: "Launching your product with performance optimization and SEO in mind." }
             ].map((step, idx) => (
               <div key={idx} className={`p-8 rounded-3xl ${theme.glass} relative overflow-hidden`}>
                  <div className="w-16 h-16 bg-violet-500/20 rounded-2xl flex items-center justify-center text-violet-400 mb-6">
                    {step.icon}
                  </div>
                  <h3 className={`text-2xl font-bold ${theme.textMain} mb-4`}>{step.title}</h3>
                  <p className={`${theme.textMuted} leading-relaxed`}>{step.desc}</p>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* 4. TECH STACK MARQUEE */}
      <section className={`py-12 ${theme.glass} border-y border-white/5 overflow-hidden`}>
         <div className="flex gap-12 animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className={`flex gap-12 text-2xl font-bold ${theme.textMuted} uppercase tracking-widest opacity-50`}>
                 <span>React</span> <span>•</span> <span>Tailwind</span> <span>•</span> <span>TypeScript</span> <span>•</span> <span>Next.js</span> <span>•</span> <span>Node.js</span> <span>•</span> <span>Figma</span> <span>•</span> <span>Firebase</span> <span>•</span> <span>Python</span>
              </div>
            ))}
         </div>
      </section>
      <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } } .animate-marquee { animation: marquee 20s linear infinite; }`}</style>
    </div>
  );
};

// Helper for Workflow Icon
const Rocket = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const AboutPage = ({ theme }) => {
  const timeline = [
    { year: "2024 - Present", title: "Computer Operator & Tech Support", place: "TVSM School, Nepanagar", desc: "Managing IT operations and student data systems (UDISE+, Shiksha Portal)." },
    { year: "2023 - 2024", title: "Business Owner", place: "Shree Sai Kripa Online Services", desc: "Founded and managed a cyber cafe, handling various digital services and customer support." },
    { year: "2023", title: "Diploma in Computer Science", place: "TSEC Polytechnic, Burhanpur", desc: "Graduated with 8.7 CGPA. Focused on core programming concepts." },
    { year: "2022 - 2023", title: "Computer Teacher", place: "Shree Siddhivinayak Education Group", desc: "Facilitated internship programs and taught advanced computer skills." },
    { year: "2020 - 2022", title: "Computer Instructor", place: "Sunrise Computer Institute", desc: "Started my journey teaching basic computing and office automation." },
  ];

  const certifications = ["MDCA (Master Diploma in Computer Applications)", "ADCA (Advanced Diploma)", "Web Development Certified", "Data Entry Operator"];

  return (
    <section className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-20">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid lg:grid-cols-2 gap-16">
        
        {/* LEFT COLUMN: BIO & CERTIFICATES */}
        <div className="space-y-12">
          <div>
            <h2 className={`text-4xl md:text-5xl font-bold ${theme.textMain} mb-6 flex items-center gap-3`}>
              About Me
            </h2>
            <div className={`text-lg ${theme.textMuted} space-y-6 leading-relaxed`}>
              <p>
                Hello! I'm <span className={`font-bold ${theme.accent}`}>Abhishek Wani</span>, a passionate developer and tech enthusiast from Nepanagar, Madhya Pradesh.
              </p>
              <p>
                My journey into technology wasn't just about learning to code; it was about solving problems. From running my own <span className={theme.textMain}>Cyber Cafe business</span> to managing critical IT infrastructure for educational institutions, I've always been hands-on.
              </p>
              <p>
                Currently pursuing my <span className={`font-semibold ${theme.textMain}`}>B.Tech in Computer Science</span>, I combine academic knowledge with 4+ years of real-world grit. I don't just build websites; I build systems that work.
              </p>
            </div>
          </div>

          <div>
            <h3 className={`text-2xl font-bold ${theme.textMain} mb-6 flex items-center gap-2`}>
              <Award size={24} className="text-yellow-500" /> Certifications
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {certifications.map((cert, idx) => (
                <div key={idx} className={`p-4 rounded-xl border ${theme.accentBorder} ${theme.glass} hover:border-yellow-500/50 transition-colors flex items-start gap-3`}>
                  <CheckCircle size={20} className="text-green-500 mt-1 shrink-0" />
                  <span className={`${theme.textMain} text-sm font-medium`}>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE TIMELINE */}
        <div>
          <h3 className={`text-2xl font-bold ${theme.textMain} mb-8 flex items-center gap-2`}>
            <Briefcase size={24} className="text-violet-500" /> Professional Journey
          </h3>
          <div className={`relative border-l-2 ${theme.timelineBorder} ml-3 md:ml-6 space-y-12`}>
            {timeline.map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1 }}
                className="relative pl-8 group"
              >
                {/* Timeline Dot */}
                <div className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-violet-500 border-4 ${theme.mode === 'dark' ? 'border-[#0a0a0f]' : 'border-slate-50'} group-hover:scale-125 transition-transform`} />
                
                {/* Content Card */}
                <div className={`p-6 rounded-2xl ${theme.glass} border ${theme.accentBorder} hover:border-violet-500/50 transition-all group-hover:-translate-y-1 group-hover:shadow-xl`}>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono mb-2 ${theme.iconBg}`}>
                    {item.year}
                  </span>
                  <h4 className={`text-xl font-bold ${theme.textMain}`}>{item.title}</h4>
                  <p className={`text-sm ${theme.accent} font-medium mb-3`}>{item.place}</p>
                  <p className={`${theme.textMuted} text-sm leading-relaxed`}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </motion.div>
    </section>
  );
};

const SkillsPage = ({ theme }) => {
  const [activeTab, setActiveTab] = useState('Frontend');

  const skillData = {
    Frontend: [
      { name: "React.js", level: 90, icon: <Code /> },
      { name: "Next.js", level: 80, icon: <Globe /> },
      { name: "TypeScript", level: 85, icon: <Code /> },
      { name: "Tailwind CSS", level: 95, icon: <Layout /> },
      { name: "HTML5 & CSS3", level: 95, icon: <Layout /> },
      { name: "JavaScript (ES6+)", level: 90, icon: <Code /> },
      { name: "Framer Motion", level: 75, icon: <Zap /> },
      { name: "Redux / Context", level: 80, icon: <Database /> },
    ],
    Backend: [
      { name: "Node.js", level: 75, icon: <Server /> },
      { name: "Express.js", level: 70, icon: <Server /> },
      { name: "Firebase", level: 85, icon: <Database /> },
      { name: "MongoDB", level: 70, icon: <Database /> },
      { name: "REST APIs", level: 85, icon: <Globe /> },
      { name: "Python", level: 60, icon: <Terminal /> },
    ],
    Tools: [
      { name: "VS Code", level: 95, icon: <Code /> },
      { name: "Git & GitHub", level: 85, icon: <Github /> },
      { name: "Postman", level: 80, icon: <Terminal /> },
      { name: "Vite", level: 90, icon: <Zap /> },
      { name: "Figma", level: 80, icon: <PenTool /> },
      { name: "Adobe Photoshop", level: 75, icon: <Layers /> },
    ],
    "Soft Skills": [
      { name: "Problem Solving", level: 90, icon: <Cpu /> },
      { name: "Leadership", level: 85, icon: <ArrowRight /> }, // Using ArrowRight as generic icon if Users is missing or wanted specific
      { name: "Teaching", level: 95, icon: <BookOpen /> },
      { name: "Agile/Scrum", level: 80, icon: <CheckCircle /> }, // Using CheckCircle
    ]
  };

  return (
    <section className="min-h-screen pt-24 px-6 max-w-6xl mx-auto pb-20">
      <div className="text-center mb-12">
        <h2 className={`text-4xl md:text-5xl font-bold ${theme.textMain} mb-4`}>Technical Arsenal</h2>
        <p className={theme.textMuted}>My weapons of choice for digital creation.</p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-16">
        {Object.keys(skillData).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeTab === tab 
                ? `bg-violet-600 text-white shadow-lg shadow-violet-500/25` 
                : `${theme.mode === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-white text-slate-600 border border-slate-200'} hover:scale-105`
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <motion.div 
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 perspective-1000"
      >
        {skillData[activeTab].map((skill, idx) => (
          <div key={idx} className={`group relative p-6 rounded-2xl border ${theme.accentBorder} ${theme.skillCardBg} transition-all hover:border-violet-500 overflow-hidden`}>
            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className={`w-12 h-12 rounded-lg ${theme.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              {React.cloneElement(skill.icon, { size: 24 })}
            </div>
            
            <h3 className={`text-lg font-bold ${theme.textMain} mb-2`}>{skill.name}</h3>
            
            <div className="w-full bg-gray-700/30 rounded-full h-2 overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
              />
            </div>
            <div className="flex justify-between mt-2 text-xs font-mono text-slate-500">
              <span>Beginner</span>
              <span className={theme.accent}>{skill.level}%</span>
              <span>Expert</span>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Currently Learning */}
      <div className={`mt-20 p-8 rounded-3xl ${theme.glass} border ${theme.accentBorder} flex flex-col md:flex-row items-center gap-8`}>
        <div className="shrink-0 p-4 bg-yellow-500/10 rounded-full">
          <Loader size={32} className="text-yellow-500 animate-spin" />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h3 className={`text-xl font-bold ${theme.textMain} mb-2`}>Currently Learning</h3>
          <p className={theme.textMuted}>
            Expanding my horizons into <span className="text-yellow-500 font-bold">Three.js 3D Web Graphics</span> and <span className="text-blue-400 font-bold">Advanced AI Integration</span> to build the next generation of immersive web apps.
          </p>
        </div>
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
      icon: <BookOpen size={40} className="text-blue-400" />
    },
    {
      title: "E-Commerce Portfolio",
      desc: "A high-performance product showcase with cart functionality and payment gateway integration.",
      tags: ["Next.js", "Stripe", "Tailwind"],
      icon: <ShoppingCart size={40} className="text-violet-400" />
    },
    {
      title: "Cyber Cafe Network",
      desc: "Local networking setup and management software for a business handling 50+ daily users.",
      tags: ["Networking", "System Admin", "Hardware"],
      icon: <Server size={40} className="text-green-400" />
    },
    {
      title: "Smart Inventory Dashboard",
      desc: "Accounting and inventory tracking tool designed for small retail businesses, inspired by Tally.",
      tags: ["React", "Charts.js", "Firebase"],
      icon: <Database size={40} className="text-yellow-400" />
    },
    {
      title: "AI Resume Builder",
      desc: "An intelligent app that formats and generates PDF resumes using OpenAI/Gemini API.",
      tags: ["AI API", "PDF Generation", "React"],
      icon: <FileText size={40} className="text-pink-400" />
    },
    {
      title: "Local Tourism Guide",
      desc: "A mobile-friendly web app promoting local heritage sites in Nepanagar and MP.",
      tags: ["PWA", "Maps API", "UI/UX"],
      icon: <MapPin size={40} className="text-teal-400" />
    }
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
          A selection of work that demonstrates my ability to solve real-world problems with code.
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
              <div className={`mb-6 p-4 rounded-2xl w-fit border ${theme.accentBorder} bg-black/5`}>
                {p.icon}
              </div>
              <h3 className={`text-2xl font-bold ${theme.textMain} mb-3`}>{p.title}</h3>
              <p className={`${theme.textMuted} mb-6 leading-relaxed flex-1`}>{p.desc}</p>
              
              <div className="flex flex-wrap gap-2 mb-8">
                {p.tags.map(t => (
                  <span key={t} className={`px-3 py-1 rounded-full text-xs font-mono bg-violet-500/10 ${theme.accent}`}>
                    #{t}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 mt-auto">
                <button className="flex-1 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-bold text-sm transition-colors">
                  Live Demo
                </button>
                <button className={`p-2 border ${theme.accentBorder} rounded-lg ${theme.textMain} hover:bg-violet-500/10 transition-colors`}>
                  <Github size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ContactPage = ({ theme }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null);

  const onSubmit = async (event) => {
    event.preventDefault();
    setFormStatus('sending');
    setLoading(true);
    
    // Create new FormData object from the event target (the form)
    const data = new FormData(event.target);
    data.append("access_key", "74f6bf6e-a44f-4047-a199-49d6f70edd3c");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: data
      });

      const resData = await response.json();

      if (resData.success) {
        setFormStatus('success');
        event.target.reset();
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setFormStatus(null), 5000);
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      console.error("Form Error:", error);
      setFormStatus('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen pt-24 px-6 max-w-6xl mx-auto flex items-center">
      <div className="w-full grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className={`text-5xl font-bold ${theme.textMain} mb-6`}>Let's Create <br /><span className="text-violet-400">Something Epic.</span></h2>
          <p className={`${theme.textMuted} text-lg mb-12`}>
            I'm currently available for freelance projects and open to full-time opportunities.
          </p>

          <div className="space-y-6">
            <div className={`flex items-center gap-4 ${theme.textMain}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.iconBg}`}><Phone size={20} /></div>
              <div><p className={`text-sm ${theme.textMuted}`}>Phone</p><p className="font-bold">+91 88275 87252</p></div>
            </div>
            <div className={`flex items-center gap-4 ${theme.textMain}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.iconBg}`}><Mail size={20} /></div>
              <div><p className={`text-sm ${theme.textMuted}`}>Email</p><p className="font-bold">abhishekwani12344@gmail.com</p></div>
            </div>
            <div className={`flex items-center gap-4 ${theme.textMain}`}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${theme.iconBg}`}><Globe size={20} /></div>
              <div><p className={`text-sm ${theme.textMuted}`}>Location</p><p className="font-bold">Nepanagar, MP, India</p></div>
            </div>
          </div>
        </div>

        <div className={`p-8 rounded-3xl ${theme.glass} shadow-2xl relative`}>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <input 
                type="text" 
                name="name" 
                required
                placeholder="Name" 
                className={`w-full bg-transparent border ${theme.accentBorder} rounded-xl p-4 ${theme.textMain} focus:border-violet-500 outline-none`} 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <input 
                type="email" 
                name="email" 
                required
                placeholder="Email" 
                className={`w-full bg-transparent border ${theme.accentBorder} rounded-xl p-4 ${theme.textMain} focus:border-violet-500 outline-none`} 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <textarea 
              name="message" 
              required
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              placeholder="Tell me about your project..." 
              className={`w-full bg-transparent border ${theme.accentBorder} rounded-xl p-4 ${theme.textMain} focus:border-violet-500 outline-none`} 
            />
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 ${theme.buttonPrimary} font-bold rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-50`}
            >
              {loading ? <Loader className="animate-spin" /> : <>Send Message <Send size={18} /></>}
            </button>
            {formStatus === 'success' && (
              <p className="text-green-400 text-center text-sm font-bold mt-2">Message sent successfully!</p>
            )}
            {formStatus === 'error' && (
              <p className="text-red-400 text-center text-sm font-bold mt-2">Something went wrong. Please try again.</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = ({ theme }) => (
  <footer className={`py-8 border-t ${theme.glass} text-center relative z-10 backdrop-blur-sm mt-auto`}>
    <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="text-center md:text-left">
        <p className={`${theme.textMain} font-bold text-lg`}>Abhishek<span className="text-violet-400">.Dev</span></p>
        <p className={`${theme.textMuted} text-sm`}>Building digital experiences that matter.</p>
      </div>
      
      <div className="flex gap-6">
        <a href="https://linkedin.com/abhishekwani0904" target="_blank" rel="noreferrer" className={`${theme.textMuted} hover:text-violet-400 transition-colors transform hover:scale-110`}><Linkedin size={20} /></a>
        <a href="mailto:abhishekwani12344@gmail.com" className={`${theme.textMuted} hover:text-violet-400 transition-colors transform hover:scale-110`}><Mail size={20} /></a>
        <a href="#" className={`${theme.textMuted} hover:text-violet-400 transition-colors transform hover:scale-110`}><Github size={20} /></a>
      </div>

      <div className="text-center md:text-right">
        <p className={`${theme.textMuted} text-sm`}>© {new Date().getFullYear()} Abhishek Wani.</p>
        <p className={`${theme.textMuted} opacity-70 text-xs mt-1`}>Powered by React</p>
      </div>
    </div>
  </footer>
);

// --- 5. MAIN APP ---

const App = () => {
  const [activePage, setActivePage] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Loading Simulation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const theme = isDarkMode ? THEME_DARK : THEME_LIGHT;

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.textMain} font-sans selection:bg-violet-500 selection:text-white overflow-hidden flex flex-col transition-colors duration-500`}>
      <AnimatePresence>
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>

      {!isLoading && (
        <>
          <BirdsBackground theme={theme} />
          <Header activePage={activePage} setActivePage={setActivePage} theme={theme} />

          {/* Sticky Theme Toggler */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-violet-500 shadow-xl hover:scale-110 transition-transform active:scale-95"
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun size={24} fill="currentColor" /> : <Moon size={24} fill="currentColor" />}
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
              {activePage === 'home' && <HomePage setActivePage={setActivePage} theme={theme} />}
              {activePage === 'about' && <AboutPage theme={theme} />}
              {activePage === 'skills' && <SkillsPage theme={theme} />}
              {activePage === 'projects' && <ProjectsPage theme={theme} />}
              {activePage === 'contact' && <ContactPage theme={theme} />}
            </motion.main>
          </AnimatePresence>

          <Footer theme={theme} />
        </>
      )}
    </div>
  );
};

export default App;