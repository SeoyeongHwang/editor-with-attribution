import { useState, useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import './RightPanel.css';

interface RightPanelProps {
  onClose: () => void;
}

export const INSERT_AI_TEXT_EVENT = 'insert-ai-text-event';

interface HistoryItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const RightPanel = ({ onClose }: RightPanelProps) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Auto-scroll to bottom when history changes
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, isGenerating]);

  const handleRequest = () => {
    if (!prompt.trim()) return;
    
    const userMessage: HistoryItem = { id: Date.now().toString(), role: 'user', content: prompt };
    setHistory(prev => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);

    // Mock LLM generation latency
    setTimeout(() => {
      const gText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec bibendum eget est quis volutpat. Nulla facilisi. Phasellus pellentesque eros est, vel placerat tellus sollicitudin congue.";
      const assistantMessage: HistoryItem = { id: (Date.now()+1).toString(), role: 'assistant', content: gText };
      setHistory(prev => [...prev, assistantMessage]);
      setIsGenerating(false);
    }, 1500);
  };

  const handleInsert = (text: string) => {
    if (!text) return;
    // Dispatch custom event to be picked up by the Editor
    const event = new CustomEvent(INSERT_AI_TEXT_EVENT, {
      detail: { text }
    });
    document.dispatchEvent(event);
  };

  return (
    <div className="right-panel-container">
      <div className="panel-header">
        <span>Writing Assistant</span>
        <button onClick={onClose} className="close-btn"><X size={18} /></button>
      </div>

      <div className="panel-content history-content" ref={scrollRef}>
        {history.length === 0 && !isGenerating && (
          <div className="empty-state">
            Ask me to generate text, rewrite paragraphs, or brainstorm ideas.
          </div>
        )}
        
        {history.map((item) => (
          <div key={item.id} className={`history-item ${item.role}`}>
            <div className="message-bubble">
              <p>{item.content}</p>
            </div>
            {item.role === 'assistant' && (
              <button className="insert-btn" onClick={() => handleInsert(item.content)}>
                Insert into Document
              </button>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="loading-state">
             Generating...
          </div>
        )}
      </div>

      <div className="prompt-area">
        <textarea 
          placeholder="What would you like me to write?"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          disabled={isGenerating}
        />
        <button className="request-btn" onClick={handleRequest} disabled={isGenerating || !prompt.trim()}>
          Request ↑
        </button>
      </div>
    </div>
  );
};

export default RightPanel;
