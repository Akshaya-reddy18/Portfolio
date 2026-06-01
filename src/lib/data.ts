// @ts-ignore
import portfolioData from '../../backend/data/portfolio_data.json';

// We parse the JSON to build the personalData object dynamically.
export const personalData = {
  name: "Akshaya Kondamwar",
  title: "AI/ML Engineer & Full-Stack Developer",
  tagline: "This is not a portfolio. This is my AI-powered digital twin.",
  stats: [
    { label: "Systems Built", value: "12+" },
    { label: "Model Accuracy", value: "98.7%" },
    { label: "Latency Reduction", value: "30%" },
  ],
  skills: {
    core: [],
    ai: [],
    frontend: [],
    backend: [],
  },
  projects: [] as any[],
  nodes: [] as any[], // For MindMap
};

// Process JSON
let projectIndex = 0;
const categories = new Set<string>();
const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const skillNodeByLabel = new Map<string, string>();
const categoryNodeByLabel = new Map<string, string>();

portfolioData.forEach((item: any) => {
  if (item.type === "project") {
    personalData.projects.push({
      id: `project-${projectIndex++}`,
      title: item.title,
      role: item.category || "Engineer",
      category: item.category || "",
      description: item.description,
      problem: item.challenges || "Solve complex technical challenges.",
      approach: item.details || item.solutions || "",
      techStack: item.stack || item.tags || [],
      results: item.impact || "Delivered successfully.",
      challenges: item.challenges || "",
      nextSteps: item.solutions || "",
    });
    
    if (item.category) categories.add(item.category);
  } else if (item.type === "skill") {
    const detailsArray = item.details.split(",").map((s: string) => s.trim());
    if (item.name.toLowerCase().includes("programming") || item.name.toLowerCase().includes("core")) {
      personalData.skills.core.push(...detailsArray as never[]);
    } else if (item.name.toLowerCase().includes("machine") || item.name.toLowerCase().includes("data")) {
      personalData.skills.ai.push(...detailsArray as never[]);
    } else if (item.name.toLowerCase().includes("web")) {
      personalData.skills.frontend.push(...detailsArray as never[]);
      personalData.skills.backend.push(...detailsArray as never[]); // Simplify for now
    }
  }
});

// Generate MindMap Nodes with Polar Coordinates
const centerX = 50;
const centerY = 50;

personalData.nodes = [
  { id: "core", label: "Akshaya's Mind", x: centerX, y: centerY, size: 80, color: "bg-primary text-primary-foreground", connections: [] }
];

const categoryList = Array.from(categories);
if (categoryList.length === 0) categoryList.push("AI Systems", "Full Stack", "DevOps");

// Primary nodes (Categories) in a circle around the center
const radius1 = 25; // % distance from center
const primaryNodes: any[] = [];

categoryList.forEach((cat, index) => {
  const angle = (index / categoryList.length) * 2 * Math.PI;
  const x = centerX + radius1 * Math.cos(angle);
  const y = centerY + radius1 * Math.sin(angle);
  const id = `cat-${index}`;
  
  // Assign a color based on index
  const colors = [
    "bg-accent/20 border-accent text-accent",
    "bg-blue-500/20 border-blue-500 text-blue-400",
    "bg-orange-500/20 border-orange-500 text-orange-400",
    "bg-pink-500/20 border-pink-500 text-pink-400",
    "bg-emerald-500/20 border-emerald-500 text-emerald-400"
  ];
  
  const node = { id, label: cat, x, y, size: 60, color: colors[index % colors.length], connections: ["core"] };
  primaryNodes.push(node);
  categoryNodeByLabel.set(cat, id);
  personalData.nodes[0].connections.push(id); // Connect core to category
});

personalData.nodes.push(...primaryNodes);

// Sub nodes (Skills from projects) in a smaller orbit around categories
const allSkills = new Set<string>();
personalData.projects.forEach(p => p.techStack.forEach((t: string) => allSkills.add(t)));
const skillList = Array.from(allSkills).slice(0, 15); // Limit to 15 to avoid clutter

const radius2 = 15; // orbit around category

skillList.forEach((skill, index) => {
  // Find a parent category randomly for visual distribution
  const parentIndex = index % primaryNodes.length;
  const parent = primaryNodes[parentIndex];
  
  // Add some jitter to the angle to avoid overlapping
  const angle = (index / skillList.length) * 2 * Math.PI + (Math.random() * 0.5);
  const x = parent.x + radius2 * Math.cos(angle);
  const y = parent.y + radius2 * Math.sin(angle);
  
  const id = `skill-${index}`;
  
  // Connect to parent
  parent.connections.push(id);
  skillNodeByLabel.set(skill, id);
  
  personalData.nodes.push({
    id, label: skill, x, y, size: 40, color: "bg-white/5 border-white/20 text-muted-foreground", connections: [parent.id]
  });
});

const projectRadius = 38;
const projectItems = portfolioData.filter((item: any) => item.type === "project");

projectItems.forEach((item: any, index: number) => {
  const angle = (index / Math.max(projectItems.length, 1)) * 2 * Math.PI;
  const x = centerX + projectRadius * Math.cos(angle);
  const y = centerY + projectRadius * Math.sin(angle);
  const id = `project-${slugify(item.title)}`;

  const connections = new Set<string>();
  const categoryId = item.category ? categoryNodeByLabel.get(item.category) : undefined;
  if (categoryId) {
    connections.add(categoryId);
    const categoryNode = personalData.nodes.find(node => node.id === categoryId);
    categoryNode?.connections.push(id);
  }

  (item.stack || []).forEach((tech: string) => {
    const skillId = skillNodeByLabel.get(tech);
    if (skillId) {
      connections.add(skillId);
      const skillNode = personalData.nodes.find(node => node.id === skillId);
      skillNode?.connections.push(id);
    }
  });

  personalData.nodes.push({
    id,
    label: item.title,
    x,
    y,
    size: 52,
    color: "bg-accent/20 border-accent text-accent",
    connections: Array.from(connections),
  });
});
