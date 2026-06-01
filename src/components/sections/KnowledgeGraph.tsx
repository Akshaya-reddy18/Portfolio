"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Search, Database, LayoutTemplate, Cpu, Server, ExternalLink } from "lucide-react";
import { personalData } from "@/lib/data";

interface GraphNode {
  id: string;
  label: string;
  category: "domain" | "skill" | "project";
  icon?: any;
  x: number;
  y: number;
  description: string;
  related: string[];
}

const baseNodes: GraphNode[] = [
  { id: "ai", label: "AI/ML", category: "domain", icon: Cpu, x: 50, y: 25, description: "Deep Learning, LLMs, RAG, Computer Vision", related: ["rag", "python"] },
  { id: "backend", label: "Backend", category: "domain", icon: Server, x: 20, y: 50, description: "FastAPI, Node.js, Microservices, Scalability", related: ["python", "db", "docker"] },
  { id: "frontend", label: "Frontend", category: "domain", icon: LayoutTemplate, x: 80, y: 50, description: "React, Next.js, Framer Motion, Tailwind", related: ["react"] },
  
  { id: "python", label: "Python", category: "skill", icon: Network, x: 35, y: 35, description: "Data engineering, API development, AI scripting", related: ["ai", "backend"] },
  { id: "db", label: "Databases", category: "domain", icon: Database, x: 20, y: 80, description: "PostgreSQL, MongoDB, ChromaDB, Redis", related: ["backend"] },
  { id: "react", label: "React & Next.js", category: "skill", icon: Network, x: 80, y: 80, description: "Building complex UIs with hooks and suspense", related: ["frontend"] },
  { id: "rag", label: "LangChain/RAG", category: "skill", icon: Network, x: 50, y: 80, description: "Advanced vector retrieval and agent logic", related: ["ai"] },
  { id: "docker", label: "Docker & CI/CD", category: "skill", icon: Network, x: 15, y: 20, description: "Containerization and automated deployment pipelines", related: ["backend", "devops"] },
];

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const keywordConnections: Array<[RegExp, string[]]> = [
  [/\bpower\s?bi\b/i, ["db"]],
  [/\bsql\b/i, ["db", "backend"]],
  [/\bdax\b/i, ["db"]],
  [/\bpower\s?query\b/i, ["db"]],
  [/\breact\b/i, ["frontend", "react"]],
  [/\bnext\b/i, ["frontend", "react"]],
  [/\bfastapi\b/i, ["backend"]],
  [/\bnode\.?js\b/i, ["backend"]],
  [/\bpython\b/i, ["python", "backend"]],
  [/\blangchain\b/i, ["ai", "rag"]],
  [/\bchroma\b/i, ["ai", "db"]],
  [/\btorch\b/i, ["ai"]],
  [/\bscikit\b/i, ["ai"]],
  [/\bfirebase\b/i, ["backend", "db"]],
  [/\bsupabase\b/i, ["backend", "db"]],
  [/\bdocker\b/i, ["docker"]],
  [/\bgit(hub)? actions\b/i, ["docker"]],
];

const projectCategoryConnections: Record<string, string[]> = {
  "AI Systems": ["ai", "rag", "backend"],
  "AI + Healthcare": ["ai", "python", "backend", "db"],
  "Full Stack": ["frontend", "backend", "react"],
  DevOps: ["backend", "docker"],
  "Data Analytics": ["db", "backend", "python"],
};

const projectItems = personalData.projects;

const projectNodes: GraphNode[] = projectItems.map((project, index) => {
  const angle = (index / Math.max(projectItems.length, 1)) * 2 * Math.PI;
  const radius = 34;
  const x = 50 + radius * Math.cos(angle);
  const y = 55 + radius * Math.sin(angle);
  const projectId = `project-${slugify(project.title)}`;
  const related = new Set<string>();

  (projectCategoryConnections[project.category || ""] || []).forEach((id) => related.add(id));

  project.techStack.forEach((tech: string) => {
    keywordConnections.forEach(([pattern, ids]) => {
      if (pattern.test(tech)) {
        ids.forEach((id) => related.add(id));
      }
    });
  });

  const descriptionBits = [project.description, project.results, project.approach].filter(Boolean);

  return {
    id: projectId,
    label: project.title,
    category: "project",
    icon: Network,
    x,
    y,
    description: descriptionBits.join(" "),
    related: Array.from(related),
  };
});

const nodes: GraphNode[] = [...baseNodes, ...projectNodes];

const nodeById = new Map(nodes.map((node) => [node.id, node]));

projectNodes.forEach((projectNode) => {
  projectNode.related.forEach((targetId) => {
    const targetNode = nodeById.get(targetId);
    if (targetNode && !targetNode.related.includes(projectNode.id)) {
      targetNode.related.push(projectNode.id);
    }
  });
});

const edges = (() => {
  const edgeSet = new Set<string>();
  const result: Array<[string, string]> = [];

  nodes.forEach((node) => {
    node.related.forEach((targetId) => {
      if (!nodeById.has(targetId)) return;
      const key = [node.id, targetId].sort().join("|");
      if (edgeSet.has(key)) return;
      edgeSet.add(key);
      result.push([node.id, targetId]);
    });
  });

  return result;
})();

