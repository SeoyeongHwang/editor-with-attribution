import { useEffect, useRef, useState } from 'react';
import './App.css';
import LeftPanel from './components/LeftPanel';
import RightPanel from './components/RightPanel';
import EditorContainer from './components/EditorContainer';

export type CueMode = 'edit' | 'semantic' | 'none';

export interface ActiveScores {
  editRatio: number | null;
  semanticScore: number | null;
}

const RIGHT_PANEL_MIN_WIDTH = 320;
const RIGHT_PANEL_MAX_WIDTH = 640;
const RIGHT_PANEL_DEFAULT_WIDTH = 360;

function App() {
  const [cueMode, setCueMode] = useState<CueMode>('edit');
  const [activeScores, setActiveScores] = useState<ActiveScores>({ editRatio: null, semanticScore: null });
  const [rightPanelWidth, setRightPanelWidth] = useState(RIGHT_PANEL_DEFAULT_WIDTH);
  const [isResizingRightPanel, setIsResizingRightPanel] = useState(false);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(RIGHT_PANEL_DEFAULT_WIDTH);

  useEffect(() => {
    if (!isResizingRightPanel) return;

    const clampWidth = (width: number) => (
      Math.min(RIGHT_PANEL_MAX_WIDTH, Math.max(RIGHT_PANEL_MIN_WIDTH, width))
    );

    const handlePointerMove = (event: PointerEvent) => {
      const deltaX = resizeStartXRef.current - event.clientX;
      setRightPanelWidth(clampWidth(resizeStartWidthRef.current + deltaX));
    };

    const handlePointerUp = () => {
      setIsResizingRightPanel(false);
    };

    document.body.classList.add('is-resizing-right-panel');
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.body.classList.remove('is-resizing-right-panel');
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isResizingRightPanel]);

  const beginRightPanelResize = (event: React.PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    resizeStartXRef.current = event.clientX;
    resizeStartWidthRef.current = rightPanelWidth;
    setIsResizingRightPanel(true);
  };

  const adjustRightPanelWidth = (amount: number) => {
    setRightPanelWidth(width => (
      Math.min(RIGHT_PANEL_MAX_WIDTH, Math.max(RIGHT_PANEL_MIN_WIDTH, width + amount))
    ));
  };

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
      <div
        className="panel panel-right"
        style={{ width: rightPanelWidth, flexBasis: rightPanelWidth }}
      >
        <button
          type="button"
          className="panel-resize-handle"
          onPointerDown={beginRightPanelResize}
          onKeyDown={event => {
            if (event.key === 'ArrowLeft') {
              event.preventDefault();
              adjustRightPanelWidth(24);
            }
            if (event.key === 'ArrowRight') {
              event.preventDefault();
              adjustRightPanelWidth(-24);
            }
          }}
          role="separator"
          aria-label="Resize writing assistant panel"
          aria-orientation="vertical"
          aria-valuemin={RIGHT_PANEL_MIN_WIDTH}
          aria-valuemax={RIGHT_PANEL_MAX_WIDTH}
          aria-valuenow={rightPanelWidth}
        />
        <RightPanel />
      </div>
    </div>
  );
}

export default App;
