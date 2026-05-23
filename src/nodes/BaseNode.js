// nodes/BaseNode.js
// ─────────────────────────────────────────────────────────────────────────────
// The single source of truth for node layout, chrome, and handle rendering.
// Individual nodes only declare what makes them unique.
// ─────────────────────────────────────────────────────────────────────────────

import { Handle, Position } from 'reactflow';
import styles from './nodes.module.css';

/**
 * @typedef {Object} HandleDef
 * @property {'source'|'target'} type
 * @property {Position}          position
 * @property {string}            id        - scoped to the node (e.g. 'prompt')
 * @property {string}           [label]    - rendered as a small offset label
 * @property {number}           [offset]   - percentage along the edge (default 50)
 */

/**
 * BaseNode
 *
 * @param {Object}    props
 * @param {string}    props.id          - ReactFlow node id
 * @param {string}    props.title       - header label
 * @param {string}   [props.icon]       - emoji or single glyph shown beside title
 * @param {string}   [props.accentColor]- CSS custom-property name for the left accent stripe
 * @param {HandleDef[]} props.handles   - declarative handle definitions
 * @param {React.ReactNode} props.children - the node's unique body content
 * @param {number}   [props.minWidth]   - override minimum width (px), default 220
 */
export function BaseNode({
  id,
  title,
  icon,
  accentColor = '--accent-default',
  handles = [],
  children,
  minWidth = 220,
}) {
  return (
    <div
      className={styles.node}
      style={{ minWidth, '--node-accent': `var(${accentColor})` }}
    >
      {/* Handles rendered before content so z-index stacking is correct */}
      {handles.map((h) => {
        const isLeft = h.position === Position.Left;
        const isRight = h.position === Position.Right;
        const offsetStyle =
          h.offset !== undefined
            ? isLeft || isRight
              ? { top: `${h.offset}%` }
              : { left: `${h.offset}%` }
            : {};

        return (
          <span key={h.id} className={styles.handleWrap} style={offsetStyle}>
            <Handle
              type={h.type}
              position={h.position}
              id={`${id}-${h.id}`}
              className={styles.handle}
            />
            {h.label && (
              <span
                className={
                  isLeft
                    ? styles.handleLabelLeft
                    : styles.handleLabelRight
                }
              >
                {h.label}
              </span>
            )}
          </span>
        );
      })}

      {/* Header */}
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <span className={styles.title}>{title}</span>
      </div>

      {/* Body */}
      <div className={styles.body}>{children}</div>
    </div>
  );
}