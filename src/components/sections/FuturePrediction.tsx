"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FastForward, Zap, LineChart, Play, Pause } from "lucide-react";
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export function FuturePrediction() {
  const [timeframe, setTimeframe] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeframe((prev) => (prev >= 3 ? 1 : prev + 1));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const predictionData = [
    { year: 2024, architecture: 50, ai: 60, product: 40 },
    { year: 2025, architecture: 70, ai: 85, product: 60 },
    { year: 2026, architecture: 85, ai: 95, product: 75 },
    { year: 2027, architecture: 92, ai: 98, product: 85 },
    { year: 2028, architecture: 97, ai: 100, product: 92 },
  ];

  const getPrediction = () => {
    switch (timeframe) {
      case 1:
        return {
          title: "AI Engineer",
          focus: ["LLM Fine-tuning", "Vector DB Optimization", "Agentic Workflows"],
          description: "Focusing heavily on production-scaling of Generative AI applications and orchestrating full-stack AI workflows.",
        };
      case 2:
        return {
          title: "Senior AI Engineer",
          focus: ["Distributed AI Systems", "Real-time MLOps", "Custom Foundation Models"],
          description: "Designing scalable AI infrastructure that handles large concurrent inferences with optimized low-latency architectures.",
        };
      case 3:
      default:
        return {
          title: "AI Architect",
          focus: ["AGI System Paradigms", "Brain-Computer Interfaces", "Self-Optimizing Infra"],
          description: "Leading R&D for next-generation intelligence products merging software engineering with cutting-edge AI breakthroughs.",
        };
    }
  };

  const prediction = getPrediction();

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto relative overflow-hidden">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div className="flex items-center gap-3">
          <FastForward className="text-accent" size={24} />
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">"Future Trajectory"</h2>
        </div>
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-sm border transition-all ${
            isPlaying ? "bg-accent/20 border-accent text-accent shadow-[0_0_15px_rgba(236,72,153,0.3)] animate-pulse" : "bg-muted/50 border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30"
          }`}
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          {isPlaying ? "SIMULATING..." : "PLAY SIMULATION"}
        </button>
      </div>

      <p className="text-muted-foreground mb-10 max-w-2xl text-lg">
        Using my current learning velocity and market trends, this algorithm predicts my career evolution. Let the simulation run or manually explore the timeline.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Controls and Output */}
        <div className="glass-card p-8 rounded-2xl flex flex-col justify-between border border-accent/20">
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="font-mono text-sm text-muted-foreground uppercase tracking-wider">Temporal Range</span>
              <span className="text-accent font-bold font-mono">+{timeframe} YEAR{timeframe > 1 ? 'S' : ''}</span>
            </div>
            
            <input 
              type="range" 
              min="1" max="3" step="1"
              value={timeframe}
              onChange={(e) => {
                setTimeframe(Number(e.target.value));
                setIsPlaying(false);
              }}
              className="w-full accent-accent bg-muted h-2 rounded-lg appearance-none cursor-pointer mb-10"
            />

            <motion.div
              key={timeframe}
              initial={{ opacity: 0, x: -20, filter: "blur(4px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-sm font-mono text-muted-foreground uppercase mb-1">Predicted Role</h3>
                <div className="text-2xl font-bold text-foreground flex items-center gap-2 relative inline-flex">
                  <Zap size={20} className="text-primary animate-pulse" />
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{prediction.title}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-mono text-muted-foreground uppercase mb-2">Key Areas of Focus</h3>
                <div className="flex flex-wrap gap-2">
                  {prediction.focus.map((f, i) => (
                    <motion.span 
                      key={i} 
                      initial={{ opacity: 0, scale: 0.9 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ delay: i * 0.1 }}
                      className="px-3 py-1 bg-accent/10 border border-accent/20 text-accent text-sm rounded-md font-medium"
                    >
                      {f}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-mono text-muted-foreground uppercase mb-1">System Synthesis</h3>
                <p className="text-base text-foreground/80 leading-relaxed">
                  {prediction.description}
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Projection Chart */}
        <div className="glass-card p-6 rounded-2xl border border-white/5 flex flex-col relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
          <h3 className="text-lg font-medium font-mono mb-6 flex items-center gap-2 relative z-10">
            <LineChart size={18} /> Skill Growth Projection
          </h3>
          <div className="flex-1 w-full min-h-[300px] relative z-10">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorAi" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.6}/>
                     <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
                   </linearGradient>
                   <linearGradient id="colorArch" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.6}/>
                     <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <XAxis dataKey="year" stroke="rgba(255,255,255,0.3)" fontSize={12} tickLine={false} axisLine={false} />
                 <Tooltip 
                   cursor={{ stroke: 'rgba(255,255,255,0.2)', strokeWidth: 1, strokeDasharray: '3 3' }}
                   contentStyle={{ backgroundColor: 'rgba(10,10,20,0.95)', border: '1px solid var(--accent)', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}
                   itemStyle={{ fontSize: '13px', fontWeight: 500 }}
                   labelStyle={{ fontSize: '14px', marginBottom: '6px', color: '#fff', fontWeight: 'bold' }}
                 />
                 <Area type="monotone" dataKey="ai" stroke="var(--primary)" fillOpacity={1} fill="url(#colorAi)" strokeWidth={3} animationDuration={2000} />
                 <Area type="monotone" dataKey="architecture" stroke="var(--accent)" fillOpacity={1} fill="url(#colorArch)" strokeWidth={3} animationDuration={2000} />
               </AreaChart>
             </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4 text-xs font-mono justify-center relative z-10">
            <span className="flex items-center gap-1 text-primary"><div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_var(--primary)]" /> AI & Models</span>
            <span className="flex items-center gap-1 text-accent"><div className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--accent)]" /> Architecture</span>
          </div>
        </div>

      </div>
    </section>
  );
}
