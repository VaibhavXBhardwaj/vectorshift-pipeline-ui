import styles from './toolbar.module.css';

export const DraggableNode = ({ type, label, icon, accent }) => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, type)}
      className={styles.nodeCard}
      style={{ '--node-accent': accent }}
      title={`Drag to add ${label} node`}
    >
      <span className={styles.iconWrap}>{icon}</span>
      <span className={styles.label}>{label}</span>
    </div>
  );
};