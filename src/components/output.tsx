import React, { useRef, useEffect } from 'react';
import {
  Github, Star, GitFork, Zap, Calendar, Clock,
  MapPin, Trophy, Share2, Download, ArrowLeft,
  Code, Activity, Layers, Users, GitPullRequest,
  Heart, BookMarked
} from 'lucide-react';

// --- TYPES ---
export interface Language {
  name: string;
  percent: number;
  color: string;
}

export interface MonthlyActivity {
  month: string;
  value: number;
}

export interface ContributionType {
  label: string;
  value: number;
  color: string;
}

export interface Repository {
  name: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  languageColor: string;
}

export interface Profile {
  bio: string;
  location: string;
  joined: string;
  followers: number;
  following: number;
}

export interface Stats {
  commits: number;
  repos: number;
  starsReceived: number;
  forks: number;
  topLanguages: Language[];
  topRepositories: Repository[];
  busiestDay: string;
  busiestTime: string;
  longestStreak: number;
  personality: string;
  personalityDesc: string;
  monthlyActivity: MonthlyActivity[];
  contributionBreakdown: ContributionType[];
}

export interface MockData {
  username: string;
  avatar: string;
  year: number;
  profile: Profile;
  stats: Stats;
}

// --- DEFAULT DATA (Fallback) ---
const defaultData: MockData = {
  username: "octocat",
  avatar: "https://github.com/ghost.png",
  year: 2024,
  profile: {
    bio: "Building the future of open source. 🚀",
    location: "San Francisco, CA",
    joined: "2018",
    followers: 1250,
    following: 42
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
    topRepositories: [
      {
        name: "octo-engine",
        description: "A high-performance rendering engine for the web.",
        stars: 342,
        forks: 45,
        language: "Rust",
        languageColor: "#dea584"
      },
      {
        name: "react-magic",
        description: "Hooks you didn't know you needed until now.",
        stars: 215,
        forks: 30,
        language: "TypeScript",
        languageColor: "#3178c6"
      },
      {
        name: "data-viz-kit",
        description: "Beautiful charts made simple.",
        stars: 189,
        forks: 22,
        language: "Python",
        languageColor: "#3572A5"
      },
      {
        name: "go-micro",
        description: "Microservices framework for modern backend.",
        stars: 150,
        forks: 18,
        language: "Go",
        languageColor: "#00ADD8"
      }
    ],
    busiestDay: "Wednesday",
    busiestTime: "Late Night 🌑",
    longestStreak: 18,
    personality: "The Night Owl 🦉",
    personalityDesc: "Most of your commits happen after 8 PM. Who needs sleep when there's code to ship?",
    monthlyActivity: [
      { month: 'Jan', value: 45 }, { month: 'Feb', value: 60 }, { month: 'Mar', value: 85 },
      { month: 'Apr', value: 40 }, { month: 'May', value: 90 }, { month: 'Jun', value: 120 },
      { month: 'Jul', value: 75 }, { month: 'Aug', value: 30 }, { month: 'Sep', value: 100 },
      { month: 'Oct', value: 140 }, { month: 'Nov', value: 80 }, { month: 'Dec', value: 55 }
    ],
    contributionBreakdown: [
      { label: "Commits", value: 65, color: "#4ade80" }, // Green
      { label: "PRs", value: 20, color: "#a78bfa" },     // Purple
      { label: "Reviews", value: 10, color: "#fbbf24" }, // Yellow
      { label: "Issues", value: 5, color: "#f87171" }    // Red
    ]
  }
};