export function KnowledgeGraph() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const filteredNodes = nodes.filter(n => 
    n.label.toLowerCase().includes(searchTerm.toLowerCase()) || 
    n.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isHighlighted = (nodeId: string) => {
    if (!activeNode) return false;
    if (nodeId === activeNode) return true;
    const node = nodes.find(n => n.id === activeNode);
    return node?.related.includes(nodeId) || false;
  };

  const isEdgeHighlighted = (source: string, target: string) => {
    if (!activeNode) return false;
    if (source === activeNode || target === activeNode) return true;
    return false;
  };

  return (
    <section className="py-16 px-6 max-w-6xl mx-auto relative" id="knowledge-graph">
      <div className="flex flex-col items-center gap-3 mb-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-accent/30 text-accent mb-4">
          <Network size={18} />
          <span className="text-xs font-mono uppercase tracking-widest">Knowledge Database</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">"Search My Knowledge Graph"</h2>
        <p className="text-muted-foreground max-w-2xl mt-4">
          Explore my skills and projects interconnected like neural pathways.
        </p>
      </div>

      <div className="flex justify-center mb-8 relative z-20">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search AI, React, RAG..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background/50 border border-white/10 rounded-full pl-12 pr-6 py-3 focus:outline-none focus:border-primary/50 text-sm transition-colors glass"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative min-h-[600px]">
        
        {/* Graph Area */}
        <div className="lg:col-span-2 glass-card rounded-2xl border border-primary/20 overflow-hidden relative shadow-[0_0_30px_-10px_rgba(139,92,246,0.3)] min-h-[500px]">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {edges.map(([source, target], i) => {
              const sNode = nodes.find(n => n.id === source);
              const tNode = nodes.find(n => n.id === target);
              if (!sNode || !tNode) return null;
              
              const active = isEdgeHighlighted(source, target);
              const opacity = activeNode ? (active ? 0.9 : 0.25) : 0.6;
              const strokeWidth = active ? 2 : 1;

              return (
                <motion.line
                  key={i}
                  x1={`${sNode.x}%`}
                  y1={`${sNode.y}%`}
                  x2={`${tNode.x}%`}
                  y2={`${tNode.y}%`}
                  stroke={active ? "var(--primary)" : "rgba(255,255,255,0.4)"}
                  strokeWidth={strokeWidth}
                  opacity={opacity}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.1 }}
                />
              );
            })}
          </svg>

          {nodes.map((node) => {
            const active = activeNode ? isHighlighted(node.id) : filteredNodes.includes(node);
            const opacity = active ? 1 : 0.4;
            const Icon = node.icon;
            
            return (
              <motion.div
                key={node.id}
                className={`absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2 cursor-pointer z-10`}
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                initial={{ scale: 0 }}
                animate={{ scale: active ? (node.id === activeNode ? 1.2 : 1) : 0.8, opacity }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onClick={() => setActiveNode(node.id === activeNode ? null : node.id)}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors shadow-lg
                  ${node.category === 'domain' ? 'bg-primary/20 border-primary text-primary hover:bg-primary hover:text-white' : 
                    node.category === 'project' ? 'bg-accent/20 border-accent text-accent hover:bg-accent hover:text-white' : 
                    'bg-white/5 border-white/20 text-muted-foreground hover:bg-white/20 hover:text-white'}
                  ${node.id === activeNode ? 'shadow-[0_0_20px_var(--primary)] text-white bg-primary' : ''}
                `}>
                  {Icon && <Icon size={20} />}
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-md glass backdrop-blur-md transition-colors ${node.id === activeNode ? 'text-primary-foreground bg-primary' : 'text-foreground'}`}>
                  {node.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <AnimatePresence mode="popLayout">
            {activeNode ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass-card p-6 rounded-2xl border border-primary/30 h-full flex flex-col"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Database size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{nodes.find(n => n.id === activeNode)?.label}</h3>
                    <p className="text-xs text-muted-foreground uppercase tracking-widest">{nodes.find(n => n.id === activeNode)?.category}</p>
                  </div>
                </div>
                
                <p className="text-foreground text-sm leading-relaxed mb-6">
                  {nodes.find(n => n.id === activeNode)?.description}
                </p>

                <div className="mt-auto pt-6 border-t border-white/10">
                  <h4 className="text-sm font-medium mb-3">Related Nodes</h4>
                  <div className="flex flex-wrap gap-2">
                    {nodes.find(n => n.id === activeNode)?.related.map(rid => (
                      <span key={rid} className="px-3 py-1 text-xs rounded-full glass border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/30 cursor-pointer transition-colors" onClick={() => setActiveNode(rid)}>
                        {nodes.find(n => n.id === rid)?.label}
                      </span>
                    ))}
                  </div>
                </div>

                {nodes.find(n => n.id === activeNode)?.category === 'project' && (
                  <button 
                    onClick={() => {
                      const projectTitle = nodes.find(n => n.id === activeNode)?.label;
                      if (projectTitle) {
                        window.dispatchEvent(new CustomEvent('open-project', { detail: projectTitle }));
                      }
                      document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="mt-6 w-full py-2 rounded-md bg-accent text-accent-foreground font-medium flex items-center justify-center gap-2 hover:bg-accent/90 transition-colors"
                  >
                    <ExternalLink size={16} /> View Details
                  </button>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-card p-6 rounded-2xl border border-white/5 h-full flex flex-col items-center justify-center text-center text-muted-foreground"
              >
                <Network size={48} className="mb-4 opacity-50" />
                <p>Click on any node in the graph to view deeper insights and connections.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
