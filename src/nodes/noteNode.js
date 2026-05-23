// nodes/noteNode.js
//
// A no-handle annotation node. Pure documentation inside the canvas.

import { useState } from 'react';
import { BaseNode } from './BaseNode';
import styles from './nodes.module.css';

export function NoteNode({ id, data }) {
  const [text, setText] = useState(data?.text || 'Add a note…');

  return (
    <BaseNode
      id={id}
      title="Note"
      icon="✎"
      accentColor="--accent-note"
      handles={[]}
      minWidth={200}
    >
      <textarea
        className={styles.textarea}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        placeholder="Add a note…"
      />
    </BaseNode>
  );
}