"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { personalData } from "@/lib/data";
import { ChevronRight, Activity, Code, Target, AlertCircle, ExternalLink, Github, BarChart3, Clock, Zap, Bot, X } from "lucide-react";
import { CardSpotlight } from "@/components/ui/card-spotlight";

export function ProjectStories() {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);

  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedProject]);

  useEffect(() => {
    const handleOpenProject = (e: Event) => {
      const customEvent = e as CustomEvent;
      const title = customEvent.detail;
      const project = personalData.projects.find(p => p.title === title || p.title.includes(title));
      if (project) {
        setSelectedProject(project);
      }
    };

    window.addEventListener('open-project', handleOpenProject);
    return () => window.removeEventListener('open-project', handleOpenProject);
  }, []);

  // We duplicate the projects array to create a seamless infinite marquee loop
  const marqueeProjects = [...personalData.projects, ...personalData.projects, ...personalData.projects];

  return (
    <section className="py-16 px-6 w-full mx-auto relative overflow-hidden" id="projects">
      <div className="mb-12 max-w-5xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">"Interactive Project Logs"</h2>
        <p className="text-muted-foreground text-lg">
          Explore the architecture, metrics, and technical deep-dives of my key engineering missions.
        </p>
      </div>

      {/* Infinite Horizontal Marquee */}
      <div className="relative w-full max-w-[100vw] overflow-x-hidden flex items-center py-10 group">
        <div className="flex gap-6 animate-marquee w-max">
          {marqueeProjects.map((project, idx) => (
            <div 
              key={`${project.id}-${idx}`}
              className="w-[350px] md:w-[450px] shrink-0"
              onClick={() => setSelectedProject(project)}
            >
              <CardSpotlight className="p-6 md:p-8 cursor-pointer h-[280px] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300">
                <div className="relative z-20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded font-mono text-xs tracking-wider border border-primary/20">LOG.{String(idx % personalData.projects.length + 1).padStart(2, '0')}</span>
                    <span className="bg-primary/5 border border-primary/10 px-3 py-1 rounded-full text-primary font-medium text-[10px] whitespace-nowrap ml-auto">{project.role}</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3 line-clamp-1">{project.title}</h3>
                  <p className="text-muted-foreground text-sm line-clamp-3">{project.description}</p>
                </div>
                
                <div className="relative z-20 flex items-center justify-between mt-auto pt-6 border-t border-white/5">
                  <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted-foreground/80">
                    <span className="flex items-center gap-1"><Zap size={12} className="text-accent"/> Impact</span>
                    <span className="flex items-center gap-1"><Code size={12} className="text-primary"/> Tech</span>
                  </div>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white/5 text-muted-foreground group-hover/spotlight:bg-primary group-hover/spotlight:text-primary-foreground transition-colors shadow-sm">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </CardSpotlight>
            </div>
          ))}
        </div>
      </div>

      {/* Expanded Project Modal Overlay */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedProject(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl border border-primary/30 shadow-[0_0_50px_-15px_rgba(139,92,246,0.4)] z-50 flex flex-col"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-background/80 backdrop-blur-xl border-b border-white/10 p-6 flex items-start justify-between z-30">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-primary bg-primary/10 px-2 py-0.5 rounded font-mono text-xs tracking-wider border border-primary/20">{selectedProject.role}</span>
                  </div>
                  <h3 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">{selectedProject.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 md:p-8 space-y-8">
                <p className="text-muted-foreground text-lg leading-relaxed">{selectedProject.description}</p>
                
                {/* Metrics Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="glass p-4 rounded-xl border border-white/5 flex flex-col gap-1 items-center justify-center text-center bg-black/40">
                    <Activity size={20} className="text-accent mb-1"/>
                    <span className="text-2xl font-bold text-foreground">98%</span>
                    <span className="text-xs text-muted-foreground uppercase">Accuracy</span>
                  </div>
                  <div className="glass p-4 rounded-xl border border-white/5 flex flex-col gap-1 items-center justify-center text-center bg-black/40">
                    <Clock size={20} className="text-primary mb-1"/>
                    <span className="text-2xl font-bold text-foreground">-40%</span>
                    <span className="text-xs text-muted-foreground uppercase">Latency</span>
                  </div>
                  <div className="glass p-4 rounded-xl border border-white/5 flex flex-col gap-1 items-center justify-center text-center bg-black/40">
                    <BarChart3 size={20} className="text-blue-400 mb-1"/>
                    <span className="text-2xl font-bold text-foreground">10k+</span>
                    <span className="text-xs text-muted-foreground uppercase">Requests</span>
                  </div>
                  <div className="glass p-4 rounded-xl border border-white/5 flex flex-col gap-1 items-center justify-center text-center bg-black/40">
                    <Code size={20} className="text-emerald-400 mb-1"/>
                    <span className="text-2xl font-bold text-foreground">A+</span>
                    <span className="text-xs text-muted-foreground uppercase">Code Quality</span>
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {selectedProject.techStack.map((tech: string, i: number) => (
                    <span 
                      key={tech} 
                      className="text-xs border border-white/10 bg-black/50 px-3 py-1.5 rounded-full text-foreground cursor-default"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-8">
                    <div>
                      <h4 className="flex items-center gap-2 text-foreground/90 font-semibold mb-3">
                        <AlertCircle size={18} className="text-red-400" /> Problem Statement
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-red-400/30 pl-4">
                        {selectedProject.problem}
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-foreground/90 font-semibold mb-3">
                        <Code size={18} className="text-primary" /> Approach & Architecture
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/30 pl-4">
                        {selectedProject.approach}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-8 flex flex-col h-full">
                    <div>
                      <h4 className="flex items-center gap-2 text-foreground/90 font-semibold mb-3">
                        <Activity size={18} className="text-accent" /> Results & Impact
                      </h4>
                      <p className="text-foreground text-sm leading-relaxed font-mono bg-accent/5 border border-accent/20 p-4 rounded-xl">
                        {selectedProject.results}
                      </p>
                    </div>
                    <div>
                      <h4 className="flex items-center gap-2 text-foreground/90 font-semibold mb-3">
                        <Target size={18} className="text-blue-400" /> Key Insights
                      </h4>
                      <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-blue-400/30 pl-4">
                        {selectedProject.challenges} <br className="my-2"/> {selectedProject.nextSteps}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-background/90 backdrop-blur-xl border-t border-white/10 p-6 flex flex-wrap gap-3 z-30">
                <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-foreground py-3 rounded-lg border border-white/10 transition-all text-sm font-medium">
                  <Github size={16} /> View Source
                </button>
                <button className="flex-1 min-w-[120px] flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-3 rounded-lg border border-primary/30 transition-all text-sm font-medium">
                  <ExternalLink size={16} /> Live Demo
                </button>
                <button 
                  onClick={() => {
                    setSelectedProject(null);
                    setTimeout(() => {
                      const chatSection = document.getElementById("chat");
                      if (chatSection) {
                        chatSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }, 300); // Wait for modal to close
                  }}
                  className="flex-[2] min-w-[200px] flex items-center justify-center gap-2 bg-accent/20 hover:bg-accent/30 text-accent py-3 rounded-lg border border-accent/30 transition-all text-sm font-medium shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                >
                  <Bot size={16} /> Ask AI Mind About This
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
