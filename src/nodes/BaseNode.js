
import { Handle, Position } from 'reactflow';

export function BaseNode({
  id,
  title,
  icon,
  badge,
  accentColor,
  accent,
  handles = [],
  children,
  minWidth = 220,
  style,
}) {
  const accentValue = accent || (accentColor ? `var(${accentColor})` : 'var(--accent-primary)');

  return (
    <div
      className="vs-node"
      style={{ '--node-accent': accentValue, minWidth, ...style }}
    >
      {/* Handles */}
      {handles.map((h) => {
        const isLeft = h.position === Position.Left;
        const isRight = h.position === Position.Right;
        const offsetStyle = h.offset !== undefined
          ? (isLeft || isRight) ? { top: `${h.offset}%` } : { left: `${h.offset}%` }
          : {};

        return (
          <span
            key={h.id}
            style={{ position: 'absolute', display: 'flex', alignItems: 'center', ...offsetStyle }}
          >
            <Handle
              type={h.type}
              position={h.position}
              id={`${id}-${h.id}`}
            />
            {h.label && (
              <span style={{
                position: 'absolute',
                [isLeft ? 'left' : 'right']: 14,
                fontSize: 10,
                fontWeight: 500,
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                fontFamily: 'var(--font-mono)',
              }}>
                {h.label}
              </span>
            )}
          </span>
        );
      })}

      {/* Header */}
      <div className="vs-node-header">
        {icon && <span className="vs-node-icon">{icon}</span>}
        <span className="vs-node-title">{title}</span>
        {badge && <span className="vs-node-type-badge">{badge}</span>}
      </div>

      {/* Body */}
      {children && <div className="vs-node-body">{children}</div>}
    </div>
  );
}

export function NodeField({ label, children }) {
  return (
    <div className="vs-field">
      {label && <span className="vs-field-label">{label}</span>}
      {children}
    </div>
  );
}