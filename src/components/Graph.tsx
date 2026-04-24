import type { FileGraphNode } from "../objects/FIleGraphNode";
import { buildNodesAndEdges } from '../react_flow/BuildNodes';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, BackgroundVariant, Controls } from '@xyflow/react';
import { getLayoutedElements } from '../react_flow/GetLayout';
import '@xyflow/react/dist/style.css'
interface GraphProps {
    adjacencyList: Map<string, string[]>;
    fileGraphNodeMap: Map<string, FileGraphNode>;
}

export function Graph({ adjacencyList, fileGraphNodeMap }: GraphProps) {

    const { nodes, edges } = buildNodesAndEdges(adjacencyList); // your existing function
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);


    return (
        <div style={{ width: "100%", height: "500px" }}>
            <ReactFlow
                nodes={layoutedNodes}
                edges={layoutedEdges}
                fitView
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    );

}