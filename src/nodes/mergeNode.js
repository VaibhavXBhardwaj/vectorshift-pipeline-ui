

import { useState, useMemo } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import styles from './nodes.module.css';

const STRATEGIES = ['object', 'concat', 'array'];

function buildHandles(count) {
  const inputs = Array.from({ length: count }, (_, i) => ({
    type: 'target',
    position: Position.Left,
    id: `in${i}`,
    label: `in${i}`,
    offset: count === 1 ? 50 : 15 + (i / (count - 1)) * 70,
  }));
  return [...inputs, { type: 'source', position: Position.Right, id: 'output' }];
}

export function MergeNode({ id, data }) {
  const [count,    setCount   ] = useState(data?.inputCount || 2);
  const [strategy, setStrategy] = useState(data?.strategy   || 'object');

  const handles = useMemo(() => buildHandles(count), [count]);

  return (
    <BaseNode
      id={id}
      title="Merge"
      icon="⊕"
      accentColor="--accent-merge"
      handles={handles}
      minWidth={230}
    >
      <div className={styles.field}>
        <span className={styles.label}>Inputs</span>
        <input
          className={styles.input}
          type="number"
          min={2}
          max={8}
          value={count}
          onChange={(e) => setCount(Math.min(8, Math.max(2, Number(e.target.value))))}
        />
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Strategy</span>
        <select
          className={styles.select}
          value={strategy}
          onChange={(e) => setStrategy(e.target.value)}
        >
          {STRATEGIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
    </BaseNode>
  );
}