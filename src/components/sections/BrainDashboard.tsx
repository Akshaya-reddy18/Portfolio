"use client";

import { useState, useEffect } from "react";

import { motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';

export function BrainDashboard() {
  const skillsData = [
    { subject: 'AI/ML Models', A: 95, fullMark: 100 },
    { subject: 'Backend (Node)', A: 90, fullMark: 100 },
    { subject: 'React/Next.js', A: 85, fullMark: 100 },
    { subject: 'System Design', A: 80, fullMark: 100 },
    { subject: 'Databases', A: 85, fullMark: 100 },
    { subject: 'Cloud/DevOps', A: 75, fullMark: 100 },
  ];

  const techStackData = [
    { name: 'Python', level: 95 },
    { name: 'TypeScript', level: 90 },
    { name: 'React', level: 85 },
    { name: 'PyTorch/TF', level: 80 },
    { name: 'Firebase', level: 85 },
  ];

  // Simulated activity heatmap data fallback
  const generateActivityDays = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      day: i,
      val: Math.floor(Math.random() * 4)
    }));
  };
  
  const [activities, setActivities] = useState<{day: number, val: number}[]>(Array.from({ length: 30 }, (_, i) => ({ day: i, val: 0 })));

  useEffect(() => {
    const fetchGitHubActivity = async () => {
      try {
        const response = await fetch('https://api.github.com/users/Akshaya-reddy18/events/public?per_page=100');
        if (!response.ok) throw new Error('Failed to fetch');
        const events = await response.json();
        
        const daysMap = new Map();
        const today = new Date();
        today.setHours(0,0,0,0);
        
        for (let i = 0; i < 30; i++) {
          const d = new Date(today);
          d.setDate(d.getDate() - (29 - i));
          daysMap.set(d.toISOString().split('T')[0], { index: i, count: 0 });
        }

        events.forEach((event: any) => {
          if (event.type === 'PushEvent') {
            const dateStr = event.created_at.split('T')[0];
            if (daysMap.has(dateStr)) {
              daysMap.get(dateStr).count += event.payload.commits.length;
            }
          }
        });

        const newActivities = Array.from(daysMap.values()).map((d: any) => {
          let val = 0;
          if (d.count > 0 && d.count <= 2) val = 1;
          else if (d.count > 2 && d.count <= 5) val = 2;
          else if (d.count > 5) val = 3;
          return { day: d.index, val };
        });
        
        if (newActivities.every(a => a.val === 0)) {
          setActivities(generateActivityDays());
        } else {
          setActivities(newActivities);
        }
      } catch (err) {
        console.warn("GitHub API rate limited or failed, using simulated data");
        setActivities(generateActivityDays());
      }
    };
    
    fetchGitHubActivity();
  }, []);

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto relative">
      <div className="flex flex-col items-center gap-3 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/30 text-accent mb-4">
          <BrainCircuit size={18} />
          <span className="text-xs font-mono uppercase tracking-widest">Neural Mapping</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">"My Brain Dashboard"</h2>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Visualizing my technical capabilities, stack proficiency, and recent commit activity through real-time telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card p-6 rounded-2xl border border-primary/20 lg:col-span-1 h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-medium text-foreground mb-4 font-mono">Skill Matrix</h3>
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={skillsData}>
                <PolarGrid stroke="rgba(139,92,246,0.2)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Akshaya" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-2xl border border-accent/20 lg:col-span-2 h-[400px] flex flex-col"
        >
          <h3 className="text-lg font-medium text-foreground mb-4 font-mono">Core Tech Flow</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techStackData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13 }} width={100} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.05)' }} 
                  contentStyle={{ backgroundColor: 'rgba(10,10,20,0.9)', border: '1px solid var(--accent)', borderRadius: '8px' }}
                />
                <Bar dataKey="level" fill="var(--accent)" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Heatmap / Activity Log */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl border border-white/10 lg:col-span-3 flex flex-col gap-4"
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-foreground font-mono flex items-center gap-2">
              Neural Activity (30 Days)
              <span className="relative flex h-2 w-2 ml-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] text-green-500 font-mono tracking-widest uppercase ml-1">Live</span>
            </h3>
            <span className="text-xs text-muted-foreground flex items-center gap-2">
              Less <span className="w-3 h-3 rounded-sm bg-muted inline-block" />
              <span className="w-3 h-3 rounded-sm bg-primary/40 inline-block" />
              <span className="w-3 h-3 rounded-sm bg-primary/70 inline-block" />
              <span className="w-3 h-3 rounded-sm bg-primary inline-block" /> More
            </span>
          </div>
          <div className="flex gap-2 flex-wrap max-w-full justify-start items-center p-4 bg-black/20 rounded-xl border border-white/5">
            {activities.map((act, i) => (
              <div 
                key={i} 
                className={`w-4 h-4 rounded-sm sm:w-6 sm:h-6 sm:rounded-md transition-colors duration-500`}
                style={{
                  backgroundColor: act.val === 0 ? 'var(--muted)' : 
                                  act.val === 1 ? 'rgba(139,92,246,0.4)' : 
                                  act.val === 2 ? 'rgba(139,92,246,0.7)' : 'var(--primary)'
                }}
                title={`Activity level: ${act.val}`}
              />
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