// --- STYLES ---
const OutputStyles: React.FC = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;700;900&family=JetBrains+Mono:wght@400;700&display=swap');

    :root {
      --font-grotesk: 'Space Grotesk', sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }

    .font-grotesk { font-family: var(--font-grotesk); }
    .font-mono { font-family: var(--font-mono); }

    .glass-card {
      background: rgba(20, 20, 25, 0.6);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
    }

    .glass-card-dark {
      background: rgba(10, 10, 15, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }

    .noise-bg {
      background-image: url('https://assets.iceable.com/img/noise-transparent.png');
      opacity: 0.03;
    }

    .grid-bg {
      background-size: 50px 50px;
      background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
      mask-image: radial-gradient(circle at center, black 0%, transparent 80%);
    }

    /* Custom Animations (Replacing GSAP) */
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes growBar {
      from { transform: scaleY(0); }
      to { transform: scaleY(1); }
    }

    @keyframes spinIn {
      from { opacity: 0; transform: rotate(-180deg) scale(0.8); }
      to { opacity: 1; transform: rotate(0deg) scale(1); }
    }

    @keyframes float-1 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      33% { transform: translate(10px, -10px) rotate(5deg); }
      66% { transform: translate(-5px, 5px) rotate(-5deg); }
    }

    @keyframes float-2 {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      50% { transform: translate(-10px, -15px) rotate(-3deg); }
    }

    @keyframes blob-move-1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(20px, 20px) scale(1.1); }
    }

    @keyframes blob-move-2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(-20px, -20px) scale(1.1); }
    }

    .animate-enter {
      animation: fadeUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      opacity: 0;
    }

    .animate-grow-bar {
      transform-origin: bottom;
      animation: growBar 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
      transform: scaleY(0);
    }

    .animate-spin-in {
      animation: spinIn 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      opacity: 0;
    }

    .animate-float-1 { animation: float-1 8s ease-in-out infinite; }
    .animate-float-2 { animation: float-2 10s ease-in-out infinite; }
    
    .animate-blob-1 { animation: blob-move-1 15s ease-in-out infinite; }
    .animate-blob-2 { animation: blob-move-2 18s ease-in-out infinite; }

    /* Delays */
    .delay-100 { animation-delay: 100ms; }
    .delay-200 { animation-delay: 200ms; }
    .delay-300 { animation-delay: 300ms; }
    .delay-400 { animation-delay: 400ms; }
    .delay-500 { animation-delay: 500ms; }
    .delay-600 { animation-delay: 600ms; }
    .delay-700 { animation-delay: 700ms; }
    .delay-800 { animation-delay: 800ms; }

    /* Print styles */
    @media print {
      body { background: black !important; -webkit-print-color-adjust: exact; }
      .no-print { display: none !important; }
      .print-break { page-break-inside: avoid; }
    }
  `}</style>
);

// --- SUB-COMPONENTS (Background) ---

const BackgroundElements = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Custom Parallax Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      const elements = containerRef.current.querySelectorAll('.parallax-layer');
      elements.forEach((el) => {
        const speed = parseFloat(el.getAttribute('data-speed') || '1');
        (el as HTMLElement).style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Moving Gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-green-900/10 rounded-full blur-[120px] animate-blob-1 parallax-layer" data-speed="0.2" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10 rounded-full blur-[100px] animate-blob-2 parallax-layer" data-speed="0.3" />

      {/* Perspective Grid */}
      <div className="absolute inset-0 grid-bg transform perspective-1000 rotate-x-60 scale-150 opacity-20" />

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 opacity-20 animate-float-1 parallax-layer" data-speed="0.5">
        <Code size={64} className="text-green-500" />
      </div>
      <div className="absolute bottom-1/3 right-10 opacity-20 animate-float-2 parallax-layer" data-speed="0.4">
        <GitFork size={80} className="text-purple-500" />
      </div>
      <div className="absolute top-20 right-1/4 opacity-10 animate-float-1 parallax-layer" data-speed="0.6">
        <Zap size={48} className="text-yellow-500" />
      </div>
    </div>
  );
};


// --- SUB-COMPONENTS (Charts) ---

const SimpleBarChart = ({ data }: { data: MonthlyActivity[] }) => {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div className="w-full h-48 flex items-end justify-between gap-2 mt-4">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 group relative">
          {/* Tooltip */}
          <div className="absolute -top-8 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
            {item.value} contribs
          </div>
          {/* Bar */}
          <div className="w-full h-full flex items-end">
            <div
              className="w-full bg-white/10 rounded-t-sm group-hover:bg-green-400/80 transition-all duration-300 ease-out relative overflow-hidden animate-grow-bar"
              style={{ height: `${(item.value / max) * 100}%`, animationDelay: `${0.8 + (i * 0.05)}s` }}
            >
              <div className="absolute bottom-0 left-0 w-full h-1 bg-green-500/50" />
            </div>
          </div>
          {/* Label */}
          <div className="text-[10px] font-mono text-white/30 uppercase animate-enter" style={{ animationDelay: `${1 + (i * 0.05)}s` }}>{item.month}</div>
        </div>
      ))}
    </div>
  );
};

const SimpleDonutChart = ({ data }: { data: ContributionType[] }) => {
  let currentAngle = 0;
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const gradientParts = data.map(item => {
    const start = currentAngle;
    const percentage = (item.value / total) * 100;
    const end = currentAngle + percentage;
    currentAngle = end;
    return `${item.color} ${start}% ${end}%`;
  }).join(', ');

  return (
    <div className="flex flex-col items-center gap-6 w-full donut-container">
      {/* Chart */}
      <div
        className="w-32 h-32 rounded-full flex-shrink-0 relative donut-ring animate-spin-in delay-700"
        style={{ background: `conic-gradient(${gradientParts})` }}
      >
        <div className="absolute inset-4 bg-[#0a0a0f] rounded-full flex items-center justify-center">
          <div className="text-center">
            <div className="text-xs text-white/40 font-mono">TOTAL</div>
            <div className="text-lg font-bold text-white">100%</div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3 w-full max-w-[200px]">
        {data.map((item, i) => (
          <div key={item.label} className="flex items-center justify-between text-sm legend-item animate-enter" style={{ animationDelay: `${0.8 + (i * 0.1)}s` }}>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
              <span className="text-white/70">{item.label}</span>
            </div>
            <span className="font-mono font-bold text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---

interface OutputPageProps {
  data?: MockData;
  onBack?: () => void;
}

const OutputPage: React.FC<OutputPageProps> = ({ data = defaultData, onBack }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `GitHub Wrapped 2025: ${data.username}`,
        text: `Check out my coding year in review! I'm a ${data.stats.personality}.`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-grotesk relative overflow-x-hidden selection:bg-green-500/30">
      <OutputStyles />
      <BackgroundElements />
      <div className="absolute inset-0 noise-bg pointer-events-none fixed z-0" />

      {/* Navigation Bar (No Print) */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-black/50 backdrop-blur-md border-b border-white/5 no-print animate-enter">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={18} />
          <span className="font-mono text-sm">Back to Story</span>
        </button>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
            title="Share"
          >
            <Share2 size={18} />
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-bold hover:bg-slate-200 transition-colors"
          >
            <Download size={16} />
            <span className="text-sm">Download Report</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-4xl relative z-10" ref={reportRef}>

        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-center md:items-start justify-between mb-12 gap-6 animate-enter delay-100">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-purple-500 rounded-full blur opacity-50" />
              <img
                src={data.avatar}
                alt={data.username}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-black relative z-10"
              />
              <div className="absolute -bottom-2 -right-2 bg-black p-1.5 rounded-full border border-white/10 z-20 text-white">
                <Github size={24} />
              </div>
            </div>
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-mono mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                2025 WRAPPED
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-1">@{data.username}</h1>
              <p className="text-white/60 mb-3 max-w-md">{data.profile?.bio || "A mysterious coder..."}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-white/40">
                <span className="flex items-center gap-1.5"><MapPin size={12} /> {data.profile?.location || "Earth"}</span>
                <span className="flex items-center gap-1.5"><Calendar size={12} /> Joined {data.profile?.joined || "2024"}</span>
                <span className="flex items-center gap-1.5"><Users size={12} /> {data.profile?.followers.toLocaleString()} Followers</span>
                <span className="flex items-center gap-1.5"><Heart size={12} /> {data.profile?.following.toLocaleString()} Following</span>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right print-break">
            <div className="text-sm font-mono text-white/40 uppercase tracking-widest mb-1">Developer Class</div>
            <div className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              {data.stats.personality}
            </div>
          </div>
        </header>

        {/* Primary Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Commits', value: data.stats.commits, icon: Activity, color: 'text-green-400' },
            { label: 'Repositories', value: data.stats.repos, icon: Layers, color: 'text-blue-400' },
            { label: 'Stars Earned', value: data.stats.starsReceived, icon: Star, color: 'text-yellow-400' },
            { label: 'Active Streak', value: data.stats.longestStreak, icon: Zap, color: 'text-orange-400' },
          ].map((stat, i) => (
            <div key={i} className={`glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center hover:bg-white/5 transition-colors group animate-enter`} style={{ animationDelay: `${200 + (i * 100)}ms` }}>
              <stat.icon className={`mb-3 ${stat.color} group-hover:scale-110 transition-transform`} size={24} />
              <div className="text-3xl font-black mb-1">{stat.value.toLocaleString()}</div>
              <div className="text-xs font-mono text-white/40 uppercase">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Monthly Activity Chart (Spans 2 cols) */}
          <div className="glass-card p-6 rounded-2xl col-span-1 md:col-span-2 print-break animate-enter delay-400">
            <div className="flex items-center justify-between mb-4">
              <h3 className="flex items-center gap-2 text-lg font-bold text-white/80">
                <Activity size={18} /> 2025 Activity Graph
              </h3>
              <span className="text-xs font-mono text-white/40 uppercase">Commits per Month</span>
            </div>
            {data.stats.monthlyActivity ? (
              <SimpleBarChart data={data.stats.monthlyActivity} />
            ) : (
              <div className="h-48 flex items-center justify-center text-white/20 font-mono">No activity data available</div>
            )}
          </div>

          {/* Contribution Breakdown (Spans 1 col) */}
          <div className="glass-card p-6 rounded-2xl col-span-1 print-break flex flex-col animate-enter delay-500">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-6 text-white/80">
              <GitPullRequest size={18} /> Breakdown
            </h3>
            <div className="flex-1 flex items-center justify-center w-full">
              {data.stats.contributionBreakdown ? (
                <SimpleDonutChart data={data.stats.contributionBreakdown} />
              ) : (
                <div className="h-48 flex items-center justify-center text-white/20 font-mono">No breakdown available</div>
              )}
            </div>
          </div>

        </div>

        {/* Top Repositories Section */}
        {data.stats.topRepositories && data.stats.topRepositories.length > 0 && (
          <div className="mb-8 animate-enter delay-600">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-4 text-white/80 header-item">
              <BookMarked size={18} /> Top Repositories
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.stats.topRepositories.map((repo, i) => (
                <div key={i} className="glass-card p-5 rounded-2xl flex flex-col justify-between hover:bg-white/5 transition-colors group">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg text-white group-hover:text-green-400 transition-colors">{repo.name}</h4>
                      <div className="flex items-center gap-1 text-xs font-mono text-white/40">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: repo.languageColor }}></span>
                        {repo.language}
                      </div>
                    </div>
                    <p className="text-sm text-white/60 mb-4 line-clamp-2">{repo.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-mono text-white/50">
                    <span className="flex items-center gap-1"><Star size={12} className="text-yellow-500" /> {repo.stars}</span>
                    <span className="flex items-center gap-1"><GitFork size={12} /> {repo.forks}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Detailed Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Activity Column */}
          <div className="glass-card p-6 rounded-2xl col-span-1 print-break animate-enter delay-700">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-6 text-white/80">
              <Clock size={18} /> Peak Productivity
            </h3>

            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono text-white/40 mb-1">MOST ACTIVE TIME</div>
                <div className="text-xl font-bold text-purple-300">{data.stats.busiestTime}</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="w-[75%] h-full bg-purple-500 rounded-full animate-grow-bar" style={{ animationDelay: '1s' }} />
                </div>
              </div>

              <div>
                <div className="text-xs font-mono text-white/40 mb-1">MOST ACTIVE DAY</div>
                <div className="text-xl font-bold text-pink-300">{data.stats.busiestDay}</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className="w-[60%] h-full bg-pink-500 rounded-full animate-grow-bar" style={{ animationDelay: '1.2s' }} />
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 mt-1">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-yellow-500">Top 1% Contributor</div>
                    <div className="text-xs text-white/50 mt-1 leading-relaxed">
                      You're in the top tier of developers based on commit volume this year.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Languages Column (Wider) */}
          <div className="glass-card p-6 rounded-2xl col-span-1 md:col-span-2 print-break animate-enter delay-800">
            <h3 className="flex items-center gap-2 text-lg font-bold mb-6 text-white/80">
              <Code size={18} /> Tech Stack
            </h3>

            <div className="space-y-4">
              {data.stats.topLanguages.map((lang, i) => (
                <div key={lang.name} className="group">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-white/30 text-xs w-4">0{i + 1}</span>
                      <span className="font-bold">{lang.name}</span>
                    </div>
                    <span className="font-mono text-xs text-white/50">{lang.percent}%</span>
                  </div>
                  <div className="relative h-3 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all duration-1000 group-hover:brightness-110 animate-grow-bar"
                      style={{ width: `${lang.percent}%`, backgroundColor: lang.color, animationDelay: `${1.4 + (i * 0.1)}s` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 glass-card-dark rounded-xl flex gap-4 items-center">
              <div className="h-10 w-1 bg-green-500 rounded-full"></div>
              <p className="text-sm text-white/70 italic">
                "{data.stats.personalityDesc}"
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center pt-12 pb-8 opacity-40 hover:opacity-100 transition-opacity animate-enter delay-800">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Github size={20} />
            <span className="font-black tracking-tighter text-xl">GITHUB WRAPPED</span>
          </div>
          <p className="font-mono text-xs">
            Generated for {data.username} • {new Date().toLocaleDateString()}
          </p>
        </footer>

      </div>
    </div>
  );
};

export default OutputPage;