import { useState } from 'react';
import './App.css';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import EditorContainer from './components/EditorContainer';

export type CueMode = 'edit' | 'semantic' | 'none';

export interface ActiveScores {
  editRatio: number | null;
  semanticScore: number | null;
}

function App() {
  const [cueMode, setCueMode] = useState<CueMode>('edit');
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [activeScores, setActiveScores] = useState<ActiveScores>({ editRatio: null, semanticScore: null });

  return (
    <div className="app-container">
      {/* Left Panel: Attribution Settings */}
      <div className="panel panel-left">
        <LeftPanel cueMode={cueMode} setCueMode={setCueMode} />
      </div>

      {/* Center Panel: Main Editor */}
      <div className="panel panel-main">
        <EditorContainer cueMode={cueMode} setActiveScores={setActiveScores} activeScores={activeScores} />
      </div>

      {/* Right Panel: LLM Request */}
      {isRightPanelOpen && (
        <div className="panel panel-right">
          <RightPanel onClose={() => setIsRightPanelOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default App;
