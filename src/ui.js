import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap, BackgroundVariant } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

import { InputNode     } from './nodes/inputNode';
import { OutputNode    } from './nodes/outputNode';
import { LLMNode       } from './nodes/llmNode';
import { TextNode      } from './nodes/textNode';
import { NoteNode      } from './nodes/noteNode';
import { ConditionNode } from './nodes/conditionNode';
import { TransformNode } from './nodes/transformNode';
import { ApiNode       } from './nodes/apiNode';
import { MergeNode     } from './nodes/mergeNode';

import 'reactflow/dist/style.css';

const proOptions = { hideAttribution: true };
const GRID = 20;

const nodeTypes = {
  customInput  : InputNode,
  customOutput : OutputNode,
  llm          : LLMNode,
  text         : TextNode,
  note         : NoteNode,
  condition    : ConditionNode,
  transform    : TransformNode,
  api          : ApiNode,
  merge        : MergeNode,
};

/* Accent map — drives minimap colours */
const ACCENT = {
  customInput  : '#6366f1',
  customOutput : '#10b981',
  llm          : '#f59e0b',
  text         : '#3b82f6',
  note         : '#a78bfa',
  condition    : '#f43f5e',
  transform    : '#14b8a6',
  api          : '#f97316',
  merge        : '#8b5cf6',
};

const defaultEdgeOptions = {
  type: 'smoothstep',
  style: { strokeWidth: 1.5 },
  animated: false,
};

const selector = (state) => ({
  nodes        : state.nodes,
  edges        : state.edges,
  getNodeID    : state.getNodeID,
  addNode      : state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect    : state.onConnect,
});

export function PipelineUI() {
  const wrapperRef = useRef(null);
  const [rfInstance, setRfInstance] = useState(null);

  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const raw = event.dataTransfer.getData('application/reactflow');
      if (!raw) return;
      const { nodeType: type } = JSON.parse(raw);
      if (!type) return;
      const bounds = wrapperRef.current.getBoundingClientRect();
      const position = rfInstance.project({
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      });
      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: { id: nodeID, nodeType: type } });
    },
    [rfInstance, getNodeID, addNode],
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={wrapperRef} className="canvas-wrapper">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setRfInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[GRID, GRID]}
        snapToGrid
        connectionLineType="smoothstep"
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        style={{ background: 'var(--bg-canvas)' }}
      >
        {/* Dot grid */}
        <Background
          variant={BackgroundVariant.Dots}
          color="#1e1e35"
          gap={GRID}
          size={1}
        />

        <Controls showInteractive={false} />

        <MiniMap
          nodeColor={(n) => ACCENT[n.type] ?? '#3d3d60'}
          maskColor="rgba(7,7,13,0.75)"
          style={{
            background: 'var(--bg-raised)',
            border: '1px solid var(--border-default)',
            borderRadius: '8px',
          }}
        />
      </ReactFlow>
    </div>
  );
}