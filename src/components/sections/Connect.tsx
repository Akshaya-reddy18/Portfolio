"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Sparkles } from "lucide-react";

export function Connect() {
  const links = [
    {
      name: "GitHub",
      url: "https://github.com/Akshaya-reddy18",
      icon: <Github size={28} />,
      color: "hover:bg-[#2dba4e]/10 hover:border-[#2dba4e]/50 hover:text-[#2dba4e]",
      glow: "group-hover:shadow-[0_0_30px_rgba(45,186,78,0.2)]"
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/in/akshaya-kondamwar18",
      icon: <Linkedin size={28} />,
      color: "hover:bg-[#0a66c2]/10 hover:border-[#0a66c2]/50 hover:text-[#0a66c2]",
      glow: "group-hover:shadow-[0_0_30px_rgba(10,102,194,0.2)]"
    },
    {
      name: "Email",
      url: "mailto:kondamwarakshaya1810@gmail.com",
      icon: <Mail size={28} />,
      color: "hover:bg-[#ea4335]/10 hover:border-[#ea4335]/50 hover:text-[#ea4335]",
      glow: "group-hover:shadow-[0_0_30px_rgba(234,67,53,0.2)]"
    }
  ];

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto relative text-center" id="connect">
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="glass-card p-10 md:p-16 rounded-[2rem] border border-white/10 relative overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 opacity-30 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-primary/30 text-primary mb-6">
            <Sparkles size={16} />
            <span className="text-xs font-mono tracking-widest uppercase">Establish Neural Link</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">"Let's Connect"</h2>
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12">
            Looking to collaborate on cutting-edge AI systems or innovative full-stack platforms? Initiate a handshake below.
          </p>

          <div className="flex flex-wrap justify-center gap-6 w-full">
            {links.map((link, i) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
                className={`group relative flex flex-col items-center justify-center gap-4 w-[160px] h-[160px] rounded-3xl glass border border-white/10 text-muted-foreground transition-all duration-500 ${link.color} ${link.glow} overflow-hidden cursor-pointer`}
              >
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <div className="transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2">
                    {link.icon}
                  </div>
                  <span className="font-medium tracking-wide transition-transform duration-500 group-hover:translate-y-1">{link.name}</span>
                </div>
                
                {/* Ping effect on hover */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-current"></span>
                  </span>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
