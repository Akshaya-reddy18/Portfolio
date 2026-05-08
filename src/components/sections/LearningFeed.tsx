"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Radio, GitCommit, BookOpen, Brain, TerminalSquare, Activity } from "lucide-react";

type FeedItem = {
  id: string;
  type: string;
  content: string;
  icon: any;
  color: string;
  bgColor: string;
  time: string;
  timestamp: Date;
};

const initialItems: FeedItem[] = [
  {
    id: "1",
    type: "learning",
    content: "Diving deep into Agentic AI workflows with LangChain & LangGraph.",
    icon: <Brain size={16} />,
    color: "text-primary",
    bgColor: "bg-primary/20",
    time: "Current focus",
    timestamp: new Date(Date.now() - 1000 * 60 * 30)
  },
  {
    id: "2",
    type: "commit",
    content: "feat: implemented semantic chunking strategy for RAG pipeline",
    icon: <GitCommit size={16} />,
    color: "text-accent",
    bgColor: "bg-accent/20",
    time: "2 hours ago",
    timestamp: new Date(Date.now() - 1000 * 60 * 120)
  },
  {
    id: "3",
    type: "milestone",
    content: "Completed deployment of an end-to-end sentiment analysis API using FastAPI.",
    icon: <TerminalSquare size={16} />,
    color: "text-emerald-400",
    bgColor: "bg-emerald-400/20",
    time: "Yesterday",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24)
  },
  {
    id: "4",
    type: "reading",
    content: "Reading: 'Attention Is All You Need' - reviewing transformer architectures.",
    icon: <BookOpen size={16} />,
    color: "text-blue-400",
    bgColor: "bg-blue-400/20",
    time: "3 days ago",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72)
  }
];

const mockUpdates = [
  "fix: resolved memory leak in vector store indexing",
  "chore: updated OpenAI embeddings model to v3",
  "docs: refined system architecture diagrams",
  "perf: optimized ChromaDB similarity search queries",
];

export function LearningFeed() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialItems);

  // Auto-updating commits to simulate live telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      const randomUpdate = mockUpdates[Math.floor(Math.random() * mockUpdates.length)];
      const newItem: FeedItem = {
        id: Date.now().toString(),
        type: "commit",
        content: randomUpdate,
        icon: <GitCommit size={16} />,
        color: "text-accent",
        bgColor: "bg-accent/20",
        time: "Just now",
        timestamp: new Date()
      };
      
      setFeedItems(prev => {
        const updated = [newItem, ...prev];
        return updated.slice(0, 5); // Keep top 5
      });
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
  };

  return (
    <section className="py-16 px-6 max-w-4xl mx-auto relative overflow-hidden">

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="text-primary animate-pulse relative z-10" size={28} />
            <div className="absolute inset-0 bg-primary/40 blur-md rounded-full" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">"Live Telemetry"</h2>
        </div>
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-500/30 bg-red-500/10 text-red-400 font-mono text-xs tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.2)]">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="font-bold">LIVE</span>
        </div>
      </div>

      <div className="relative border-l-2 border-primary/20 ml-4 md:ml-8 space-y-6 pb-8">
        <AnimatePresence>
          {feedItems.map((item, idx) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20, height: 0 }}
              animate={{ opacity: 1, x: 0, height: "auto" }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ duration: 0.4 }}
              className="relative pl-8 md:pl-12 py-2"
            >
              {/* Timeline Node */}
              <div className={`absolute top-1/2 -translate-y-1/2 -left-[17px] w-8 h-8 rounded-full ${item.bgColor} ${item.color} border border-${item.color.split('-')[1]}/30 flex items-center justify-center shadow-[0_0_10px_currentColor] z-10`}>
                {item.icon}
              </div>

              {/* Content Box */}
              <div className="glass-card p-5 rounded-2xl border text-sm md:text-base border-white/5 hover:border-primary/30 transition-all hover:bg-white/5 shadow-md">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm ${item.bgColor} ${item.color} border border-white/5`}>
                      {item.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground/60">
                    <Activity size={12} className={idx === 0 ? "text-primary animate-pulse" : ""} />
                    <span>{formatTime(item.timestamp)}</span>
                    <span className="opacity-50 hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{item.time}</span>
                  </div>
                </div>
                <p className="text-foreground/90 leading-relaxed font-medium">{item.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="flex items-center justify-center gap-3 mt-8 text-xs font-mono text-primary/60 border border-primary/10 w-fit mx-auto px-4 py-2 rounded-full glass">
        <Activity size={14} className="animate-pulse" />
        Connection to Akshaya's neural activity queue is stable.
      </div>
    </section>
  );
}
