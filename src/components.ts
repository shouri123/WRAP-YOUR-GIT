import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { 
  Github, 
  Star, 
  GitFork, 
  Code, 
  Zap, 
  Share2, 
  Download, 
  Terminal, 
  ArrowRight,
  TrendingUp,
  Award,
  Sparkles,
  RefreshCw,
  Copy,
  Check,
  Calendar,
  Clock,
  Heart,
  Music,
  LucideIcon
} from 'lucide-react';

// --- TYPES ---

interface Language {
  name: string;
  percent: number;
  color: string;
}

interface Stats {
  commits: number;
  repos: number;
  starsReceived: number;
  forks: number;
  topLanguages: Language[];
  busiestDay: string;
  busiestTime: string;
  longestStreak: number;
  personality: string;
  personalityDesc: string;
}

interface MockData {
  username: string;
  avatar: string;
  year: number;
  stats: Stats;
}

// --- MOCK DATA ENGINE ---
const generateMockData = (username: string): MockData => ({
  username: username || "developer",
  avatar: `https://github.com/${username}.png`,
  year: 2024,
  stats: {
    commits: Math.floor(Math.random() * 3000) + 500,
    repos: Math.floor(Math.random() * 50) + 5,
    starsReceived: Math.floor(Math.random() * 1000) + 50,
    forks: Math.floor(Math.random() * 200) + 10,
    topLanguages: [
      { name: "TypeScript", percent: 45, color: "#3178c6" },
      { name: "Rust", percent: 30, color: "#dea584" },
      { name: "Python", percent: 15, color: "#3572A5" },
      { name: "Go", percent: 10, color: "#00ADD8" }
    ],
    busiestDay: ["Tuesday", "Wednesday", "Thursday"][Math.floor(Math.random() * 3)],
    busiestTime: ["Late Night 🌑", "Early Morning 🌅", "Lunch Break 🥪"][Math.floor(Math.random() * 3)],
    longestStreak: Math.floor(Math.random() * 40) + 5,
    personality: ["The Night Owl 🦉", "The PR Machine 🤖", "The Bug Hunter 🕸️", "The Architect 🏛️"][Math.floor(Math.random() * 4)],
    personalityDesc: "You don't just write code; you craft digital legacies. Your commit graph looks like a green mountain range."
  }
});

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
    }

    /* Keyframes */
    @keyframes slide-in-right {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slide-out-left {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(-20%); opacity: 0; }
    }
    @keyframes scale-up-vibrant {
      0% { transform: scale(0.8); opacity: 0; filter: blur(10px); }
      100% { transform: scale(1); opacity: 1; filter: blur(0px); }
    }
    @keyframes text-reveal {
      0% { transform: translateY(100%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes gradient-shift {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
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

    /* Utilities */
    .font-grotesk { font-family: var(--font-grotesk); }
    .font-mono { font-family: var(--font-mono); }
    
    .animate-text-reveal {
      animation: text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }

    .noise-overlay {
      position: fixed;
      top: -50%;
      left: -50%;
      right: -50%;
      bottom: -50%;
      width: 200%;
      height: 200vh;
      background: transparent url('http://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
      background-repeat: repeat;
      animation: grain 8s steps(10) infinite;
      opacity: 0.05;
      pointer-events: none;
      z-index: 50;
    }

    /* Hide Scrollbar */
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
  `}</style>
);

// --- COMPONENT: STORY PROGRESS BAR ---

interface StoryProgressProps {
  total: number;
  current: number;
  onComplete: () => void;
  isPaused: boolean;
}

const StoryProgress: React.FC<StoryProgressProps> = ({ total, current, onComplete, isPaused }) => {
  return (
    <div className="absolute top-0 left-0 w-full z-50 flex gap-1 p-2 pt-4 safe-area-top">
      {Array.from({ length: total }).map((_, idx) => (
        <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-white transition-all duration-100 ease-linear ${
              idx < current ? 'w-full' : 'w-0'
            }`}
            style={
              idx === current ? {
                animationName: 'progress',
                animationDuration: '5s',
                animationTimingFunction: 'linear',
                animationFillMode: 'forwards',
                animationPlayState: isPaused ? 'paused' : 'running'
              } : {}
            }
            onAnimationEnd={idx === current ? onComplete : undefined}
          />
        </div>
      ))}
      <style>{`
        @keyframes progress { from { width: 0%; } to { width: 100%; } }
      `}</style>
    </div>
  );
};

