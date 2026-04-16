import { useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  type Node,
  type Edge,
  type NodeTypes,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
import type { MindMapNode } from '../data/mindMaps/types';

interface MindMapProps {
  data: MindMapNode;
}

interface NodeData {
  label: string;
  detail?: string;
  color: string;
}

// ─── Custom Nodes with Handles ──────────────────────────────────
function RootNode({ data }: { data: NodeData }) {
  return (
    <div
      className="px-6 py-4 rounded-2xl shadow-xl text-center select-none relative"
      style={{
        backgroundColor: data.color,
        color: '#fff',
        fontWeight: 800,
        fontSize: 16,
        minWidth: 180,
        maxWidth: 240,
        lineHeight: 1.3,
        border: `3px solid ${data.color}`,
      }}
    >
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      {data.label}
    </div>
  );
}

function BranchNode({ data }: { data: NodeData }) {
  return (
    <div
      className="px-5 py-3 rounded-xl shadow-md text-center select-none relative"
      style={{
        borderColor: data.color,
        backgroundColor: '#fff',
        color: data.color,
        fontWeight: 700,
        fontSize: 14,
        minWidth: 140,
        maxWidth: 200,
        lineHeight: 1.3,
        border: `2px solid ${data.color}`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      {data.label}
    </div>
  );
}

function TopicNode({ data }: { data: NodeData }) {
  return (
    <div
      className="px-4 py-2 rounded-lg shadow text-center select-none relative"
      style={{
        borderColor: data.color,
        backgroundColor: `${data.color}10`,
        color: '#334155',
        fontWeight: 600,
        fontSize: 12,
        maxWidth: 200,
        lineHeight: 1.3,
        border: `1.5px solid ${data.color}60`,
      }}
    >
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      {data.label}
      {data.detail && (
        <div className="text-[10px] font-normal text-slate-500 mt-1 leading-tight">{data.detail}</div>
      )}
    </div>
  );
}

const nodeTypes: NodeTypes = {
  root: RootNode,
  branch: BranchNode,
  topic: TopicNode,
};

// ─── Dagre Auto-Layout ──────────────────────────────────────────
function buildGraph(root: MindMapNode): { nodes: Node[]; edges: Edge[] } {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', nodesep: 40, ranksep: 120, marginx: 60, marginy: 60 });

  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function getWidth(depth: number, label: string, detail?: string): number {
    const textLen = Math.max(label.length, (detail?.length ?? 0) / 2);
    if (depth === 0) return 200;
    if (depth === 1) return 160;
    return Math.min(200, Math.max(120, textLen * 7));
  }

  function getHeight(depth: number, detail?: string): number {
    if (depth === 0) return 60;
    if (depth === 1) return 48;
    return detail ? 56 : 36;
  }

  function walk(node: MindMapNode, depth: number, parentId?: string) {
    const nodeType = depth === 0 ? 'root' : depth === 1 ? 'branch' : 'topic';
    const w = getWidth(depth, node.label, node.detail);
    const h = getHeight(depth, node.detail);

    nodes.push({
      id: node.id,
      type: nodeType,
      position: { x: 0, y: 0 },
      data: { label: node.label, detail: node.detail, color: node.color },
      draggable: false,
    });

    g.setNode(node.id, { width: w, height: h });

    if (parentId) {
      g.setEdge(parentId, node.id);
      edges.push({
        id: `e-${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'default',
        style: { stroke: node.color, strokeWidth: 2 },
      });
    }

    if (node.children) {
      for (const child of node.children) {
        walk(child, depth + 1, node.id);
      }
    }
  }

  walk(root, 0);
  dagre.layout(g);

  for (const node of nodes) {
    const pos = g.node(node.id);
    if (pos) {
      node.position = { x: pos.x - pos.width / 2, y: pos.y - pos.height / 2 };
    }
  }

  return { nodes, edges };
}

// ─── Component ──────────────────────────────────────────────────
export default function MindMap({ data }: MindMapProps) {
  const { nodes, edges } = useMemo(() => buildGraph(data), [data]);

  return (
    <div className="w-full h-[700px] rounded-xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.1}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background color="#e2e8f0" gap={30} size={1} />
        <Controls showInteractive={false} position="bottom-right" />
        <MiniMap
          nodeColor={(n) => (n.data as NodeData)?.color || '#94a3b8'}
          maskColor="rgba(0,0,0,0.08)"
          style={{ borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}
