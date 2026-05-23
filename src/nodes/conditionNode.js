// nodes/conditionNode.js
//
// Routes the incoming value to one of two outputs depending on a condition.
// Demonstrates a node with one input and two named outputs.

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import styles from './nodes.module.css';

const OPERATORS = ['contains', 'equals', 'starts with', 'ends with', 'matches regex'];

const HANDLES = [
  { type: 'target', position: Position.Left,  id: 'value'              },
  { type: 'source', position: Position.Right, id: 'true',  label: 'true',  offset: 33 },
  { type: 'source', position: Position.Right, id: 'false', label: 'false', offset: 66 },
];

export function ConditionNode({ id, data }) {
  const [operator, setOperator] = useState(data?.operator || 'contains');
  const [value,    setValue   ] = useState(data?.value    || '');

  return (
    <BaseNode
      id={id}
      title="Condition"
      icon="⑂"
      accentColor="--accent-condition"
      handles={HANDLES}
      minWidth={240}
    >
      <div className={styles.field}>
        <span className={styles.label}>Operator</span>
        <select
          className={styles.select}
          value={operator}
          onChange={(e) => setOperator(e.target.value)}
        >
          {OPERATORS.map((op) => (
            <option key={op} value={op}>{op}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>Compare value</span>
        <input
          className={styles.input}
          type="text"
          value={value}
          placeholder="e.g. hello"
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
    </BaseNode>
  );
}