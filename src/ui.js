import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
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

const GRID = 20;

const proOptions = { hideAttribution: true };

// Registry — add new node types here only; no other file needs to change.
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
    <div ref={wrapperRef} style={{ width: '100%', height: '70vh' }}>
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
        connectionLineType="smoothstep"
        fitView
      >
        <Background color="#94a3b8" gap={GRID} size={0.5} />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const accent = {
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
            return accent[n.type] ?? '#94a3b8';
          }}
          maskColor="rgba(248,250,252,0.8)"
        />
      </ReactFlow>
    </div>
  );
}