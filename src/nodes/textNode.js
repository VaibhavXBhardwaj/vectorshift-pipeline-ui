// nodes/textNode.js
//
// Parses {{variable}} tokens from the textarea and auto-generates
// a target handle for each unique variable — a clean demo of why
// BaseNode accepts handles as data, not JSX.

import { useState, useMemo } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import styles from './nodes.module.css';

const VAR_RE = /\{\{(\w+)\}\}/g;

function parseVars(text) {
  return [...new Set([...text.matchAll(VAR_RE)].map((m) => m[1]))];
}

function buildHandles(vars) {
  const inputs = vars.map((v, i) => ({
    type: 'target',
    position: Position.Left,
    id: v,
    label: v,
    // spread evenly; at least 25% from top/bottom so handles don't clip
    offset: vars.length === 1 ? 50 : 20 + (i / (vars.length - 1)) * 60,
  }));

  return [
    ...inputs,
    { type: 'source', position: Position.Right, id: 'output' },
  ];
}

export function TextNode({ id, data }) {
  const [text, setText] = useState(data?.text || '{{input}}');

  const vars    = useMemo(() => parseVars(text), [text]);
  const handles = useMemo(() => buildHandles(vars), [vars]);

  return (
    <BaseNode
      id={id}
      title="Text"
      icon="T"
      accentColor="--accent-text"
      handles={handles}
      minWidth={260}
    >
      <div className={styles.field}>
        <span className={styles.label}>Template</span>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>

      {vars.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {vars.map((v) => (
            <span key={v} className={styles.badge}>{`{{${v}}}`}</span>
          ))}
        </div>
      )}
    </BaseNode>
  );
}