import React, { useState, useEffect, useRef } from 'react';
import { 
  Check, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Menu, 
  X, 
  ArrowRight, 
  ShieldCheck, 
  Compass, 
  MapPin,
  Trees,
  Mountain,
  Sun
} from 'lucide-react';

import { motion } from 'motion/react';
import { AnimatedSection, StaggerContainer, StaggerItem } from './components/AnimatedSection';
import { useScrollReveal } from './hooks/useScrollReveal';

// Imported generated assets
import avatar1 from './assets/images/traveler_avatar_1_1790538375814.jpg';
import avatar2 from './assets/images/traveler_avatar_2_1790538384996.jpg';
import avatar3 from './assets/images/traveler_avatar_3_1790538394747.jpg';

// Cinematic Scroll-driven background animation component
import { ScrollBackground } from './components/ScrollBackground';

export default function App() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [soundActive, setSoundActive] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeFeatureIndex, setActiveFeatureIndex] = useState(0);
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  // Scroll reveal observers for each section
  const cardsReveal = useScrollReveal();
  const discoverReveal = useScrollReveal();
  const aliveReveal = useScrollReveal();
  const destinationReveal = useScrollReveal();
  const closingReveal = useScrollReveal();
  const footerReveal = useScrollReveal();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Subtle interactive parallax mouse movement on spotlight
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const xPercent = (e.clientX / innerWidth) * 100;
      const yPercent = (e.clientY / innerHeight) * 100;
      setMousePosition({ x: xPercent, y: yPercent });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Ambient serene rainforest wind audio synthesis
  const toggleAmbientSound = () => {
    if (!soundActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Create pink noise buffer for gentle mountain breeze
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          output[i] = (b0 + b1 + b2) * 0.035;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 420;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 2);
        gainNodeRef.current = gainNode;

        whiteNoise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        setSoundActive(true);
      } catch (err) {
        console.error('Audio initialization failed', err);
      }
    } else {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setSoundActive(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setIsSubmitted(true);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  // 1. Numbered Information Cards
  const informationCards = [
    {
      num: '01',
      title: 'RWANDA AT A GLANCE',
      highlight: 'Land of a Thousand Hills',
      stats: [
        { label: 'Population', value: '14.57 million (2025)' },
        { label: 'Capital', value: 'Kigali' },
        { label: 'Region', value: 'East Africa' },
        { label: 'Known as', value: 'Land of a Thousand Hills' },
      ],
      description: 'A forward-looking East African nation renowned for pristine landscapes, visionary conservation policies, and warm hospitality.',
    },
    {
      num: '02',
      title: 'LANDSCAPES',
      highlight: 'Dramatic Topography',
      stats: [
        { label: 'Topography', value: 'Rolling hills & valleys' },
        { label: 'Highest Peak', value: 'Mt Karisimbi (4,507m)' },
        { label: 'Biomes', value: 'Highland forests & savannah' },
      ],
      description: 'Rwanda is known for its rolling hills, mountains, valleys, forests and scenic countryside that span across fertile volcanic soils.',
    },
    {
      num: '03',
      title: 'WILDLIFE',
      highlight: 'Iconic Endemic Fauna',
      stats: [
        { label: 'Primates', value: 'Mountain gorillas & chimps' },
        { label: 'Endemics', value: 'Golden monkeys' },
        { label: 'Savannah', value: 'Restored Big Five' },
      ],
      description: 'Highlighting endangered mountain gorillas in the Virungas, chimpanzees in ancient cloud forests, golden monkeys and diverse wildlife.',
    },
    {
      num: '04',
      title: 'NATIONAL PARKS',
      highlight: 'Four Protected Havens',
      stats: [
        { label: 'Northern', value: 'Volcanoes National Park' },
        { label: 'Eastern', value: 'Akagera National Park' },
        { label: 'Southwestern', value: 'Nyungwe & Gishwati-Mukura' },
      ],
      description: 'Four distinct ecosystems: Volcanoes, Akagera, Nyungwe, and Gishwati-Mukura National Parks safeguarding exceptional natural heritage.',
    },
    {
      num: '05',
      title: 'LAKE KIVU',
      highlight: 'Emerald Inland Sea',
      stats: [
        { label: 'Water Body', value: 'Lake Kivu (Freshwater)' },
        { label: 'Adventures', value: 'Kayaking & island hopping' },
        { label: 'Trails', value: 'Congo Nile Trail cycling' },
      ],
      description: 'Highlighting its mountains, islands, shoreline, hiking, cycling along scenic lake routes and kayaking in crystal tranquil waters.',
    },
  ];

  // 2. Discover Rwanda Information Blocks
  const discoverBlocks = [
    {
      title: 'Kigali',
      subtitle: 'Modern & Green Capital',
      text: 'Celebrated as one of Africa’s cleanest and safest cities, blending vibrant contemporary art galleries, cafe culture, and tree-lined boulevards.',
      icon: MapPin,
    },
    {
      title: 'Nature',
      subtitle: 'Mist-Veiled Highlands',
      text: 'Sweeping emerald tea plantations, volcanic peaks, and deep valleys forming the celebrated Land of a Thousand Hills.',
      icon: Mountain,
    },
    {
      title: 'Wildlife',
      subtitle: 'Rare Primates & Big Five',
      text: 'From endangered mountain gorillas and golden monkeys to lions, elephants, and black rhinos roaming restored ecosystems.',
      icon: Trees,
    },
    {
      title: 'Culture',
      subtitle: 'Living Traditions',
      text: 'Intore royal warrior dances, intricate geometric Imigongo cow-dung art, and the renowned annual Kwita Izina gorilla naming ceremony.',
      icon: Sun,
    },
    {
      title: 'Adventure',
      subtitle: 'Highland Expeditions',
      text: 'Canopy walkways suspended 60m above ancient rainforests, multi-day Congo Nile Trail cycling, and volcanic caldera climbs.',
      icon: Compass,
    },
  ];

  // 3. Where Rwanda Comes Alive Features
  const featuresList = [
    {
      id: '01',
      title: 'Kigali & Its Modern Urban Character',
      kicker: 'Urban Innovation & Heritage',
      description: 'Kigali stands as an international model for sustainable urbanism. Pedestrian zones, modern convention centers, solar-powered mobility, and dynamic creative spaces honor Rwandan culture while driving a forward-looking technological economy.',
      metrics: 'Ranked safest capital in Africa · 100% plastic bag ban since 2008',
    },
    {
      id: '02',
      title: 'Volcanoes National Park & Mountain Gorillas',
      kicker: 'The Misty Virungas',
      description: 'Covering steep slopes of five extinct and dormant volcanoes, this sanctuary protects over a third of the world’s surviving mountain gorillas. Guided treks offer an awe-inspiring, silent communion with habituated gorilla families in bamboo forests.',
      metrics: 'Home to 12+ habituated gorilla families · High conservation compliance',
    },
    {
      id: '03',
      title: 'Akagera’s Savannah & Wildlife',
      kicker: 'Central African Wetlands',
      description: 'Central Africa’s largest protected wetland, Akagera is a conservation triumph. Rolling savannah plains, acacia woodlands, and interconnected lakes harbor thriving populations of lions, black rhinos, elephants, buffalos, and leopards.',
      metrics: 'Big Five safari destination · Over 480 recorded bird species',
    },
    {
      id: '04',
      title: 'Nyungwe’s Rainforest & Primates',
      kicker: 'Ancient Montane Forest',
      description: 'One of the oldest surviving rainforests in Africa, Nyungwe is a primeval cloud forest rich in biodiversity. It harbors 13 primate species including habituated chimpanzee troops, Ruwenzori colobus monkeys, and a famous 160-meter canopy walkway.',
      metrics: 'Over 1,000 plant species · 322 bird species including 29 Albertine endemics',
    },
    {
      id: '05',
      title: 'Lake Kivu & Outdoor Experiences',
      kicker: 'Tranquil Shorelines',
      description: 'Lake Kivu’s crystalline waters border steep terraced hillsides and emerald islands. Travelers enjoy tranquil sea kayaking, sunset boat tours to peace islands, beachside relaxation, and traversing the 227km Congo Nile hiking and cycling trail.',
      metrics: 'No hippos or crocodiles in resort bays · Ideal for swimming & kayaking',
    },
  ];

  // Dynamic light beam tilt based on mouse position
  const tiltDeg = ((mousePosition.x - 50) / 50) * 8; // -8 to +8 degrees
  const beamPivotX = 50 + ((mousePosition.x - 50) / 50) * 4;

  return (
    <div className="relative min-h-screen w-full text-white selection:bg-teal-500 selection:text-white font-sans-custom overflow-x-hidden">
      
      {/* Primary Full-Screen Scroll-Driven Frame Animation Background */}
      <ScrollBackground />

      {/* ========================================================================= */}
      {/* 1. CINEMATIC HERO / BANNER SECTION                                       */}
      {/* ========================================================================= */}
      <section className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden z-10">
        
        {/* Layer B: Ambient Blue/Teal Glow */}
        <div 
          className="absolute left-1/2 bottom-[15%] -translate-x-1/2 w-[700px] h-[550px] pointer-events-none z-[1] transition-transform duration-700 ease-out"
          style={{
            transform: `translateX(calc(-50% + ${(mousePosition.x - 50) * 0.3}px)) translateY(${(mousePosition.y - 50) * 0.2}px)`,
          }}
        >
          <div className="w-full h-full spotlight-ambient animate-beam-pulse" />
        </div>

        {/* Layer C: The Upward Volumetric Spotlight Cone */}
        <div 
          className="absolute bottom-[-5%] left-1/2 pointer-events-none z-[2] transition-transform duration-300 ease-out"
          style={{
            width: '1000px',
            height: '110vh',
            transform: `translateX(-50%) rotate(${tiltDeg}deg)`,
            transformOrigin: `${beamPivotX}% 100%`,
          }}
        >
          <div className="w-full h-full spotlight-beam opacity-80" />
        </div>

        {/* Layer D: Intense Bottom Core Emitter Glow */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[650px] sm:w-[850px] h-[360px] pointer-events-none z-[3] spotlight-core opacity-85" />

        {/* Layer E: Floating Dust / Starlight Micro-Particles */}
        <div className="absolute inset-0 pointer-events-none z-[4] overflow-hidden">
          <div className="particle absolute bottom-[18%] left-[48%] w-1.5 h-1.5 rounded-full bg-blue-300/60 blur-[0.5px]" style={{ animationDelay: '0s', animationDuration: '5.2s' }} />
          <div className="particle absolute bottom-[24%] left-[53%] w-1 h-1 rounded-full bg-white/70 blur-[0.5px]" style={{ animationDelay: '1.8s', animationDuration: '6.4s' }} />
          <div className="particle absolute bottom-[12%] left-[45%] w-2 h-2 rounded-full bg-teal-200/50 blur-[1px]" style={{ animationDelay: '3.1s', animationDuration: '7s' }} />
          <div className="particle absolute bottom-[30%] left-[51%] w-1.5 h-1.5 rounded-full bg-sky-200/60 blur-[0.5px]" style={{ animationDelay: '2.4s', animationDuration: '5.8s' }} />
        </div>

        {/* Top Bar Navigation */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-20 w-full max-w-7xl mx-auto px-6 sm:px-10 pt-7 pb-4 flex items-center justify-between"
        >
          <a 
            href="#" 
            className="group inline-flex items-center gap-1.5 text-2xl sm:text-[28px] text-white hover:text-neutral-100 transition-colors tracking-tight select-none"
          >
            <span className="font-instrument italic font-normal text-[30px] sm:text-[32px] tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              Visit
            </span>
            <span className="font-instrument italic font-normal text-[30px] sm:text-[32px] tracking-wide text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
              Rwanda
            </span>
            <span className="inline-block text-xs font-sans text-teal-400 font-semibold tracking-wider uppercase ml-1 opacity-80">
              🇷🇼
            </span>
          </a>

          {/* Navigation links */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 text-xs sm:text-[13px] font-medium text-neutral-300 tracking-wide">
            <button onClick={() => scrollToSection('cards-section')} className="hover:text-white transition-colors cursor-pointer nav-link">
              At A Glance
            </button>
            <button onClick={() => scrollToSection('discover-section')} className="hover:text-white transition-colors cursor-pointer nav-link">
              Discover
            </button>
            <button onClick={() => scrollToSection('alive-section')} className="hover:text-white transition-colors cursor-pointer nav-link">
              Where It Comes Alive
            </button>
            <button onClick={() => scrollToSection('destination-section')} className="hover:text-white transition-colors cursor-pointer nav-link">
              Our Vision
            </button>
            <button onClick={() => scrollToSection('closing-section')} className="hover:text-white transition-colors cursor-pointer nav-link">
              Begin Journey
            </button>
          </nav>

          {/* Primary Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleAmbientSound}
              aria-label={soundActive ? 'Mute mountain breeze' : 'Serene mountain breeze'}
              className="hidden sm:inline-flex items-center justify-center w-8 h-8 rounded-full border border-white/10 bg-white/[0.06] hover:bg-white/[0.15] text-neutral-300 hover:text-white transition-all cursor-pointer text-xs backdrop-blur-md icon-btn"
            >
              {soundActive ? <Volume2 className="w-3.5 h-3.5 text-teal-400 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => scrollToSection('closing-section')}
              className="px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-[13px] font-semibold text-black bg-white rounded-full hover:bg-neutral-100 transition-all shadow-[0_4px_16px_rgba(255,255,255,0.18)] whitespace-nowrap cursor-pointer btn-primary-lift"
            >
              Explore Rwanda
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-neutral-300 hover:text-white transition-colors icon-btn"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </motion.header>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-[72px] z-50 bg-[#070e17]/95 backdrop-blur-2xl border-b border-white/10 px-6 py-6 transition-all shadow-2xl">
            <div className="flex flex-col gap-4 text-sm font-medium">
              <button onClick={() => scrollToSection('cards-section')} className="text-left text-neutral-300 hover:text-white py-1.5 border-b border-white/5">
                01. Rwanda At A Glance
              </button>
              <button onClick={() => scrollToSection('discover-section')} className="text-left text-neutral-300 hover:text-white py-1.5 border-b border-white/5">
                02. Discover Rwanda
              </button>
              <button onClick={() => scrollToSection('alive-section')} className="text-left text-neutral-300 hover:text-white py-1.5 border-b border-white/5">
                03. Where Rwanda Comes Alive
              </button>
              <button onClick={() => scrollToSection('destination-section')} className="text-left text-neutral-300 hover:text-white py-1.5 border-b border-white/5">
                04. More Than A Destination
              </button>
              <button onClick={() => scrollToSection('closing-section')} className="text-left text-neutral-300 hover:text-white py-1.5">
                05. Plan Your Journey
              </button>
            </div>
          </div>
        )}

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 text-center py-12 sm:py-16 max-w-4xl mx-auto my-auto">
          {/* Social Proof Badge */}
          <AnimatedSection variant="fadeUp" delay={0.3} inView={true}>
            <div className="mb-6 sm:mb-8 inline-flex items-center gap-2.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/[0.06] border border-white/[0.15] backdrop-blur-md shadow-lg select-none">
              <div className="flex -space-x-2 overflow-hidden items-center">
                <img src={avatar1} alt="Explorer" referrerPolicy="no-referrer" className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-[#030508] object-cover" />
                <img src={avatar2} alt="Photographer" referrerPolicy="no-referrer" className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-[#030508] object-cover" />
                <img src={avatar3} alt="Adventurer" referrerPolicy="no-referrer" className="inline-block h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-[#030508] object-cover" />
                <div className="inline-flex items-center justify-center h-5 w-5 sm:h-6 sm:w-6 rounded-full ring-2 ring-[#030508] bg-teal-600/80 text-[9px] font-bold text-white">
                  +14k
                </div>
              </div>
              <span className="text-xs sm:text-[13px] font-medium text-neutral-200">
                14,820 travelers exploring in 2026
              </span>
            </div>
          </AnimatedSection>

          {/* Main Headline */}
          <h1 className="flex flex-col items-center tracking-tight text-balance">
            <AnimatedSection variant="revealUp" delay={0.45} inView={true}>
              <span className="text-[38px] sm:text-[62px] md:text-[76px] lg:text-[84px] font-bold tracking-tight text-white leading-[1.05] drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)] uppercase">
                VISIT RWANDA
              </span>
            </AnimatedSection>
            <AnimatedSection variant="revealUp" delay={0.65} inView={true}>
              <span className="font-instrument italic font-normal text-[36px] sm:text-[58px] md:text-[72px] lg:text-[82px] text-white leading-[1.08] mt-1 sm:mt-2 tracking-tight drop-shadow-[0_0_35px_rgba(45,212,191,0.5)]">
                Discover the Land of a Thousand Hills.
              </span>
            </AnimatedSection>
          </h1>

          {/* Supporting Sentence */}
          <AnimatedSection variant="fadeUp" delay={0.82} inView={true}>
            <p className="mt-5 sm:mt-6 text-sm sm:text-base md:text-[17px] text-neutral-200 font-normal max-w-xl mx-auto leading-relaxed text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              Venture into mist-shrouded volcanic peaks, pristine rainforests, and soul-stirring wildlife encounters across Africa's most visionary sanctuary.
            </p>
          </AnimatedSection>

          {/* Frosted Input Capsule */}
          <AnimatedSection variant="fadeUp" delay={0.97} inView={true} className="w-full max-w-[440px] sm:max-w-[480px] mx-auto mt-8 sm:mt-10">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="relative p-1.5 pl-5 sm:pl-6 rounded-full glass-pill flex items-center justify-between gap-2 transition-all backdrop-blur-xl">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Best Email"
                  required
                  className="bg-transparent text-white placeholder-neutral-300 text-sm sm:text-[15px] focus:outline-none flex-1 min-w-0 pr-2"
                />
                <button
                  type="submit"
                  className="bg-white text-black font-semibold text-xs sm:text-[13px] px-5 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-neutral-100 transition-all whitespace-nowrap shadow-md cursor-pointer btn-primary-lift"
                >
                  Plan Your Visit
                </button>
              </form>
            ) : (
              <div className="p-3.5 sm:p-4 rounded-full bg-white/[0.12] border border-teal-400/50 backdrop-blur-xl flex items-center justify-between gap-3 text-left shadow-2xl">
                <div className="flex items-center gap-3 pl-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-teal-500/30 border border-teal-400 flex items-center justify-center shrink-0">
                    <Check className="w-4 h-4 text-teal-300" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-semibold text-white">Karibu Rwanda! Itinerary Dispatched</p>
                    <p className="text-[11px] text-neutral-300">Curated travel guide sent to {email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setIsSubmitted(false); setEmail(''); }}
                  className="text-[11px] text-neutral-300 hover:text-white px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  Reset
                </button>
              </div>
            )}

            <div className="mt-3.5 flex items-center justify-center gap-4 text-[11px] text-neutral-300 tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                Verified Safe Destination
              </span>
              <span className="text-neutral-500">·</span>
              <span className="inline-flex items-center gap-1">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                Zero Single-Use Plastics
              </span>
            </div>
          </AnimatedSection>
        </div>

        {/* Scroll Indicator */}
        <AnimatedSection variant="fadeIn" delay={1.25} inView={true} className="relative z-10 pb-8 flex flex-col items-center justify-center">
          <button 
            onClick={() => scrollToSection('cards-section')}
            className="flex flex-col items-center text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer gap-1.5 group"
          >
            <span className="drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">Explore Chronicle</span>
            <div className="w-4 h-7 rounded-full border border-white/30 flex items-start justify-center p-1 group-hover:border-white/60 transition-colors bg-black/20 backdrop-blur-sm">
              <div className="w-1 h-1.5 bg-teal-400 rounded-full animate-bounce" />
            </div>
          </button>
        </AnimatedSection>
      </section>

      {/* ========================================================================= */}
      {/* 2. SECTION 1: NUMBERED INFORMATION CARDS (RIGHT -> LEFT FLOW)              */}
      {/* ========================================================================= */}
      {/* ========================================================================= */}
      {/* 2. SECTION 1: NUMBERED INFORMATION CARDS (RIGHT -> LEFT FLOW)              */}
      {/* ========================================================================= */}
      <section id="cards-section" ref={cardsReveal.ref as React.RefObject<HTMLElement>} className="relative py-24 sm:py-32 border-t border-white/10 overflow-hidden z-10">
        
        {/* Subtle teal atmospheric glow orb */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[400px] bg-teal-600/10 rounded-full blur-[120px] pointer-events-none blob-drift" />
        <div className="absolute top-1/3 right-10 w-[450px] h-[350px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none ambient-float" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <AnimatedSection variant="fadeUp" delay={0} inView={cardsReveal.inView}>
            <span className="text-xs uppercase tracking-[0.2em] text-teal-400 font-semibold">
              01 — Verified Foundations
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-instrument italic font-normal text-white mt-2">
              How Rwanda is defined
            </h2>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp" delay={0.15} inView={cardsReveal.inView} className="max-w-md">
            <p className="text-sm text-neutral-300 leading-relaxed">
              Official geography, biodiversity metrics, and conservation milestones of the Land of a Thousand Hills.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
              <span className="inline-block w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span>Continuously flowing stream · Hover to pause</span>
            </div>
          </AnimatedSection>
        </div>

        {/* Marquee Container Flowing continuously from RIGHT -> LEFT */}
        <AnimatedSection variant="fadeIn" delay={0.3} inView={cardsReveal.inView}>
          <div 
            className="relative w-full overflow-hidden select-none py-4"
            onMouseEnter={() => setIsMarqueePaused(true)}
            onMouseLeave={() => setIsMarqueePaused(false)}
          >
            {/* Subtle gradient scrim on sides */}
            <div className="absolute left-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-r from-black/40 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 inset-y-0 w-16 sm:w-28 bg-gradient-to-l from-black/40 to-transparent z-10 pointer-events-none" />

            <div 
              className="animate-flow-rtl flex gap-6 px-4"
              style={{ animationPlayState: isMarqueePaused ? 'paused' : 'running' }}
            >
              {/* Repeat cards array twice for seamless infinite loop */}
              {[...informationCards, ...informationCards].map((card, idx) => (
                <div
                  key={`${card.num}-${idx}`}
                  className="w-[320px] sm:w-[380px] shrink-0 p-7 rounded-2xl editorial-glass-card transition-all duration-300 relative group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Header with Large Index Number */}
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                      <span className="text-xs font-semibold tracking-wider text-teal-300 uppercase font-sans">
                        {card.title}
                      </span>
                      <span className="font-instrument italic text-4xl text-teal-300/40 group-hover:text-teal-300/70 transition-colors">
                        {card.num}
                      </span>
                    </div>

                    {/* Highlight pill text */}
                    <p className="text-xs text-neutral-400 mb-3 uppercase tracking-wider font-medium">
                      {card.highlight}
                    </p>

                    {/* Main Description */}
                    <p className="text-sm text-neutral-200 leading-relaxed mb-6 font-normal">
                      {card.description}
                    </p>
                  </div>

                  {/* Structured Stat Rows */}
                  <div className="space-y-2 pt-4 border-t border-white/[0.08] text-xs">
                    {card.stats.map((stat, sIdx) => (
                      <div key={sIdx} className="flex items-center justify-between py-1 border-b border-white/[0.05] last:border-0">
                        <span className="text-neutral-400 font-light">{stat.label}</span>
                        <span className="font-medium text-white text-right">{stat.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

      </section>

      {/* ========================================================================= */}
      {/* 3. SECTION 2: DISCOVER RWANDA (EDITORIAL SECTION + 5 INFO BLOCKS)        */}
      {/* ========================================================================= */}
      <section id="discover-section" ref={discoverReveal.ref as React.RefObject<HTMLElement>} className="relative py-28 sm:py-36 overflow-hidden border-t border-white/10 z-10">
        
        {/* Dot Matrix Decoration */}
        <div className="absolute top-16 left-6 w-28 h-48 dot-matrix opacity-20 pointer-events-none hidden md:block" />
        <div className="absolute top-16 right-6 w-28 h-48 dot-matrix opacity-20 pointer-events-none hidden md:block" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Centered Editorial Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
            <AnimatedSection variant="fadeUp" delay={0} inView={discoverReveal.inView}>
              <span className="text-xs uppercase tracking-[0.25em] text-teal-400 font-semibold">
                The Essence of the Country
              </span>
            </AnimatedSection>

            <AnimatedSection variant="revealUp" delay={0.15} inView={discoverReveal.inView}>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-instrument italic font-normal text-white mt-3 mb-6 tracking-tight">
                DISCOVER RWANDA
              </h2>
            </AnimatedSection>

            <AnimatedSection variant="fadeUp" delay={0.3} inView={discoverReveal.inView}>
              <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-normal text-balance">
                Rwanda is a land of extraordinary contrast and harmony. In a compact, peaceful territory, travellers discover mist-covered volcanic summits, ancient afro-montane cloud forests, tranquil freshwater shorelines, and expansive golden savannahs—all nurtured by dedicated conservation and vibrant cultural hospitality.
              </p>
            </AnimatedSection>
          </div>

          {/* 5 Information Blocks: Kigali • Nature • Wildlife • Culture • Adventure */}
          <StaggerContainer 
            staggerDelay={0.1} 
            baseDelay={0.4} 
            inView={discoverReveal.inView} 
            className="grid grid-cols-1 md:grid-cols-5 gap-px bg-white/10 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            {discoverBlocks.map((block, idx) => {
              const IconComponent = block.icon;
              return (
                <StaggerItem key={idx} variant="scaleIn">
                  <div 
                    className="bg-[#07131b]/80 backdrop-blur-md p-6 sm:p-7 hover:bg-[#0b1c26]/90 transition-all duration-300 flex flex-col justify-between group discover-block h-full"
                  >
                    <div>
                      <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-300 mb-5 discover-icon">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] uppercase tracking-wider text-teal-400 font-semibold block mb-1">
                        {block.subtitle}
                      </span>
                      <h3 className="text-xl font-instrument italic font-semibold text-white mb-3">
                        {block.title}
                      </h3>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {block.text}
                      </p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] text-teal-300 font-medium">
                      <span>Explore {block.title}</span>
                      <ArrowRight className="w-3 h-3 discover-arrow" />
                    </div>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. SECTION 3: FEATURE SECTION — WHERE RWANDA COMES ALIVE                 */}
      {/* ========================================================================= */}
      <section id="alive-section" ref={aliveReveal.ref as React.RefObject<HTMLElement>} className="relative py-28 sm:py-36 border-t border-white/10 overflow-hidden z-10">
        
        {/* Atmospheric Curved Radial Mask */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-teal-500/10 via-blue-500/5 to-transparent rounded-full blur-3xl pointer-events-none ambient-float" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Main Curved/Glass Container */}
          <AnimatedSection variant="fadeUp" delay={0} inView={aliveReveal.inView}>
            <div className="editorial-glass-panel rounded-3xl p-8 sm:p-12 md:p-16 border border-white/10 relative overflow-hidden backdrop-blur-xl">
              
              {/* Top Row: Title on Left, Introductory statement on Right */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pb-12 border-b border-white/10">
                <AnimatedSection variant="slideRight" delay={0.1} inView={aliveReveal.inView} className="lg:col-span-5">
                  <span className="text-xs uppercase tracking-[0.2em] text-teal-400 font-semibold">
                    03 — Distinctive Ecosystems
                  </span>
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-instrument italic font-normal text-white mt-2 leading-tight">
                    WHERE RWANDA COMES ALIVE
                  </h2>
                </AnimatedSection>
                <AnimatedSection variant="fadeIn" delay={0.2} inView={aliveReveal.inView} className="lg:col-span-7">
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
                    Five iconic destinations encapsulate the country’s diversity. From progressive urban design to misty primate canopies and wild savannah plains, explore the real destinations that define Rwanda’s global renown.
                  </p>
                </AnimatedSection>
              </div>

              {/* Structured Feature Rows */}
              <StaggerContainer 
                staggerDelay={0.08} 
                baseDelay={0.3} 
                inView={aliveReveal.inView} 
                className="mt-10 divide-y divide-white/10"
              >
                {featuresList.map((item, index) => (
                  <StaggerItem key={item.id} variant="fadeUp">
                    <div 
                      onClick={() => setActiveFeatureIndex(index)}
                      className={`py-7 transition-all duration-300 cursor-pointer group flex flex-col md:flex-row md:items-start justify-between gap-6 feature-row ${
                        activeFeatureIndex === index ? 'opacity-100' : 'opacity-70 hover:opacity-95'
                      }`}
                    >
                      <div className="flex items-start gap-5 md:w-5/12">
                        <span className="font-instrument italic text-3xl sm:text-4xl text-teal-400/60 group-hover:text-teal-300 transition-colors">
                          {item.id}
                        </span>
                        <div>
                          <span className="text-[11px] uppercase tracking-wider text-teal-400 font-medium block">
                            {item.kicker}
                          </span>
                          <h3 className="text-xl sm:text-2xl font-instrument italic text-white group-hover:text-teal-100 transition-colors mt-0.5">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      <div className="md:w-7/12 flex flex-col justify-between">
                        <p className="text-sm text-neutral-300 leading-relaxed">
                          {item.description}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-2 text-xs text-teal-300/90">
                          <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                          <span>{item.metrics}</span>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>

            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. SECTION 4: FINAL EDITORIAL SECTION — MORE THAN A DESTINATION           */}
      {/* ========================================================================= */}
      <section id="destination-section" ref={destinationReveal.ref as React.RefObject<HTMLElement>} className="relative py-28 sm:py-36 border-t border-white/10 overflow-hidden z-10">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-900/15 rounded-full blur-[140px] pointer-events-none blob-drift" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          
          {/* Large Rounded Panel matching reference design */}
          <AnimatedSection variant="fadeUp" delay={0} inView={destinationReveal.inView}>
            <div className="editorial-glass-panel rounded-[2.5rem] p-8 sm:p-14 md:p-20 border border-white/10 relative overflow-hidden bg-gradient-to-b from-[#091a24]/70 to-[#040d14]/90 shadow-2xl backdrop-blur-xl">
              
              {/* Top decorative badge */}
              <AnimatedSection variant="fadeIn" delay={0.1} inView={destinationReveal.inView} className="flex items-center justify-between mb-8">
                <span className="px-3.5 py-1.5 rounded-full bg-teal-500/15 border border-teal-500/30 text-xs text-teal-300 font-medium tracking-wide">
                  Visionary Tourism & Conservation
                </span>
                <span className="text-xs text-neutral-400 font-mono">
                  EAC · 26,338 KM²
                </span>
              </AnimatedSection>

              {/* Editorial Title */}
              <AnimatedSection variant="scaleIn" delay={0.2} inView={destinationReveal.inView}>
                <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-instrument italic font-normal text-white mb-8 tracking-tight">
                  MORE THAN A DESTINATION
                </h2>
              </AnimatedSection>

              {/* Core Narrative Paragraph */}
              <AnimatedSection variant="fadeUp" delay={0.3} inView={destinationReveal.inView}>
                <p className="text-base sm:text-xl text-neutral-200 leading-relaxed max-w-4xl font-light mb-12">
                  Rwanda represents an inspiring union of breathtaking landscapes, rare wildlife, living culture, and empowered local communities. In one compact, highly accessible country, travelers experience volcanic summits, savannah plains, and primeval cloud forests—with 10% of all national tourism park revenue shared directly with surrounding communities to build schools, clinics, and clean water networks.
                </p>
              </AnimatedSection>

              {/* 4 Pillars Grid */}
              <StaggerContainer 
                staggerDelay={0.1} 
                baseDelay={0.4} 
                inView={destinationReveal.inView} 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-white/10"
              >
                <StaggerItem variant="fadeUp">
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md pillar-card h-full">
                    <span className="text-teal-400 font-instrument italic text-3xl block mb-2">01</span>
                    <h4 className="text-sm font-semibold text-white mb-2">Compact & Connected</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Every major ecosystem lies within a 2 to 4-hour scenic drive from Kigali along smooth, paved highways.
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem variant="fadeUp">
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md pillar-card h-full">
                    <span className="text-teal-400 font-instrument italic text-3xl block mb-2">02</span>
                    <h4 className="text-sm font-semibold text-white mb-2">Community Revenue Sharing</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Over $10 million channeled into local village infrastructure, directly connecting tourism with human prosperity.
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem variant="fadeUp">
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md pillar-card h-full">
                    <span className="text-teal-400 font-instrument italic text-3xl block mb-2">03</span>
                    <h4 className="text-sm font-semibold text-white mb-2">Conservation Benchmark</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Mountain gorilla numbers have expanded from critically endangered to over 1,000 across the Virunga Massif.
                    </p>
                  </div>
                </StaggerItem>

                <StaggerItem variant="fadeUp">
                  <div className="p-5 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md pillar-card h-full">
                    <span className="text-teal-400 font-instrument italic text-3xl block mb-2">04</span>
                    <h4 className="text-sm font-semibold text-white mb-2">Global Safety & Cleanliness</h4>
                    <p className="text-xs text-neutral-300 leading-relaxed">
                      Consistently celebrated among the cleanest, safest, and most peaceful nations for solo and family travelers alike.
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>

            </div>
          </AnimatedSection>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. SECTION 5: CLOSING SECTION — COME DISCOVER RWANDA                      */}
      {/* ========================================================================= */}
      <section id="closing-section" ref={closingReveal.ref as React.RefObject<HTMLElement>} className="relative py-32 sm:py-44 overflow-hidden border-t border-white/10 z-10">
        
        {/* Ambient bottom cone glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-t from-teal-500/25 via-blue-600/10 to-transparent blur-3xl pointer-events-none ambient-float" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          
          <AnimatedSection variant="fadeUp" delay={0} inView={closingReveal.inView}>
            <span className="text-xs uppercase tracking-[0.25em] text-teal-400 font-semibold mb-4 inline-block">
              Your Journey Begins Here
            </span>
          </AnimatedSection>

          <AnimatedSection variant="revealUp" delay={0.15} inView={closingReveal.inView}>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-instrument italic font-normal text-white mb-6 tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
              COME DISCOVER RWANDA
            </h2>
          </AnimatedSection>

          <AnimatedSection variant="fadeUp" delay={0.3} inView={closingReveal.inView}>
            <p className="text-base sm:text-xl text-neutral-200 leading-relaxed max-w-2xl mx-auto font-light mb-10 text-balance drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              From the hills of Kigali to forests, lakes and savannahs, your journey begins here.
            </p>
          </AnimatedSection>

          {/* Refined CTA Button */}
          <AnimatedSection variant="fadeUp" delay={0.45} inView={closingReveal.inView} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActiveModal('plan')}
              className="px-8 py-3.5 sm:py-4 text-sm sm:text-base font-semibold text-black bg-white rounded-full hover:bg-neutral-100 transition-all shadow-[0_4px_25px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer btn-primary-lift"
            >
              <span>EXPLORE RWANDA</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </AnimatedSection>

          {/* Practical travel details */}
          <AnimatedSection variant="fadeIn" delay={0.6} inView={closingReveal.inView} className="mt-12 inline-flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-300 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]">
            <span>✈️ 30-Day Visa On Arrival for all citizens</span>
            <span className="text-neutral-500">·</span>
            <span>🌿 Kigali International Airport (KGL)</span>
            <span className="text-neutral-500">·</span>
            <span>⭐ Year-Round Mild Mountain Climate</span>
          </AnimatedSection>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. REFINED EDITORIAL FOOTER                                               */}
      {/* ========================================================================= */}
      <footer ref={footerReveal.ref as React.RefObject<HTMLElement>} className="relative z-10 w-full bg-[#020508]/85 backdrop-blur-md border-t border-white/10 py-12 px-6 sm:px-10 text-xs text-neutral-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          
          <AnimatedSection variant="fadeIn" delay={0} inView={footerReveal.inView} className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <a href="#" className="font-instrument italic text-2xl text-white">
              Visit Rwanda 🇷🇼
            </a>
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span>Official Tourism & Conservation Chronicle</span>
          </AnimatedSection>

          <StaggerContainer 
            staggerDelay={0.06} 
            baseDelay={0.15} 
            inView={footerReveal.inView} 
            className="flex flex-wrap items-center justify-center gap-6 text-neutral-300"
          >
            <StaggerItem variant="fadeUp">
              <button onClick={() => scrollToSection('cards-section')} className="hover:text-white transition-colors footer-link">At A Glance</button>
            </StaggerItem>
            <StaggerItem variant="fadeUp">
              <button onClick={() => scrollToSection('discover-section')} className="hover:text-white transition-colors footer-link">Discover</button>
            </StaggerItem>
            <StaggerItem variant="fadeUp">
              <button onClick={() => scrollToSection('alive-section')} className="hover:text-white transition-colors footer-link">National Parks</button>
            </StaggerItem>
            <StaggerItem variant="fadeUp">
              <button onClick={() => scrollToSection('destination-section')} className="hover:text-white transition-colors footer-link">Community Impact</button>
            </StaggerItem>
            <StaggerItem variant="fadeUp">
              <button onClick={() => scrollToSection('closing-section')} className="hover:text-white transition-colors footer-link">Travel Info</button>
            </StaggerItem>
          </StaggerContainer>

          <AnimatedSection variant="fadeIn" delay={0.3} inView={footerReveal.inView} className="text-neutral-400 text-center sm:text-right">
            <span>© 2026 Visit Rwanda. Verified Factual Reference.</span>
          </AnimatedSection>

        </div>
      </footer>

      {/* ========================================================================= */}
      {/* 8. INTERACTIVE MODAL DIALOGS                                             */}
      {/* ========================================================================= */}
      {activeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#08121c] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-1.5 text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <div className="w-10 h-10 rounded-full bg-teal-500/20 border border-teal-400/40 flex items-center justify-center mb-4 text-teal-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-2xl font-bold tracking-tight text-white mb-2">Curate Your Rwanda Expedition</h3>
              <p className="text-sm text-neutral-400 mb-5 leading-relaxed">
                Connect directly with certified guides for gorilla permits in Volcanoes National Park, savannah safaris in Akagera, and canopy walks in Nyungwe.
              </p>
              <div className="space-y-3 mb-6">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Gorilla Trekking Permits</p>
                    <p className="text-xs text-neutral-400">Volcanoes National Park · Strictly regulated conservation</p>
                  </div>
                  <span className="text-xs font-semibold text-teal-400 bg-teal-900/40 px-2.5 py-1 rounded-full">Available</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white">Akagera Big Five Safaris</p>
                    <p className="text-xs text-neutral-400">Restored savannah · Lake boat safari excursions</p>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400 bg-emerald-900/40 px-2.5 py-1 rounded-full">Year-round</span>
                </div>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="w-full py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-100 transition-colors text-sm"
              >
                Close Planner
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
