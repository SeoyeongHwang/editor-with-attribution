
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';

import { AIAttributionNode } from '../nodes/AIAttributionNode';
import AttributionPlugin from '../plugins/AttributionPlugin';
import type { CueMode, ActiveScores } from '../App';
import './EditorContainer.css';

const theme = {
  paragraph: 'editor-paragraph',
  text: {
    bold: 'editor-text-bold',
    italic: 'editor-text-italic',
    underline: 'editor-text-underline',
  },
};

interface EditorContainerProps {
  cueMode: CueMode;
  setActiveScores: React.Dispatch<React.SetStateAction<ActiveScores>>;
  activeScores: ActiveScores;
}

export default function EditorContainer({ cueMode, setActiveScores, activeScores }: EditorContainerProps) {
  const initialConfig = {
    namespace: 'SemanticAttributionEditor',
    theme,
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [
      AIAttributionNode,
    ],
  };

  return (
    <div className="editor-shell">
      <div className="editor-top-bar">
        <span>Semantic Attribution Editor</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div className="status-badge" style={{ width: '190px', textAlign: 'center', whiteSpace: 'nowrap' }}>
            Current Mode: <strong>{cueMode.toUpperCase()}</strong>
          </div>
          <div className="status-badge" style={{ 
            width: '170px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
            opacity: cueMode === 'none' ? 0.3 : ((activeScores?.editRatio !== null || activeScores?.semanticScore !== null) ? 1 : 0.5)
          }}>
            {cueMode === 'edit' ? (
               activeScores?.editRatio !== null 
                 ? <span><strong>Edit Ratio:</strong> {(activeScores.editRatio * 100).toFixed(0)}%</span>
                 : <span>No AI text selected</span>
            ) : cueMode === 'semantic' ? (
               activeScores?.semanticScore !== null 
                 ? <span><strong>Semantic:</strong> {(activeScores.semanticScore * 100).toFixed(0)}%</span>
                 : <span>No AI text selected</span>
            ) : (
               <span>Scores disabled</span>
            )}
          </div>
        </div>
      </div>
      <div className="editor-container">
        <LexicalComposer initialConfig={initialConfig}>
          <div className="editor-inner">
            <RichTextPlugin
              contentEditable={<ContentEditable className="editor-input" />}
              placeholder={<div className="editor-placeholder">Start writing your document... or ask the AI for help on the right.</div>}
              ErrorBoundary={LexicalErrorBoundary as any}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <AttributionPlugin cueMode={cueMode} setActiveScores={setActiveScores} />
          </div>
        </LexicalComposer>
      </div>
    </div>
  );
}
