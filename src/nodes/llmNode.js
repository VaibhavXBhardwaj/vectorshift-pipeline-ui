// nodes/llmNode.js

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import styles from './nodes.module.css';

// Two target handles on the left, staggered at 33% and 66%
const HANDLES = [
  { type: 'target', position: Position.Left,  id: 'system',   label: 'system',   offset: 33 },
  { type: 'target', position: Position.Left,  id: 'prompt',   label: 'prompt',   offset: 66 },
  { type: 'source', position: Position.Right, id: 'response', label: 'response' },
];

const MODELS = ['gpt-4o', 'gpt-4o-mini', 'gpt-3.5-turbo', 'claude-3-5-sonnet', 'claude-3-haiku'];

export function LLMNode({ id, data }) {
  const [model, setModel] = useState(data?.model || 'gpt-4o');

  return (
    <BaseNode
      id={id}
      title="LLM"
      icon="✦"
      accentColor="--accent-llm"
      handles={HANDLES}
      minWidth={240}
    >
      <div className={styles.field}>
        <span className={styles.label}>Model</span>
        <select
          className={styles.select}
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          {MODELS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className={styles.hint}>
        Accepts a system prompt and a user prompt. Returns the model response.
      </div>
    </BaseNode>
  );
}