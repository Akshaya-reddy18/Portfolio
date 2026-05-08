"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { Hero } from "@/components/sections/Hero";
import { AiChat } from "@/components/sections/AiChat";
import { KnowledgeGraph } from "@/components/sections/KnowledgeGraph";
import { ProjectStories } from "@/components/sections/ProjectStories";
import { FuturePrediction } from "@/components/sections/FuturePrediction";
import { LearningFeed } from "@/components/sections/LearningFeed";
import { MindMap } from "@/components/sections/MindMap";
import { Connect } from "@/components/sections/Connect";
import { BackgroundSystem } from "@/components/ui/BackgroundSystem";
import { Header } from "@/components/ui/Header";
import { motion } from "framer-motion";

export default function Home() {
  const [loadingComplete, setLoadingComplete] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      {!loadingComplete && (
        <LoadingScreen onComplete={() => setLoadingComplete(true)} />
      )}

      {loadingComplete && (
        <>
          <BackgroundSystem />
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <Header />
          <Hero />
          <AiChat />
          <KnowledgeGraph />
          <ProjectStories />
          <FuturePrediction />
          <LearningFeed />
          <MindMap />
          <Connect />
          
          {/* Footer */}
          <footer className="py-8 text-center text-sm text-muted-foreground font-mono">
            <p>System developed by Akshaya Kondamwar. © 2026</p>
          </footer>
        </motion.div>
        </>
      )}
    </main>
  );
}
