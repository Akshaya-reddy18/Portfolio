"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { useState } from "react";
import { personalData } from "@/lib/data";

export function MindMap() {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const nodes = personalData.nodes;

  // Helper to draw lines
  const lines = [];
  for (const node of nodes) {
    for (const targetId of node.connections) {
      const target = nodes.find(n => n.id === targetId);
      if (target) {
        // Only draw one way to avoid duplicates
        if (node.id.localeCompare(target.id) < 0) {
          const isActive = activeNode === node.id || activeNode === target.id;
          lines.push(
            <svg key={`${node.id}-${target.id}`} className="absolute inset-0 w-full h-full pointer-events-none z-0">
              <motion.line 
                x1={`${node.x}%`} y1={`${node.y}%`} 
                x2={`${target.x}%`} y2={`${target.y}%`}
                stroke={isActive ? "var(--primary)" : "rgba(255,255,255,0.1)"}
                strokeWidth={isActive ? 2 : 1}
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
          );
        }
      }
    }
  }

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto relative hidden md:block">
      <div className="flex flex-col items-center gap-3 mb-16 text-center">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight">"Explore My Mind"</h2>
        <p className="text-muted-foreground max-w-xl mt-2 text-lg">
          An interactive map of my technical landscape. Hover over nodes to see their neural connections.
        </p>
      </div>

      <div className="relative w-full h-[600px] glass-card rounded-3xl border border-white/10 overflow-hidden">
        {lines}
        
        {nodes.map((node, i) => {
          const isConnected = activeNode ? (activeNode === node.id || node.connections.includes(activeNode) || nodes.find(n => n.id === activeNode)?.connections.includes(node.id)) : true;
          
          return (
            <motion.div
              key={node.id}
              className={`absolute rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 border backdrop-blur-sm z-10 ${node.color} ${!isConnected ? 'opacity-30 scale-90 blur-[2px]' : 'opacity-100'}`}
              style={{
                left: `calc(${node.x}% - ${node.size/2}px)`,
                top: `calc(${node.y}% - ${node.size/2}px)`,
                width: `${node.size}px`,
                height: `${node.size}px`,
                boxShadow: isConnected && activeNode ? '0 0 20px rgba(139,92,246,0.4)' : 'none'
              }}
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: isConnected ? 1 : 0.3 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 100 }}
              animate={activeNode === node.id ? {
                y: [0, -10, 0],
                transition: { repeat: Infinity, duration: 2 }
              } : {}}
            >
              <span className="text-xs font-medium font-mono text-center tracking-tighter leading-tight drop-shadow-md">
                {node.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
