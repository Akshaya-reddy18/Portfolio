"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { personalData } from "@/lib/data";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const navItems = [
    { label: "AI Chat", id: "chat" },
    { label: "Knowledge Graph", id: "knowledge-graph" },
    { label: "Projects", id: "projects" },
    { label: "Connect", id: "connect" }
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut", delay: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4 bg-background/60 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.18)]" : "py-6 bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div 
          className="text-xl font-bold tracking-tighter cursor-pointer flex items-center gap-2"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Akshaya AI</span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono border border-primary/20 text-primary bg-primary/10">v3.0</span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative group"
            >
              {item.label}
              <span className="absolute -bottom-1.5 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full shadow-[0_0_10px_var(--accent)]" />
            </button>
          ))}
          <a 
            href="/Akshaya%20Resume%20%28Feb%202026%29.pdf"
            download="Akshaya Resume (Feb 2026).pdf"
            className="text-sm font-medium px-5 py-2 rounded-full border border-primary/30 text-primary hover:bg-primary/10 transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]"
          >
            Resume
          </a>
        </nav>

        {/* Mobile Nav Toggle */}
        <div className="md:hidden">
          <button className="text-muted-foreground hover:text-foreground p-2" aria-label="Open navigation menu" title="Open navigation menu">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
