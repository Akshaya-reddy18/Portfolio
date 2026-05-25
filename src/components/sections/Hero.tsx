"use client";

import { useState, useEffect } from "react";
import { motion, Variants, useMotionValue, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { personalData } from "@/lib/data";
import { Terminal, Cpu, Network } from "lucide-react";
import { useChat } from "@/lib/hooks/useChat";
import HeroModel from "@/components/3d/HeroModel";

const Typewriter = ({ text, delay = 100 }: { text: string, delay?: number }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prevText => prevText + text[currentIndex]);
        setCurrentIndex(prevIndex => prevIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text]);

  return <span>{currentText}<span className="animate-pulse">|</span></span>;
};

export function Hero() {
  const { isLoading } = useChat();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // 3D Tilt Effect Logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 px-6 overflow-hidden">
      {/* Soft ambient gradient from the top */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-primary/10 via-transparent to-transparent pointer-events-none" style={{ willChange: "opacity" }} />
      
      {/* Subtle particle background effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
              opacity: Math.random()
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>
      
      <div className="max-w-6xl w-full z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 flex flex-col items-start text-left gap-8 z-20"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-primary/30 text-primary text-xs font-mono tracking-widest uppercase shadow-[0_0_10px_rgba(139,92,246,0.2)]">
            <Terminal size={14} />
            <span>AI OS . v3.0.0</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tighter">
            <span className="block text-foreground">{personalData.name}</span>
            <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient text-transparent bg-clip-text pb-2 drop-shadow-sm">
              <Typewriter text="AI-Powered Digital Twin" delay={80} />
            </span>
          </motion.h1>

          <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl border-l-2 border-primary pl-4 italic">
            "You're interacting with my intelligent counterpart. It knows my skills, projects, and architecture."
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
            <button 
              onClick={() => scrollToSection('chat')}
              className="px-8 py-3 rounded-md bg-primary text-primary-foreground font-medium flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(139,92,246,0.6)] hover:shadow-[0_0_30px_rgba(139,92,246,0.8)] hover:-translate-y-1"
            >
              <Cpu size={18} className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "System Processing..." : "Initialize Chat"}
            </button>
            <button 
              onClick={() => scrollToSection('knowledge-graph')}
              className="px-8 py-3 rounded-md glass text-foreground font-medium flex items-center gap-2 hover:bg-white/10 transition-all hover:-translate-y-1"
            >
              <Network size={18} />
              Search Knowledge Graph
            </button>
          </motion.div>
        </motion.div>

        {/* AI Cinematic Portrait Side (Right) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex flex-1 justify-center relative z-10 perspective-[1000px]"
        >
          {/* Main Float Animation Wrapper */}
          <motion.div 
            animate={{ 
              y: [0, -15, 0],
              scale: [1, 1.02, 1] 
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="relative w-[400px] h-[500px] flex items-center justify-center"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
            {/* Cinematic Background Auras */}
            <motion.div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[550px] bg-primary/40 blur-[80px] rounded-full transition-all duration-700 ${isLoading ? 'opacity-100 scale-125 bg-primary/70' : 'opacity-80 scale-100'}`}
              style={{ transform: "translateZ(-50px)", willChange: "transform, opacity" }}
            />
            <motion.div 
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[500px] bg-accent/30 blur-[70px] rounded-full transition-all duration-700 ${isLoading ? 'opacity-100 scale-110 bg-accent/60' : 'opacity-70 scale-100'}`}
              style={{ transform: "translateZ(-30px)", willChange: "transform, opacity" }}
            />

            {/* Rotating Blurred Rings */}
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className={`absolute w-[440px] h-[440px] rounded-full border border-primary/30 border-t-primary border-l-transparent shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-60'}`}
              style={{ transform: "translateZ(-10px)", willChange: "transform" }}
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className={`absolute w-[400px] h-[400px] rounded-full border border-accent/30 border-b-accent border-r-transparent shadow-[0_0_20px_rgba(45,212,191,0.3)] transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-50'}`}
              style={{ transform: "translateZ(0px)", willChange: "transform" }}
            />

            {/* AI Processing Ping Overlay */}
            {isLoading && (
              <div className="absolute inset-4 rounded-3xl border border-primary/50 animate-ping" style={{ animationDuration: '2s', transform: 'translateZ(10px)' }} />
            )}

            {/* Glassmorphic Background Portal */}
            <div 
              className={`absolute inset-0 rounded-[2rem] glass backdrop-blur-xl transition-all duration-500 overflow-hidden ${isLoading ? 'border-primary/60 shadow-[0_0_60px_rgba(139,92,246,0.5)]' : 'border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)]'}`}
              style={{ transform: "translateZ(20px)" }}
            >
              {/* Portal Depth & Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-50" />
              <div className="absolute inset-0 bg-background/40" />
              
              {/* Internal Vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90 pointer-events-none" />
              <div className="absolute inset-0 border-[2px] border-primary/20 rounded-[2rem] shadow-[inset_0_0_50px_rgba(139,92,246,0.3)] pointer-events-none" />
            </div>

            {/* Neural lines / faint grid inside portal */}
            <div 
              className="absolute inset-0 rounded-[2rem] opacity-30 pointer-events-none"
              style={{ 
                backgroundImage: 'radial-gradient(circle at center, var(--primary) 1px, transparent 1px)', 
                backgroundSize: '20px 20px',
                transform: "translateZ(25px)" 
              }}
            />

            {/* Foreground Orbiting Particles (Lightweight) */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className={`absolute -top-6 left-1/2 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_15px_#06b6d4] transition-transform duration-300 ${isLoading ? 'scale-150 animate-pulse' : ''}`} />
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 pointer-events-none"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className={`absolute bottom-12 -right-4 w-3 h-3 bg-purple-500 rounded-full shadow-[0_0_20px_#a855f7] transition-transform duration-300 ${isLoading ? 'scale-150 animate-pulse' : ''}`} />
            </motion.div>

            {/* The 3D Avatar popping out */}
            {/* We position it absolutely and give it a larger area (-inset-24) to allow it to overflow */}
            <div 
              className={`absolute -inset-24 transition-all duration-700 pointer-events-none ${isLoading ? 'opacity-100 scale-105 drop-shadow-[0_0_30px_rgba(139,92,246,0.5)]' : 'opacity-100 drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]'}`}
              style={{ transform: "translateZ(80px)" }}
            >
              <HeroModel />
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative gradient orb for entire hero section */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[80px] rounded-full pointer-events-none z-0" style={{ willChange: "transform" }} />
    </section>
  );
}
