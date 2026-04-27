import dagre from 'dagre';
import type { Node, Edge } from '@xyflow/react';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 80;

export function getLayoutedElements(nodes: Node[], edges: Edge[]) {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({
  rankdir: 'RL',
  ranksep: 150,   // vertical spacing
  nodesep: 100,   // horizontal spacing
  edgesep: 50     // spacing between edges
});



    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const dagreNode = dagreGraph.node(node.id);
        return {
    ...node,
    position: {
        x: dagreNode.x - NODE_WIDTH / 2,
        y: dagreNode.y - NODE_HEIGHT / 2,
    },
    sourcePosition: 'left',
    targetPosition: 'right',
};
    });

    return { nodes: layoutedNodes, edges };
}