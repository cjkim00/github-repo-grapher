import { ReactFlow, type Node, type Edge } from '@xyflow/react';

export function buildNodesAndEdges(adjacencyList: Map<string, string[]>) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    let i = 0;
    for (const [fileName, neighbors] of adjacencyList.entries()) {
        // Create a node for each file
        nodes.push({
            id: fileName,
            data: { label: fileName },
            position: { x: i * 200, y: 0 } // basic positioning for now
        });

        // Create an edge for each connection
        for (const neighbor of neighbors) {
            edges.push({
                id: `${fileName}-${neighbor}`,
                source: fileName,
                target: neighbor,
            });
        }
        i++;
    }

    return { nodes, edges };
}