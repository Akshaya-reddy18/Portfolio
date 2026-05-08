export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const query = message.toLowerCase();

    // Simulated delay for thinking effect
    await new Promise((resolve) => setTimeout(resolve, 1500));

    let responseText = "I process data, build full-stack systems, and optimize algorithms. What specific aspect of my work are you interested in?";

    if (query.includes("experience") || query.includes("intern") || query.includes("work")) {
      responseText = "I worked as an AI/ML Intern where I built an XGBoost airfare prediction model (98.76% R2) and a CNN for deepfake detection (84.67% accuracy). I also have a full-stack internship experience using React and Node.js, where I successfully reduced API latency by 30%.";
    } else if (query.includes("researchpilot") || query.includes("rag")) {
      responseText = "ResearchPilot AI is my RAG system built using LLaMA, LangChain, and ChromaDB. It increased paper summarization accuracy by 35% over standard methods.";
    } else if (query.includes("pulseconnect") || query.includes("blood")) {
      responseText = "PulseConnect is a multi-agent blood demand forecasting system I developed using Firebase for real-time tracking. It improved emergency response efficiency by 40%.";
    } else if (query.includes("startupconnect") || query.includes("job") || query.includes("match")) {
      responseText = "StartupConnect is a platform I built that uses AI for semantic skill matching, which improved match rates by 25% compared to simple keyword mapping.";
    } else if (query.includes("hi") || query.includes("hello") || query.includes("who")) {
      responseText = "Hello. I am Akshaya's Digital Twin. Ask me about his projects, AI expertise, or full-stack engineering skills.";
    } else if (query.includes("stack") || query.includes("skill") || query.includes("tech")) {
      responseText = "My core stack includes Python, TypeScript, React.js, Next.js, Node.js, PyTorch, LangChain, and Firebase. I'm proficient in both ML engineering and full-stack development.";
    }

    return Response.json({ response: responseText });
  } catch (error) {
    return Response.json(
      { error: "Neural interface offline." },
      { status: 500 }
    );
  }
}