// --- SLIDE COMPONENTS ---

interface SlideProps {
  data: MockData;
}

const IntroSlide: React.FC<SlideProps> = ({ data }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6">
    <div className="mb-8 relative">
      <div className="absolute inset-0 bg-green-500/30 blur-[60px] rounded-full animate-pulse" />
      <img 
        src={data.avatar} 
        alt="avatar" 
        className="w-32 h-32 rounded-full border-4 border-white/10 relative z-10 shadow-2xl animate-scale-up-vibrant"
      />
    </div>
    <h1 className="text-6xl font-black mb-4 tracking-tighter leading-[0.9] overflow-hidden">
      <span className="block animate-text-reveal delay-100">HELLO</span>
      <span className="block animate-text-reveal delay-200 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
        @{data.username}
      </span>
    </h1>
    <p className="text-xl text-white/70 font-mono animate-text-reveal delay-500">
      Ready to unwrap 2024?
    </p>
  </div>
);

const CommitsSlide: React.FC<SlideProps> = ({ data }) => (
  <div className="flex flex-col justify-center h-full px-8 relative overflow-hidden">
    <div className="absolute -right-20 top-20 opacity-10 rotate-12">
      <Github size={400} />
    </div>
    <h2 className="text-3xl font-bold mb-8 text-white/60">You kept busy.</h2>
    <div className="flex items-baseline gap-2 mb-4">
      <span className="text-8xl font-black tracking-tighter animate-text-reveal text-green-400">
        {data.stats.commits}
      </span>
    </div>
    <h3 className="text-4xl font-black uppercase tracking-tight animate-text-reveal delay-200">
      Commits Pushed
    </h3>
    <div className="mt-12 glass-panel p-6 rounded-2xl animate-text-reveal delay-300">
      <div className="flex items-center gap-4 mb-2">
        <Zap className="text-yellow-400" />
        <span className="font-mono text-sm opacity-80">LONGEST STREAK</span>
      </div>
      <div className="text-4xl font-bold">{data.stats.longestStreak} DAYS</div>
      <p className="text-sm opacity-60 mt-2">You were on fire! 🔥</p>
    </div>
  </div>
);

const DaySlide: React.FC<SlideProps> = ({ data }) => (
  <div className="flex flex-col justify-center h-full px-8 bg-black/20">
    <h2 className="text-4xl font-black mb-12 text-center leading-tight">
      <span className="block text-white/50 text-2xl mb-2">You were a</span>
      {data.stats.busiestTime}
      <span className="block text-white/50 text-2xl mt-2">coder</span>
    </h2>

    <div className="grid gap-4">
      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between transform -rotate-2">
        <div>
          <div className="text-xs font-mono uppercase opacity-60 mb-1">Most Active Day</div>
          <div className="text-3xl font-bold text-pink-400">{data.stats.busiestDay}s</div>
        </div>
        <Calendar size={32} className="text-pink-400 opacity-50" />
      </div>

      <div className="glass-panel p-6 rounded-2xl flex items-center justify-between transform rotate-2">
        <div>
          <div className="text-xs font-mono uppercase opacity-60 mb-1">Total Stars</div>
          <div className="text-3xl font-bold text-yellow-400">{data.stats.starsReceived}</div>
        </div>
        <Star size={32} className="text-yellow-400 opacity-50" />
      </div>
    </div>
  </div>
);

