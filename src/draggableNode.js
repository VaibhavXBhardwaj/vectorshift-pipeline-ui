export const DraggableNode = ({ type, label, icon, accent }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      style={{
        cursor: 'grab',
        padding: '8px 12px',
        borderRadius: '8px',
        background: '#fff',
        border: `1px solid #e2e8f0`,
        borderLeft: `3px solid ${accent || '#94a3b8'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        fontWeight: 500,
        color: '#0f172a',
        userSelect: 'none',
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </div>
  );
};