"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function BackgroundSystem() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#030014] pointer-events-none">
      {/* Cinematic Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay bg-[url('/noise.png')]" />

      {/* Massive Glowing Mesh Gradients */}
      <motion.div
        style={{ willChange: "transform, opacity" }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.15, 0.3, 0.15],
          x: [0, 50, 0],
          y: [0, -50, 0]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/20 blur-[80px]"
      />
      <motion.div
        style={{ willChange: "transform, opacity" }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.1, 0.25, 0.1],
          x: [0, -80, 0],
          y: [0, 80, 0]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute top-[30%] right-[0%] w-[60vw] h-[60vw] rounded-full bg-accent/15 blur-[80px]"
      />
      <motion.div
        style={{ willChange: "transform, opacity" }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1],
          x: [0, 40, 0],
          y: [0, 40, 0]
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "easeInOut", delay: 5 }}
        className="absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] rounded-full bg-[#ec4899]/10 blur-[80px]"
      />

      {/* Animated Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full ${i % 3 === 0 ? 'bg-primary shadow-[0_0_15px_var(--primary)]' : i % 2 === 0 ? 'bg-accent shadow-[0_0_15px_var(--accent)]' : 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]'}`}
          style={{ width: Math.random() * 3 + 1, height: Math.random() * 3 + 1 }}
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight + 500 : 1000),
            opacity: Math.random() * 0.6 + 0.1,
            scale: Math.random() * 2
          }}
          animate={{
            y: [null, Math.random() * -500 - 200],
            opacity: [null, 0]
          }}
          transition={{
            duration: Math.random() * 20 + 20,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
        />
      ))}

      {/* Intense SVG Neural Pathways / Cyber Flow */}
      <svg className="absolute inset-0 w-full h-full opacity-60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" style={{ willChange: "opacity" }}>
        <defs>
          <linearGradient id="neuralGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0" />
            <stop offset="20%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="1" />
            <stop offset="80%" stopColor="var(--primary)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neuralGrad2" x1="100%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="neuralGrad3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0" />
            <stop offset="50%" stopColor="#ec4899" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Primary Main Arteries */}
        <motion.path
          d="M -10vw 20vh C 20vw 80vh, 80vw 20vh, 110vw 80vh"
          stroke="url(#neuralGrad1)" strokeWidth="2.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
        <motion.path
          d="M 110vw 30vh C 70vw 10vh, 30vw 90vh, -10vw 50vh"
          stroke="url(#neuralGrad2)" strokeWidth="2" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear", delay: 3 }}
        />
        
        {/* Vertical/Diagonal Branching */}
        <motion.path
          d="M 20vw -10vh Q 40vw 50vh 30vw 110vh"
          stroke="url(#neuralGrad3)" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.9, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
        />
        <motion.path
          d="M 80vw -10vh C 90vw 40vh, 50vw 60vh, 70vw 110vh"
          stroke="url(#neuralGrad1)" strokeWidth="2" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.7, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: 6 }}
        />
        <motion.path
          d="M 50vw 110vh Q 20vw 50vh 60vw -10vh"
          stroke="url(#neuralGrad2)" strokeWidth="1.5" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "linear", delay: 4 }}
        />

        {/* Dense Secondary Network */}
        <motion.path
          d="M 0vw 60vh L 100vw 100vh"
          stroke="url(#neuralGrad3)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear", delay: 2 }}
        />
        <motion.path
          d="M 100vw 20vh L 0vw 80vh"
          stroke="url(#neuralGrad1)" strokeWidth="1" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "linear", delay: 5 }}
        />
        <motion.path
          d="M -10vw -10vh Q 50vw 50vh 110vw 110vh"
          stroke="url(#neuralGrad2)" strokeWidth="2" fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "linear", delay: 7 }}
        />
      </svg>
    </div>
  );
}
