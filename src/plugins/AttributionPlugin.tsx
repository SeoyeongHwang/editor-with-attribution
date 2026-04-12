import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useEffect } from 'react';
import { INSERT_AI_TEXT_EVENT } from '../components/RightPanel';
import { $createAIAttributionNode, AIAttributionNode, $isAIAttributionNode } from '../nodes/AIAttributionNode';
import { debounce } from '../utils/debounce';
import { fetchSemanticScore } from '../utils/semantic';
import { calculateEditRatio } from '../utils/distance';
import type { CueMode, ActiveScores } from '../App';
import { $getSelection, $isRangeSelection, $nodesOfType } from 'lexical';

interface AttributionPluginProps {
  cueMode: CueMode;
  setActiveScores: React.Dispatch<React.SetStateAction<ActiveScores>>;
}

export default function AttributionPlugin({ cueMode, setActiveScores }: AttributionPluginProps) {
  const [editor] = useLexicalComposerContext();

  // Handle Inserting AI Text
  useEffect(() => {
    const handleInsert = (event: Event) => {
      const customEvent = event as CustomEvent<{ text: string }>;
      const { text } = customEvent.detail;
      
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const insertionId = 'ai-' + Date.now().toString(36) + Math.random().toString(36).substr(2);
          const aiNode = $createAIAttributionNode(text, text, insertionId);
          selection.insertNodes([aiNode]);
        }
      });
    };

    document.addEventListener(INSERT_AI_TEXT_EVENT, handleInsert);
    return () => {
      document.removeEventListener(INSERT_AI_TEXT_EVENT, handleInsert);
    };
  }, [editor]);

  // Unified function to apply styles to DOM
  const applyStylesToDOM = () => {
    editor.getEditorState().read(() => {
      const aiNodes = $nodesOfType(AIAttributionNode);
      aiNodes.forEach(node => {
        const currentText = node.getTextContent();
        const baseline = node.getBaselineText();
        
        let editRatio = calculateEditRatio(baseline, currentText);
        let semanticScore = node.getSemanticScore(); // F7: Read from node's async-updated state
        
        let backgroundColor = 'transparent';
        
        if (cueMode === 'edit') {
          const opacity = 1 - editRatio;
          backgroundColor = `rgba(249, 115, 22, ${Math.max(0, opacity * 0.4)})`; 
        } else if (cueMode === 'semantic') {
          const opacity = semanticScore; // F7: Higher score = more residual background
          backgroundColor = `rgba(16, 185, 129, ${Math.max(0, opacity * 0.4)})`;
        }

        const dom = editor.getElementByKey(node.getKey());
        if (dom) {
          dom.style.background = backgroundColor;
        }
      });
      
      // Update active scores based on cursor selection
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        
        let activeAINode: AIAttributionNode | null = null;
        if ($isAIAttributionNode(anchorNode)) {
          activeAINode = anchorNode as AIAttributionNode;
        } else {
          const parent = anchorNode.getParent();
          if ($isAIAttributionNode(parent)) {
            activeAINode = parent as AIAttributionNode;
          }
        }

        if (activeAINode) {
           const currentText = activeAINode.getTextContent();
           const baselineText = activeAINode.getBaselineText();
           const editRatio = calculateEditRatio(baselineText, currentText);
           const semanticScore = activeAINode.getSemanticScore();
           
           // We must dispatch async to avoid React state-update-during-render loops
           // when applyStylesToDOM runs inside editor.read()
           setTimeout(() => {
             setActiveScores({ editRatio, semanticScore });
           }, 0);
        } else {
           setTimeout(() => {
             setActiveScores({ editRatio: null, semanticScore: null });
           }, 0);
        }
      }
    });
  };

  // Debounced Semantic Queue (F8)
  const executeDebouncedSemanticFetch = async () => {
    // 1. Gather all current snapshot data safely
    const tasks: { key: string, baseline: string, current: string, prevScore: number }[] = [];
    editor.getEditorState().read(() => {
      $nodesOfType(AIAttributionNode).forEach(node => {
        tasks.push({
          key: node.getKey(),
          baseline: node.getBaselineText(),
          current: node.getTextContent(),
          prevScore: node.getSemanticScore()
        });
      });
    });

    // 2. Await all async mock API calls
    const results = await Promise.all(
      tasks.map(t => 
        fetchSemanticScore(t.baseline, t.current)
          .then(score => ({ key: t.key, score }))
          .catch(() => ({ key: t.key, score: t.prevScore })) // F9: Fallback on failure
      )
    );

    // 3. Update nodes with final scores
    editor.update(() => {
      results.forEach(res => {
        const node = $nodesOfType(AIAttributionNode).find(n => n.getKey() === res.key);
        if (node && node.getSemanticScore() !== res.score) {
          node.setSemanticScore(res.score);
        }
      });
    });
  };

  // We maintain a stable reference to the debounced function
  const scheduleSemanticFetch = React.useMemo(
    () => debounce(executeDebouncedSemanticFetch, 200),
    [editor]
  );

  // 1. Re-run instantaneous styles on mutation, and schedule semantic fetch (F8)
  useEffect(() => {
    return editor.registerMutationListener(
      AIAttributionNode,
      () => { 
        applyStylesToDOM();
        if (cueMode === 'semantic') {
          scheduleSemanticFetch();
        }
      }
    );
  }, [editor, cueMode, scheduleSemanticFetch]);

  // 2. General updates (insertions, undo/redo)
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      applyStylesToDOM();
      if (cueMode === 'semantic') {
        scheduleSemanticFetch();
      }
    });
  }, [editor, cueMode, scheduleSemanticFetch, setActiveScores]);

  // 3. Critically: re-run styles immediately if ONLY cueMode changed from the LeftPanel
  useEffect(() => {
    applyStylesToDOM(); // no debounce on explicit user mode toggle
  }, [cueMode]);

  return null;
}
