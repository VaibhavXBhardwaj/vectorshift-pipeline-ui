// toolbar.js

import { DraggableNode } from './draggableNode';
import styles from './toolbar.module.css';

const NODES = [
  // ── Original four ──────────────────────────────────────────
  { type: 'customInput', label: 'Input',     icon: '→', accent: 'var(--accent-input)'     },
  { type: 'customOutput',label: 'Output',    icon: '←', accent: 'var(--accent-output)'    },
  { type: 'llm',         label: 'LLM',       icon: '✦', accent: 'var(--accent-llm)'       },
  { type: 'text',        label: 'Text',      icon: 'T', accent: 'var(--accent-text)'      },
  // ── New nodes ──────────────────────────────────────────────
  { type: 'note',        label: 'Note',      icon: '✎', accent: 'var(--accent-note)'      },
  { type: 'condition',   label: 'Condition', icon: '⑂', accent: 'var(--accent-condition)' },
  { type: 'transform',   label: 'Transform', icon: '⇄', accent: 'var(--accent-transform)' },
  { type: 'api',         label: 'API',       icon: '↗', accent: 'var(--accent-api)'       },
  { type: 'merge',       label: 'Merge',     icon: '⊕', accent: 'var(--accent-merge)'     },
];

export function PipelineToolbar() {
  return (
    <aside className={styles.toolbar}>
      <p className={styles.sectionLabel}>Nodes</p>
      <div className={styles.grid}>
        {NODES.map(({ type, label, icon, accent }) => (
          <DraggableNode
            key={type}
            type={type}
            label={label}
            icon={icon}
            accent={accent}
          />
        ))}
      </div>
    </aside>
  );
}