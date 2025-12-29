import React, { useState, useEffect, useCallback } from 'react';
import {
  Github, Star, Zap, Calendar, RefreshCw
} from 'lucide-react';
import OutputPage, { type MockData as OutputMockData } from './output';

// --- TYPES ---
export interface Language {
  name: string;
  percent: number;
  color: string;
}

export interface Stats {
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

export interface MockData extends OutputMockData { }

// --- STYLES & ANIMATIONS ---
const StoryStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

    :root {
      --font-grotesk: 'Space Grotesk', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    .font-grotesk { font-family: var(--font-grotesk); }
    .font-mono { font-family: var(--font-mono); }

    /* Animations */
    @keyframes text-reveal {
      0% { transform: translateY(100%); opacity: 0; }
      100% { transform: translateY(0); opacity: 1; }
    }
    @keyframes scale-up-vibrant {
      0% { transform: scale(0.8); opacity: 0; filter: blur(10px); }
      100% { transform: scale(1); opacity: 1; filter: blur(0px); }
    }
    @keyframes progress { from { width: 0%; } to { width: 100%; } }

    .animate-text-reveal {
      animation: text-reveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-scale-up-vibrant {
      animation: scale-up-vibrant 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .glass-panel {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    }
    
    .noise-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: transparent url('https://assets.iceable.com/img/noise-transparent.png') repeat 0 0;
      opacity: 0.05;
      pointer-events: none;
      z-index: 10;
    }
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
            className={`h-full bg-white transition-all duration-100 ease-linear ${idx < current ? 'w-full' : 'w-0'
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
    </div>
  );
};

// --- SLIDE COMPONENTS ---
interface SlideProps {
  data: MockData;
  onFinish?: () => void;
}

const IntroSlide: React.FC<SlideProps> = ({ data }) => (
  <div className="flex flex-col items-center justify-center h-full text-center px-6 text-white">
    <div className="mb-8 relative">
      <div className="absolute inset-0 bg-green-500/30 blur-[60px] rounded-full animate-pulse" />
      <img
        src={data.avatar}
        alt="avatar"
        className="w-32 h-32 rounded-full border-4 border-white/10 relative z-10 shadow-2xl animate-scale-up-vibrant"
      />
    </div>
    <h1 className="text-6xl font-black mb-4 tracking-tighter leading-[0.9] overflow-hidden font-grotesk">
      <span className="block animate-text-reveal delay-100">HELLO</span>
      <span className="block animate-text-reveal delay-200 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400">
        @{data.username}
      </span>
    </h1>
    <p className="text-xl text-white/70 font-mono animate-text-reveal delay-500">
      Ready to unwrap 2025?
    </p>
  </div>
);

const CommitsSlide: React.FC<SlideProps> = ({ data }) => (
  <div className="flex flex-col justify-center h-full px-8 relative overflow-hidden text-white font-grotesk">
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
  <div className="flex flex-col justify-center h-full px-8 bg-black/20 text-white font-grotesk">
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
  <div className="flex flex-col justify-center h-full px-8 text-white font-grotesk">
    <h2 className="text-5xl font-black mb-8 leading-[0.9]">
      You speak <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">fluent code.</span>
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

// --- MAIN WRAPPED VIEW ---

interface StoryModeProps {
  data?: MockData; // Optional, can generate internally if missing
  onReset?: () => void;
  onFinish?: () => void;
}

// Default Data Generator if no props provided
const defaultData: MockData = {
  username: "demo_user",
  avatar: "https://github.com/ghost.png",
  year: 2025,
  profile: {
    bio: "I code, therefore I am.",
    location: "The Cloud",
    joined: "2020",
    followers: 100,
    following: 50
  },
  stats: {
    commits: 1243,
    repos: 42,
    starsReceived: 890,
    forks: 120,
    topLanguages: [
      { name: "TypeScript", percent: 45, color: "#3178c6" },
      { name: "Rust", percent: 30, color: "#dea584" },
      { name: "Python", percent: 15, color: "#3572A5" },
      { name: "Go", percent: 10, color: "#00ADD8" }
    ],
    topRepositories: [],
    busiestDay: "Wednesday",
    busiestTime: "Late Night 🌑",
    longestStreak: 18,
    personality: "The Night Owl 🦉",
    personalityDesc: "Most of your commits happen after 8 PM. Who needs sleep when there's code to ship?",
    monthlyActivity: [],
    contributionBreakdown: []
  }
};

const StoryMode: React.FC<StoryModeProps> = ({ data = defaultData, onReset, onFinish }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    { id: 'intro', component: IntroSlide, theme: 'from-slate-900 to-slate-800' },
    { id: 'commits', component: CommitsSlide, theme: 'from-green-900 to-slate-900' },
    { id: 'day', component: DaySlide, theme: 'from-purple-900 to-slate-900' },
    { id: 'langs', component: LanguagesSlide, theme: 'from-blue-900 to-slate-900' },
    { id: 'output', component: () => null, theme: 'black' }
  ];

  const CurrentComponent = slides[currentSlide].component;

  const nextSlide = useCallback(() => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(c => c + 1);
    } else {
      // Loop or Stop? For now, we stop at the last slide.
      // If you want to loop: setCurrentSlide(0);
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

  if (slides[currentSlide].id === 'output') {
    return <OutputPage data={data} onBack={prevSlide} />;
  }

  return (
    <div
      className={`fixed inset-0 z-50 transition-colors duration-700 ease-in-out bg-gradient-to-br ${slides[currentSlide].theme} select-none`}
      onMouseDown={() => setIsPaused(true)}
      onMouseUp={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <StoryStyles />
      <div className="noise-overlay" />

      {/* Progress Bars */}
      <StoryProgress
        total={slides.length}
        current={currentSlide}
        onComplete={nextSlide}
        isPaused={isPaused}
      />

      {/* Close/Reset Button */}
      {onReset && (
        <button
          onClick={onReset}
          className="absolute top-6 right-4 z-50 p-2 bg-black/20 rounded-full backdrop-blur-md text-white/50 hover:text-white transition-colors"
        >
          <RefreshCw size={20} />
        </button>
      )}

      {/* Tap Navigation Zones */}
      <div className="absolute inset-0 flex z-40">
        <div className="w-1/3 h-full cursor-w-resize" onClick={prevSlide} />
        <div className="w-2/3 h-full cursor-e-resize" onClick={nextSlide} />
      </div>

      {/* Slide Content */}
      <div className="relative z-30 h-full max-w-md mx-auto safe-area-bottom pointer-events-none">
        {/* Enable pointer events on children if they have interactive elements */}
        <div key={currentSlide} className="h-full pointer-events-auto">
          <CurrentComponent data={data} onFinish={onFinish} />
        </div>
      </div>
    </div>
  );
};

export default StoryMode;