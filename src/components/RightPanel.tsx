import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, SendHorizontal } from 'lucide-react';

import './RightPanel.css';

export const INSERT_AI_TEXT_EVENT = 'insert-ai-text-event';

interface HistoryItem {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  draftContent?: string;
  variant?: 'plain' | 'draft';
}

type GenerateResponse = {
  response?: string;
  answer?: string;
  draft?: string;
  draftContent?: string;
  insertableText?: string;
  type?: string;
  variant?: string;
};

const EMPTY_PROMPTS = [
  {
    label: 'Opening line',
    prompt: 'Write a strong opening sentence for this entry.',
  },
  {
    label: 'Essay seed',
    prompt: 'Give me a short essay seed about happiness.',
  },
  {
    label: 'Refine',
    prompt: 'Help me rewrite the selected idea in a clearer voice.',
  },
];

const DRAFT_REQUEST_PATTERNS = [
  /write/i,
  /draft/i,
  /compose/i,
  /generate/i,
  /rewrite/i,
  /paragraph/i,
  /sentence/i,
  /essay/i,
  /글감/,
  /작성/,
  /써줘/,
  /써 줘/,
  /문장/,
  /문단/,
  /에세이/,
  /초안/,
  /고쳐/,
  /다듬/,
];

const isDraftRequest = (text: string) => (
  DRAFT_REQUEST_PATTERNS.some(pattern => pattern.test(text))
);

const getResponseText = (data: GenerateResponse) => (
  data.response || data.answer || data.draft || data.draftContent || data.insertableText || 'No response generated.'
);

const buildAssistantMessage = (data: GenerateResponse, request: string): HistoryItem => {
  const responseText = getResponseText(data).trim();
  const explicitDraft = (data.draft || data.draftContent || data.insertableText || '').trim();
  const responseType = `${data.type || data.variant || ''}`.toLowerCase();
  const shouldShowDraft = Boolean(explicitDraft) || responseType.includes('draft') || responseType.includes('insert') || isDraftRequest(request);

  if (!shouldShowDraft) {
    return {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
      variant: 'plain',
    };
  }

  return {
    id: (Date.now() + 1).toString(),
    role: 'assistant',
    content: data.answer?.trim() || 'I drafted something you can add to the entry.',
    draftContent: explicitDraft || responseText,
    variant: 'draft',
  };
};

const RightPanel = () => {
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

  const handleRequest = async () => {
    if (!prompt.trim()) return;

    const currentPrompt = prompt;
    const userMessage: HistoryItem = { id: Date.now().toString(), role: 'user', content: currentPrompt };
    setHistory(prev => [...prev, userMessage]);
    setPrompt('');
    setIsGenerating(true);

    try {
      const workerUrl = import.meta.env.VITE_WORKER_URL || 'http://localhost:8787';
      const response = await fetch(`${workerUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: currentPrompt })
      });

      if (!response.ok) {
        throw new Error('Failed to generate text');
      }

      const data = await response.json() as GenerateResponse;
      const assistantMessage = buildAssistantMessage(data, currentPrompt);
      setHistory(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: HistoryItem = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error: Could not generate text. Make sure the Worker is running.',
        variant: 'plain',
      };
      setHistory(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
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
      </div>

      <div className="panel-content history-content" ref={scrollRef}>
        {history.length === 0 && !isGenerating && (
          <div className="empty-state">
            <span className="empty-state-kicker">Assistant ready</span>
            <p>Ask for a sentence, a revision, or a small piece you can shape into the entry.</p>
            <div className="empty-suggestions" aria-label="Prompt suggestions">
              {EMPTY_PROMPTS.map(item => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setPrompt(item.prompt)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {history.map((item) => (
          <div key={item.id} className={`history-item ${item.role} ${item.variant || 'plain'}`}>
            <div className="message-bubble" aria-label={item.role === 'user' ? 'User request' : 'Assistant response'}>
              <p>{item.content}</p>
            </div>

            {item.role === 'assistant' && item.draftContent && (
              <>
                <div className="draft-card">
                  <div className="draft-card-header">
                    <span>Draft for entry</span>
                  </div>
                  <p>{item.draftContent}</p>
                </div>
                <div className="assistant-actions">
                  <button className="insert-btn" onClick={() => handleInsert(item.draftContent || '')}>
                    <ArrowLeft size={14} strokeWidth={2.4} />
                    Apply to Entry
                  </button>
                </div>
              </>
            )}
          </div>
        ))}

        {isGenerating && (
          <div className="history-item assistant plain">
            <div className="message-bubble loading-bubble">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}
      </div>

      <div className="prompt-area">
        <div className="prompt-box">
          <textarea
            placeholder="What would you like me to write?"
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                void handleRequest();
              }
            }}
            disabled={isGenerating}
          />
          <button
            className="request-btn"
            onClick={handleRequest}
            disabled={isGenerating || !prompt.trim()}
            aria-label="Send request"
          >
            <SendHorizontal size={16} strokeWidth={2.5} />
          </button>
          <div className="prompt-hint">Enter to send · Shift Enter for a new line</div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
