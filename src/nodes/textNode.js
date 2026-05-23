// nodes/textNode.js
//
// Parses {{variable}} tokens from the textarea and auto-generates
// a target handle for each unique variable — a clean demo of why
// BaseNode accepts handles as data, not JSX.

import { useState, useEffect, useRef, useMemo } from 'react';
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

// Minimum dimensions for the node — keeps it readable when empty.
const MIN_WIDTH  = 260;
const MIN_HEIGHT = 80; // textarea min height in px

export function TextNode({ id, data }) {
  const [text, setText] = useState(data?.text || '{{input}}');

  const textareaRef = useRef(null);
  const mirrorRef   = useRef(null);

  const vars    = useMemo(() => parseVars(text), [text]);
  const handles = useMemo(() => buildHandles(vars), [vars]);

  // ── Auto-resize ────────────────────────────────────────────────────────────
  // We use a hidden "mirror" <div> that matches the textarea's font / padding
  // exactly.  Measuring the mirror avoids the textarea's own scrollHeight
  // quirks (it never shrinks) and gives us a true content size.
  useEffect(() => {
    const mirror = mirrorRef.current;
    if (!mirror) return;

    // Sync mirror content — append a trailing newline so the last empty line
    // is accounted for, and a zero-width space so an empty string still has
    // measurable height.
    mirror.textContent = text + '\n\u200b';

    const { scrollWidth, scrollHeight } = mirror;

    // Width: clamp to [MIN_WIDTH, …]; add a little breathing room on the right
    // so the text doesn't butt right up against the node border.
    const targetW = Math.max(MIN_WIDTH, scrollWidth + 32);

    // Height: clamp to [MIN_HEIGHT, …]
    const targetH = Math.max(MIN_HEIGHT, scrollHeight);

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.width  = `${targetW - 32}px`; // account for node padding
      textarea.style.height = `${targetH}px`;
    }
  }, [text]);

  function handleChange(e) {
    setText(e.target.value);
  }

  return (
    <BaseNode
      id={id}
      title="Text"
      icon="T"
      accentColor="--accent-text"
      handles={handles}
      minWidth={MIN_WIDTH}
    >
      {/*
        Hidden mirror div — renders offscreen, shares computed styles with the
        textarea so our measurements are accurate.
      */}
      <div
        ref={mirrorRef}
        aria-hidden="true"
        style={{
          position:    'fixed',
          top:         '-9999px',
          left:        '-9999px',
          visibility:  'hidden',
          whiteSpace:  'pre-wrap',
          wordBreak:   'break-word',
          // These must match the textarea's CSS exactly.
          font:        'inherit',
          fontSize:    '13px',
          lineHeight:  '1.5',
          padding:     '6px 8px',
          // Give the mirror the same max/min width as the textarea so word-wrap
          // behaviour is identical.
          minWidth:    `${MIN_WIDTH - 32}px`,
          boxSizing:   'border-box',
        }}
      />

      <div className={styles.field}>
        <span className={styles.label}>Template</span>
        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          onChange={handleChange}
          // No fixed `rows` — height is driven entirely by the mirror measurement.
          style={{
            resize:    'none',
            overflow:  'hidden',
            minHeight: `${MIN_HEIGHT}px`,
            width:     '100%',
            boxSizing: 'border-box',
          }}
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