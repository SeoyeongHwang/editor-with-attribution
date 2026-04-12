import { TextNode, $applyNodeReplacement } from 'lexical';
import type { NodeKey, SerializedTextNode, LexicalNode } from 'lexical';

export type SerializedAIAttributionNode = SerializedTextNode & {
  baselineText: string;
  insertionId: string;
  semanticScore?: number;
};

export class AIAttributionNode extends TextNode {
  __baselineText: string;
  __insertionId: string;
  __editRatio: number = 0; // Runtime calculated
  __semanticScore: number;

  static getType(): string {
    return 'ai-attribution';
  }

  static clone(node: AIAttributionNode): AIAttributionNode {
    const cloned = new AIAttributionNode(
      node.__text,
      node.__baselineText,
      node.__insertionId,
      node.__key,
    );
    cloned.__semanticScore = node.__semanticScore;
    return cloned;
  }

  constructor(text: string, baselineText: string, insertionId: string, key?: NodeKey) {
    super(text, key);
    this.__baselineText = baselineText;
    this.__insertionId = insertionId;
    this.__semanticScore = 1.0;
  }

  createDOM(config: any): HTMLElement {
    const dom = super.createDOM(config);
    dom.classList.add('ai-attribution-span');
    dom.setAttribute('data-insertion-id', this.__insertionId);
    return dom;
  }

  updateDOM(prevNode: any, dom: HTMLElement, config: any): boolean {
    const isTextUpdated = super.updateDOM(prevNode, dom, config);
    // Any other styling will be updated via React/Editor plugin observing this node
    return isTextUpdated;
  }

  exportJSON(): SerializedAIAttributionNode {
    return {
      ...super.exportJSON(),
      baselineText: this.__baselineText,
      insertionId: this.__insertionId,
      semanticScore: this.__semanticScore,
      type: 'ai-attribution',
      version: 1,
    };
  }

  static importJSON(serializedNode: SerializedAIAttributionNode): AIAttributionNode {
    const node = $createAIAttributionNode(
      serializedNode.text,
      serializedNode.baselineText,
      serializedNode.insertionId
    );
    node.setSemanticScore(serializedNode.semanticScore ?? 1.0);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  getBaselineText(): string {
    return this.__baselineText;
  }

  getInsertionId(): string {
    return this.__insertionId;
  }

  getSemanticScore(): number {
    return this.__semanticScore;
  }

  setSemanticScore(score: number): void {
    const writable = this.getWritable();
    writable.__semanticScore = score;
  }
}

export function $createAIAttributionNode(
  text: string,
  baselineText: string,
  insertionId: string
): AIAttributionNode {
  return $applyNodeReplacement(new AIAttributionNode(text, baselineText, insertionId));
}

export function $isAIAttributionNode(
  node: LexicalNode | null | undefined,
): node is AIAttributionNode {
  return node instanceof AIAttributionNode;
}
