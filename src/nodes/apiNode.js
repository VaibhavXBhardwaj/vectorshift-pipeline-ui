

import { useState } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import styles from './nodes.module.css';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];

const HANDLES = [
  { type: 'target', position: Position.Left,  id: 'body'     },
  { type: 'source', position: Position.Right, id: 'response' },
  { type: 'source', position: Position.Right, id: 'error', label: 'error', offset: 70 },
];

export function ApiNode({ id, data }) {
  const [method, setMethod] = useState(data?.method || 'GET');
  const [url,    setUrl   ] = useState(data?.url    || 'https://');

  return (
    <BaseNode
      id={id}
      title="API Request"
      icon="↗"
      accentColor="--accent-api"
      handles={HANDLES}
      minWidth={260}
    >
      <div className={styles.field}>
        <span className={styles.label}>Method</span>
        <select
          className={styles.select}
          value={method}
          onChange={(e) => setMethod(e.target.value)}
        >
          {METHODS.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <span className={styles.label}>URL</span>
        <input
          className={styles.input}
          type="text"
          value={url}
          placeholder="https://api.example.com/endpoint"
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <div className={styles.hint}>
        Body is passed from the left handle. Supports <code>{'{{variables}}'}</code> in the URL.
      </div>
    </BaseNode>
  );
}