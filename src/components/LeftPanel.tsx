
import { Type, Split, Ban } from 'lucide-react';
import type { CueMode } from '../App';

interface LeftPanelProps {
  cueMode: CueMode;
  setCueMode: (mode: CueMode) => void;
}

const LeftPanel = ({ cueMode, setCueMode }: LeftPanelProps) => {
  return (
    <>
      <button 
        title="Edit Distance Cue"
        onClick={() => setCueMode('edit')}
        style={{ 
          color: cueMode === 'edit' ? 'var(--text-main)' : 'var(--text-light)',
          borderBottom: cueMode === 'edit' ? '2px solid var(--text-main)' : 'none',
          paddingBottom: '4px'
        }}
      >
        <Type size={20} />
      </button>
      <button 
        title="Semantic Cue"
        onClick={() => setCueMode('semantic')}
        style={{ 
          color: cueMode === 'semantic' ? 'var(--text-main)' : 'var(--text-light)',
          borderBottom: cueMode === 'semantic' ? '2px solid var(--text-main)' : 'none',
          paddingBottom: '4px'
        }}
      >
        <Split size={20} />
      </button>

      <button 
        title="No Cues"
        onClick={() => setCueMode('none')}
        style={{ 
          color: cueMode === 'none' ? 'var(--text-main)' : 'var(--text-light)',
          borderBottom: cueMode === 'none' ? '2px solid var(--text-main)' : 'none',
          paddingBottom: '4px'
        }}
      >
        <Ban size={20} />
      </button>
    </>
  );
};

export default LeftPanel;
