"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, Mic, Volume2, VolumeX, PlayCircle, StopCircle } from "lucide-react";
import { useChat, ChatMessage } from "@/lib/hooks/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MessageBubble = React.memo(({ msg, isStreaming }: { msg: ChatMessage, isStreaming?: boolean }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleVoice = () => {
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(msg.content);
      // Optional: choose a voice
      const voices = window.speechSynthesis.getVoices();
      const femaleKeywords = ["female", "aria", "jenny", "zira", "samantha", "victoria", "karen", "moira"];
      const preferred = voices.find(v => femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))) || voices.find(v => v.name.includes("Google US English")) || voices[0];
      if (preferred) utterance.voice = preferred;
      
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (isPlaying) window.speechSynthesis.cancel();
    }
  }, [isPlaying]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 max-w-[85%] ${
        msg.role === "user" ? "ml-auto flex-row-reverse" : ""
      }`}
    >
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        msg.role === "user" ? "bg-accent/20 text-accent" : "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.5)]"
      }`}>
        {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
      </div>
      <div className="flex flex-col gap-2 relative min-w-0">
        <div className={`p-4 rounded-2xl text-sm leading-relaxed relative group ${
          msg.role === "user" 
            ? "bg-accent/10 border border-accent/20 text-foreground rounded-tr-sm" 
            : "bg-muted/50 border border-white/5 text-muted-foreground rounded-tl-sm glass"
        }`}>
          {msg.role === "ai" && !isStreaming && msg.content && (
            <button 
              onClick={toggleVoice}
              className="absolute -right-10 top-2 p-1.5 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Read aloud"
            >
              {isPlaying ? <StopCircle size={16} className="text-primary animate-pulse" /> : <PlayCircle size={16} />}
            </button>
          )}

          {msg.role === "user" ? (
            <div className="whitespace-pre-wrap">{msg.content}</div>
          ) : (
            <div className="space-y-3 relative">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  p: ({node, ...props}) => <p className="leading-relaxed" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="pl-1" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-semibold text-foreground" {...props} />,
                  pre: ({node, ...props}) => <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto text-xs border border-white/10 mt-2 mb-2" {...props} />,
                  code: ({node, inline, className, children, ...props}: any) => {
                    const match = /language-(\w+)/.exec(className || '')
                    return inline ? (
                      <code className="bg-black/30 px-1.5 py-0.5 rounded text-xs text-primary/90" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  }
                }}
              >
                {msg.content}
              </ReactMarkdown>
              {isStreaming && (
                <span className="inline-block w-1.5 h-4 ml-1 align-middle bg-primary/80 animate-pulse" />
              )}
            </div>
          )}
        </div>
        {msg.sources && msg.sources.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {msg.sources.map(src => (
              <span key={src} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                📄 {src}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
});
MessageBubble.displayName = "MessageBubble";

export function AiChat() {
  const { messages, input, setInput, isLoading, mode, setMode, followUps, sendMessage } = useChat();
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Web Speech API for Mic
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-US';
        
        let finalTranscript = '';

        rec.onresult = (event: any) => {
          let interimTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          setInput(finalTranscript + interimTranscript);
        };
        
        rec.onerror = () => setIsListening(false);
        rec.onend = () => setIsListening(false);
        
        setRecognition(rec);
      }
    }
  }, [setInput]);

  // Smart Auto-Scroll logic
  const scrollToBottom = useCallback((force = false) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    
    // Auto-scroll if forced or if we're near the bottom (within 100px)
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 100;
    
    if (force || isNearBottom) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: force ? 'auto' : 'smooth'
      });
    }
  }, []);

  // When a new message comes in, or length changes, we might want to scroll
  useEffect(() => {
    scrollToBottom();
  }, [messages.length, scrollToBottom]);

  // When content of the last message updates during streaming, trigger scroll check
  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [messages, isLoading, scrollToBottom]);

  // Voice output for the *entire* conversation mode (if isVoiceEnabled is true globally)
  useEffect(() => {
    if (isVoiceEnabled && messages.length > 0 && !isLoading) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.role === 'ai' && lastMsg.content) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(lastMsg.content);
        
        const voices = window.speechSynthesis.getVoices();
        const femaleKeywords = ["female", "aria", "jenny", "zira", "samantha", "victoria", "karen", "moira"];
        const preferred = voices.find(v => femaleKeywords.some(keyword => v.name.toLowerCase().includes(keyword))) || voices.find(v => v.name.includes("Google US English")) || voices[0];
        if (preferred) utterance.voice = preferred;

        window.speechSynthesis.speak(utterance);
      }
    }
  }, [messages, isLoading, isVoiceEnabled]);

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      setInput("");
      recognition?.start();
      setIsListening(true);
    }
  };

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      sendMessage(input);
      scrollToBottom(true);
    }
  };

  return (
    <section className="py-16 px-6 max-w-5xl mx-auto relative" id="chat">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 rounded-full flex items-center justify-center bg-primary/10 border border-primary/20">
            <Sparkles className="text-primary z-10" size={20} />
            <div className={`absolute inset-0 rounded-full border-2 border-primary/50 transition-all duration-700 ${isLoading ? 'animate-ping' : ''}`} />
            {isLoading && <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />}
          </div>
          <div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Akshaya AI</h2>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="glass flex items-center p-1 rounded-full border border-white/10">
            {['Engineer', 'Recruiter', 'Beginner'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${mode === m ? 'bg-primary text-primary-foreground shadow-[0_0_10px_rgba(139,92,246,0.5)]' : 'text-muted-foreground hover:text-foreground'}`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass-card rounded-2xl border border-primary/20 overflow-hidden flex flex-col h-[600px] shadow-[0_0_40px_-15px_rgba(139,92,246,0.2)] relative z-10">
        
        {/* Chat window */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 scroll-smooth">
          {messages.length === 0 && (
            <div className="mx-auto my-auto text-center flex flex-col items-center opacity-80 max-w-md">
              <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 relative shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <Bot size={40} className="text-primary" />
                <div className="absolute inset-0 rounded-full border border-primary/50 animate-[spin_4s_linear_infinite] border-t-transparent" />
                <div className="absolute inset-0 rounded-full border border-primary/30 animate-[spin_3s_linear_infinite_reverse] border-b-transparent" />
              </div>
              <h3 className="text-2xl text-foreground font-medium mb-2">Hello, I'm Akshaya's Digital Twin.</h3>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed">
                I'm powered by a custom RAG backend using FastAPI and LLMs. I have context on all of Akshaya's projects, skills, and experience. What would you like to know?
              </p>
              <div className="flex flex-col gap-2 w-full">
                {["Walk me through your multi-agent architecture.", "What impact did PulseConnect have?", "What makes you stand out to a recruiter?"].map(prompt => (
                  <button 
                    key={prompt} 
                    onClick={() => { setInput(prompt); setTimeout(() => handleSend({preventDefault: () => {}} as any), 50); }}
                    className="text-sm px-4 py-3 rounded-xl glass border border-white/5 hover:border-primary/50 hover:bg-primary/10 transition-all text-left flex items-center justify-between group"
                  >
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">{prompt}</span>
                    <Send size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <MessageBubble 
              key={msg.id} 
              msg={msg} 
              isStreaming={isLoading && index === messages.length - 1 && msg.role === 'ai'} 
            />
          ))}
          
          {isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-muted/50 border border-white/5 text-muted-foreground glass rounded-tl-sm flex gap-2 items-center h-[52px]">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1s_infinite_0ms]" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1s_infinite_200ms]" />
                  <div className="w-2 h-2 rounded-full bg-primary/60 animate-[bounce_1s_infinite_400ms]" />
                </div>
                <span className="text-xs ml-2 opacity-50">Thinking...</span>
              </div>
            </motion.div>
          )}

          {!isLoading && followUps.length > 0 && messages[messages.length-1]?.role === 'ai' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="ml-11 flex flex-wrap gap-2 mt-2 pb-4"
            >
              {followUps.map((fu, idx) => (
                <button
                  key={idx}
                  onClick={() => { setInput(fu); setTimeout(() => handleSend({preventDefault: () => {}} as any), 50); }}
                  className="text-xs px-3 py-1.5 rounded-full glass border border-primary/20 text-primary hover:bg-primary/20 hover:border-primary/50 transition-all hover:-translate-y-0.5 shadow-sm"
                >
                  ✨ {fu}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-background/80 border-t border-white/5 backdrop-blur-xl relative">
          <form onSubmit={handleSend} className="flex gap-2 relative max-w-4xl mx-auto">
            <button
              type="button"
              onClick={toggleListen}
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors z-10 ${
                isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-muted-foreground hover:text-foreground hover:bg-white/5'
              }`}
              title="Voice Input"
            >
              <Mic size={16} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening... (Speak now)" : "Ask Akshaya's Digital Twin..."}
              className="flex-1 bg-muted/30 border border-white/10 rounded-full pl-12 pr-14 py-3.5 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 text-sm transition-all shadow-inner"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-primary rounded-full flex items-center justify-center text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_15px_rgba(139,92,246,0.3)] hover:scale-105 z-10"
            >
              <Send size={16} className={input.trim() && !isLoading ? "translate-x-[1px] -translate-y-[1px]" : ""} />
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            AI can make mistakes. Check important information.
          </div>
        </div>
      </div>
      
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
    </section>
  );
}
