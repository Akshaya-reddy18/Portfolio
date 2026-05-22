import { useState, useCallback } from 'react';

export type Role = 'user' | 'ai';
export type Mode = 'Engineer' | 'Recruiter' | 'Beginner';

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  sources?: string[];
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<Mode>('Engineer');
  const [followUps, setFollowUps] = useState<string[]>([]);
  const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://127.0.0.1:8000";

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setFollowUps([]);

    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, { id: aiMsgId, role: 'ai', content: '' }]);

    try {
      // Connect to FastAPI backend
      const response = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, mode: mode.toLowerCase() }),
      });

      if (!response.ok) {
        let errorMsg = response.statusText;
        try {
          const errData = await response.json();
          errorMsg = errData.detail || errData.error || errData.message || errorMsg;
        } catch (e) {
          // Fallback if not JSON
        }
        throw new Error(`Backend Error ${response.status}: ${errorMsg}`);
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        
        // Process SSE lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '').trim();
            if (dataStr === '[DONE]') {
              setIsLoading(false);
              return;
            }

            try {
              const data = JSON.parse(dataStr);
              if (data.type === 'meta') {
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMsgId ? { ...msg, sources: data.sources } : msg
                ));
              } else if (data.type === 'chunk') {
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMsgId ? { ...msg, content: msg.content + data.content } : msg
                ));
              } else if (data.type === 'followup') {
                setFollowUps(data.suggestions);
              } else if (data.type === 'error') {
                setMessages(prev => prev.map(msg => 
                  msg.id === aiMsgId ? { ...msg, content: msg.content + "\n\n[System Error: " + data.content + "]" } : msg
                ));
              }
            } catch (e) {
              console.error("Error parsing SSE data", e, dataStr);
            }
          }
        }
      }
    } catch (error: any) {
      console.error('Chat error:', error);
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId ? { ...msg, content: `Error: ${error.message || 'Connection to backend failed.'}` } : msg
      ));
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, mode]);

  return {
    messages,
    input,
    setInput,
    isLoading,
    mode,
    setMode,
    followUps,
    sendMessage
  };
}
