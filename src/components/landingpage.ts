import React, { useState, useEffect, useRef } from 'react';
import { Github, ArrowRight, Code, Zap, Share2, Terminal, Activity, Star } from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const GlobalStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

    :root {
      --font-grotesk: 'Space Grotesk', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    body {
      font-family: var(--font-grotesk);
      background-color: black;
      margin: 0;
      overflow: hidden;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-20px) rotate(5deg); }
    }

    @keyframes float-reverse {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(15px) rotate(-5deg); }
    }

    @keyframes scroll {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }

    @keyframes grain {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-5%, -10%); }
      20% { transform: translate(-15%, 5%); }
      30% { transform: translate(7%, -25%); }
      40% { transform: translate(-5%, 25%); }
      50% { transform: translate(-15%, 10%); }
      60% { transform: translate(15%, 0%); }
      70% { transform: translate(0%, 15%); }
      80% { transform: translate(3%, 35%); }
      90% { transform: translate(-10%, 10%); }
    }

    .font-grotesk { font-family: var(--font-grotesk); }
    .font-mono { font-family: var(--font-mono); }

    .animate-float { animation: float 6s ease-in-out infinite; }
    .animate-float-reverse { animation: float-reverse 7s ease-in-out infinite; }

    .noise-overlay {
      position: fixed;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      width: 200%;
      height: 200vh;
      background: transparent url('https://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
      background-repeat: repeat;
      animation: grain 8s steps(10) infinite;
      opacity: 0.05;
      pointer-events: none;
      z-index: 50;
    }

    /* Marquee Styles */
    .marquee-container {
      mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    }
    .marquee-content {
      animation: scroll 20s linear infinite;
    }
  `}</style>
);

// --- SUB-COMPONENTS ---

const FloatingParticle = ({ children, delay, x, y, size }: { children: React.ReactNode, delay: number, x: string, y: string, size: string }) => (
  <div 
    className="absolute text-white/5 font-mono pointer-events-none select-none animate-float"
    style={{ 
      left: x, 
      top: y, 
      fontSize: size,
      animationDelay: `${delay}s`,
      zIndex: 1
    }}
  >
    {children}
  </div>
);

const FeatureBadge = ({ icon: Icon, text }: { icon: any, text: string }) => (
  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs font-mono text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-default backdrop-blur-sm">
    <Icon size={12} />
    <span>{text}</span>
  </div>
);

const LiveTicker = () => {
  const items = [
    "Just wrapped: @octocat",
    "Analysis complete: @torvalds",
    "Calculating stars for @ptr_thomas",
    "Processing commits for @shadcn",
    "New wrap: @dan_abramov",
    "Generating report: @lee_rob"
  ];

  return (
    <div className="absolute bottom-8 left-0 w-full z-20 marquee-container overflow-hidden pointer-events-none">
      <div className="flex gap-12 whitespace-nowrap w-max marquee-content">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-xs font-mono text-green-400/60 uppercase tracking-widest">
            <Activity size={10} className="animate-pulse" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

interface LandingViewProps {
  onGenerate?: (username: string) => void;
}

const LandingPage: React.FC<LandingViewProps> = ({ onGenerate }) => {
  const [username, setUsername] = useState<string>('');
  const [mousePos, setMousePos] = useState<{x: number, y: number}>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle Parallax & Tilt Logic
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - left) / width - 0.5;
    const y = (e.clientY - top) / height - 0.5;
    setMousePos({ x, y });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && onGenerate) {
      onGenerate(username);
    } else if (username) {
      console.log(`Generating wrapped for: ${username}`);
    }
  };
  
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-black relative overflow-hidden font-grotesk text-white selection:bg-green-500/30"
      onMouseMove={handleMouseMove}
      ref={containerRef}
    >
       <GlobalStyles />
       
       {/* Background Effects */}
       <div className="noise-overlay" />
       
       {/* Interactive Blobs (Parallax) */}
       <div 
         className="absolute top-[-20%] left-[-20%] w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[120px] transition-transform duration-200 ease-out will-change-transform" 
         style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
       />
       <div 
         className="absolute bottom-[-20%] right-[-20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] transition-transform duration-200 ease-out will-change-transform"
         style={{ transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px)` }}
       />

       {/* Floating Code Particles */}
       <FloatingParticle delay={0} x="10%" y="20%" size="24px">git commit -m "fire"</FloatingParticle>
       <FloatingParticle delay={2} x="85%" y="15%" size="48px">{`{ }`}</FloatingParticle>
       <FloatingParticle delay={1} x="80%" y="60%" size="18px">npm install life</FloatingParticle>
       <FloatingParticle delay={3} x="15%" y="70%" size="32px">404</FloatingParticle>
       <FloatingParticle delay={4} x="50%" y="10%" size="14px">console.log("hello")</FloatingParticle>

       {/* Main Card Content (3D Tilt) */}
       <div 
         className="relative z-10 max-w-lg w-full transition-transform duration-200 ease-out"
         style={{ 
           transform: `perspective(1000px) rotateX(${mousePos.y * 5}deg) rotateY(${mousePos.x * -5}deg)` 
         }}
       >
         {/* Floating Icons */}
         <div className="absolute -top-12 -right-12 text-white/10 animate-float">
           <Code size={120} />
         </div>
         <div className="absolute -bottom-12 -left-12 text-white/10 animate-float-reverse">
           <Terminal size={100} />
         </div>

         {/* Hero Section */}
         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-green-400 mb-8 backdrop-blur-md animate-pulse">
           <span className="w-2 h-2 rounded-full bg-green-500"></span>
           2024 EDITION LIVE
         </div>

         <div className="inline-block mb-6 animate-float relative group">
           <div className="absolute inset-0 bg-green-500/50 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-full" />
           <Github size={72} className="text-white relative z-10" />
         </div>
         
         <h1 className="text-7xl md:text-8xl font-black tracking-tighter mb-6 leading-[0.9] drop-shadow-2xl">
           GITHUB <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-emerald-300 to-cyan-400 animate-gradient">WRAPPED</span>
         </h1>

         <p className="text-xl text-white/60 mb-10 max-w-sm mx-auto font-light">
           Discover your coding personality, top languages, and hidden stats.
         </p>
         
         {/* Input Form */}
         <form 
           onSubmit={handleSubmit}
           className="relative group mb-12"
         >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500 group-hover:duration-200" />
            
            <div className="relative flex items-center bg-black/80 rounded-2xl p-2 ring-1 ring-white/10 backdrop-blur-xl shadow-2xl">
              <span className="pl-4 font-mono text-white/40 text-lg">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-transparent p-4 text-xl font-bold text-white outline-none font-mono placeholder:text-white/20"
                autoFocus
              />
              <button 
                type="submit" 
                className="bg-white text-black p-4 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95 group-hover:bg-green-400 group-hover:text-black shadow-lg"
              >
                <ArrowRight />
              </button>
            </div>
         </form>

         {/* Feature Badges */}
         <div className="flex flex-wrap justify-center gap-3 opacity-80">
            <FeatureBadge icon={Zap} text="Instant Analysis" />
            <FeatureBadge icon={Share2} text="Story Mode" />
            <FeatureBadge icon={Star} text="Rankings" />
         </div>
       </div>

       {/* Live Ticker */}
       <LiveTicker />
    </div>
  );
};

export default LandingPage;