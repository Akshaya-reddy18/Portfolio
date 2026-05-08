"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);

  const steps = [
    "INITIALIZING NEURAL NETWORKS...",
    "LOADING AKSHAYA'S EXPERIENCE DATA...",
    "CALIBRATING AI MODEL...",
    "ESTABLISHING CONNECTION...",
    "SYSTEM READY."
  ];

  useEffect(() => {
    let currentStep = 0;
    
    const textInterval = setInterval(() => {
      setText(steps[currentStep]);
      currentStep++;
      if (currentStep >= steps.length) {
        clearInterval(textInterval);
        setTimeout(() => onComplete(), 1000); // Wait a second on System Ready
      }
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 200);

    return () => {
      clearInterval(textInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background text-primary"
      >
        <div className="w-full max-w-md px-6 flex flex-col items-center gap-6">
          <motion.div 
            animate={{ 
              boxShadow: ["0px 0px 0px 0px rgba(139,92,246,0)", "0px 0px 30px 5px rgba(139,92,246,0.3)"],
            }}
            transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}
            className="w-24 h-24 rounded-full border border-primary/50 flex items-center justify-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full" />
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, ease: "linear", duration: 4 }}
              className="w-full h-full rounded-full border-t-2 border-r-2 border-primary border-t-transparent absolute"
            />
            <span className="text-secondary-foreground font-mono text-sm tracking-wider">
              {progress > 100 ? 100 : progress}%
            </span>
          </motion.div>

          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.3 }}
            />
          </div>

          <div className="h-6">
            <motion.p 
              key={text}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-xs font-mono tracking-widest text-muted-foreground text-center"
            >
              {text}
            </motion.p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
