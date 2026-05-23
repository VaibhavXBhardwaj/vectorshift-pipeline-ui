// nodes/transformNode.js
//
// Applies a deterministic string transformation to the incoming value.
// No LLM required — fast, predictable, cheap.

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import styles from './nodes.module.css';

const TRANSFORMS = [
  'uppercase',
  'lowercase',
  'trim',
  'reverse',
  'JSON.parse',
  'JSON.stringify',
  'base64 encode',
  'base64 decode',
  'url encode',
  'url decode',
];

const HANDLES = [
  { type: 'target', position: Position.Left,  id: 'input'  },
  { type: 'source', position: Position.Right, id: 'output' },
];

export function TransformNode({ id, data }) {
  const [transform, setTransform] = useState(data?.transform || 'uppercase');

  return (
    <BaseNode
      id={id}
      title="Transform"
      icon="⇄"
      accentColor="--accent-transform"
      handles={HANDLES}
    >
      <div className={styles.field}>
        <span className={styles.label}>Operation</span>
        <select
          className={styles.select}
          value={transform}
          onChange={(e) => setTransform(e.target.value)}
        >
          {TRANSFORMS.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className={styles.hint}>
        Transforms the input string and passes it downstream.
      </div>
    </BaseNode>
  );
}