const LanguagesSlide: React.FC<SlideProps> = ({ data }) => (
  <div className="flex flex-col justify-center h-full px-8">
    <h2 className="text-5xl font-black mb-8 leading-[0.9]">
      You speak <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">fluent code.</span>
    </h2>
    
    <div className="space-y-4">
      {data.stats.topLanguages.map((lang, i) => (
        <div 
          key={lang.name} 
          className="relative h-16 bg-white/5 rounded-xl overflow-hidden flex items-center px-4 animate-text-reveal"
          style={{ animationDelay: `${i * 100}ms` }}
        >
          <div 
            className="absolute top-0 left-0 h-full opacity-20 transition-all duration-1000 ease-out"
            style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
          />
          <div className="relative z-10 flex justify-between w-full items-center">
            <span className="font-bold text-xl">{lang.name}</span>
            <span className="font-mono opacity-60">{lang.percent}%</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const SummarySlide: React.FC<SlideProps> = ({ data }) => (
  <div className="flex flex-col items-center justify-center h-full px-6 pt-12 pb-24">
    <div className="relative w-full aspect-[4/5] max-h-[60vh] bg-slate-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl animate-scale-up-vibrant group">
      {/* Card Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-black" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/20 blur-[80px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full" />
      
      {/* Card Content */}
      <div className="relative z-10 h-full flex flex-col p-6 text-center">
        <div className="flex justify-between items-start mb-6">
          <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md">
            <Github className="w-6 h-6" />
          </div>
          <div className="text-right">
            <div className="text-xs font-mono opacity-50">GITHUB WRAPPED</div>
            <div className="font-bold">2024</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-lg opacity-50" />
            <img 
              src={data.avatar} 
              className="w-24 h-24 rounded-full border-4 border-slate-900 relative z-10" 
            />
            <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-black p-1 rounded-full border-4 border-slate-900 z-20">
              <Award size={16} />
            </div>
          </div>

          <h2 className="text-3xl font-black mb-2 leading-none bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            {data.stats.personality}
          </h2>
          <p className="text-sm opacity-60 mb-8 max-w-[200px] mx-auto leading-relaxed">
            {data.stats.personalityDesc}
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="text-xs opacity-50 mb-1">Commits</div>
              <div className="text-xl font-bold">{data.stats.commits}</div>
            </div>
            <div className="bg-white/5 p-3 rounded-xl">
              <div className="text-xs opacity-50 mb-1">Top Lang</div>
              <div className="text-xl font-bold text-blue-400">{data.stats.topLanguages[0].name}</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="text-xs font-mono opacity-40">github-wrapped.com</div>
          <div className="flex gap-1">
            {[1,2,3,4,5].map(i => (
              <div key={i} className={`w-1 h-4 rounded-full ${i<4 ? 'bg-green-500' : 'bg-green-900'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="mt-8 flex gap-4 w-full max-w-sm animate-text-reveal delay-500">
      <button className="flex-1 bg-white text-black font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:scale-105 transition-transform">
        <Share2 size={18} /> Share
      </button>
      <button className="flex-1 bg-white/10 font-bold py-4 rounded-full flex items-center justify-center gap-2 backdrop-blur-md hover:bg-white/20 transition-colors">
        <Download size={18} /> Save
      </button>
    </div>
  </div>
);

// --- MAIN WRAPPED VIEW ---

interface StoryViewProps {
  data: MockData;
  onReset: () => void;
}

const StoryView: React.FC<StoryViewProps> = ({ data, onReset }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const slides = [
    { id: 'intro', component: IntroSlide, theme: 'from-slate-900 to-slate-800' },
    { id: 'commits', component: CommitsSlide, theme: 'from-green-900 to-slate-900' },
    { id: 'day', component: DaySlide, theme: 'from-purple-900 to-slate-900' },
    { id: 'langs', component: LanguagesSlide, theme: 'from-blue-900 to-slate-900' },
    { id: 'summary', component: SummarySlide, theme: 'from-slate-900 to-black' }
  ];

  const CurrentComponent = slides[currentSlide].component;

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(c => c + 1);
    } else {
      // End of story? maybe loop or just stay
    }
  }, [currentSlide, slides.length]);

  const prevSlide = useCallback(() => {
    if (currentSlide > 0) {
      setCurrentSlide(c => c - 1);
    }
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div 
      className={`fixed inset-0 z-50 transition-colors duration-700 ease-in-out bg-gradient-to-br ${slides[currentSlide].theme}`}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <div className="noise-overlay" />
      
      {/* Progress Bars */}
      <StoryProgress 
        total={slides.length} 
        current={currentSlide} 
        onComplete={nextSlide}
        isPaused={isPaused}
      />

      {/* Close/Reset Button */}
      <button 
        onClick={onReset}
        className="absolute top-6 right-4 z-50 p-2 bg-black/20 rounded-full backdrop-blur-md text-white/50 hover:text-white transition-colors"
      >
        <RefreshCw size={20} />
      </button>

      {/* Tap Navigation Zones */}
      <div className="absolute inset-0 flex z-40">
        <div className="w-1/3 h-full" onClick={prevSlide} />
        <div className="w-2/3 h-full" onClick={nextSlide} />
      </div>

      {/* Slide Content */}
      <div className="relative z-30 h-full max-w-md mx-auto safe-area-bottom">
        <div key={currentSlide} className="h-full animate-text-reveal">
          <CurrentComponent data={data} />
        </div>
      </div>
    </div>
  );
};

// --- LANDING & LOADING (Kept Clean) ---

interface LandingViewProps {
  onGenerate: (username: string) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onGenerate }) => {
  const [username, setUsername] = useState('');
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center bg-black relative overflow-hidden font-grotesk">
       <div className="noise-overlay" />
       <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-green-600/30 rounded-full blur-[120px]" />
       <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[120px]" />

       <div className="relative z-10 max-w-md w-full">
         <div className="inline-block mb-6 animate-float">
           <Github size={64} className="text-white" />
         </div>
         <h1 className="text-7xl font-black tracking-tighter mb-6 leading-[0.9]">
           GITHUB <br/>
           <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">WRAPPED</span>
         </h1>
         
         <form 
           onSubmit={(e: React.FormEvent) => { e.preventDefault(); if(username) onGenerate(username); }}
           className="relative group"
         >
            <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl blur opacity-30 group-hover:opacity-70 transition duration-500" />
            <div className="relative flex items-center bg-black/80 rounded-2xl p-2 ring-1 ring-white/10 backdrop-blur-xl">
              <span className="pl-4 font-mono text-white/40">@</span>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="w-full bg-transparent p-4 text-xl font-bold text-white outline-none font-mono placeholder:text-white/20"
                autoFocus
              />
              <button 
                type="submit" 
                className="bg-white text-black p-4 rounded-xl font-bold hover:scale-105 transition-transform active:scale-95"
              >
                <ArrowRight />
              </button>
            </div>
         </form>
         
         <p className="mt-8 text-white/40 font-mono text-xs uppercase tracking-widest">
           Your 2024 Coding Review
         </p>
       </div>
    </div>
  );
};

interface LoadingViewProps {
  onComplete: () => void;
}

const LoadingView: React.FC<LoadingViewProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(p => {
        if(p >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return p + 2;
      });
    }, 40);
    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white font-mono">
       <div className="w-64">
         <div className="flex justify-between mb-2 text-xs opacity-50">
           <span>ANALYZING_REPO_DATA</span>
           <span>{progress}%</span>
         </div>
         <div className="h-2 bg-white/10 rounded-full overflow-hidden">
           <div 
             className="h-full bg-green-500 transition-all duration-100 ease-out" 
             style={{ width: `${progress}%` }} 
           />
         </div>
         <div className="mt-4 text-xs text-center text-green-500/80 animate-pulse">
           {progress < 30 && "Fetching commits..."}
           {progress >= 30 && progress < 70 && "Calculating velocity..."}
           {progress >= 70 && "Generating aura..."}
         </div>
       </div>
    </div>
  );
};

// --- MAIN APP ---

type ViewState = 'landing' | 'loading' | 'story';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [data, setData] = useState<MockData | null>(null);

  const handleGenerate = (user: string) => {
    setData(generateMockData(user));
    setView('loading');
  };

  return (
    <div className="bg-black min-h-screen text-white overflow-hidden select-none touch-manipulation">
      <GlobalStyles />
      {view === 'landing' && <LandingView onGenerate={handleGenerate} />}
      {view === 'loading' && <LoadingView onComplete={() => setView('story')} />}
      {view === 'story' && data && <StoryView data={data} onReset={() => setView('landing')} />}
    </div>
  );
};

export default App;