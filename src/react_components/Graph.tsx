import { useState, useMemo, useCallback } from 'react';
import type { FileGraphNode } from "../objects/FIleGraphNode";
import { buildNodesAndEdges } from '../react_flow/BuildNodes';
import {
    ReactFlow,
    Background,
    BackgroundVariant,
    Controls,
    ConnectionLineType,
    type NodeMouseHandler,
} from '@xyflow/react';
import { getLayoutedElements } from '../react_flow/GetLayout';
import '@xyflow/react/dist/style.css';
import { useNodeSelection } from '../hooks/useNodeSelection';
interface GraphProps {
    graphKey: string;
    adjacencyList: Map<string, FileGraphNode[]>;
    fileGraphNodeMap: Map<string, FileGraphNode>;
}

export function Graph({ graphKey, adjacencyList, fileGraphNodeMap }: GraphProps) {
    const { nodes: layoutedNodes, edges: baseEdges } = useMemo(() => {
        const { nodes, edges } = buildNodesAndEdges(adjacencyList, fileGraphNodeMap);
        return getLayoutedElements(nodes, edges);
    }, [adjacencyList, fileGraphNodeMap]);

    const { highlightedEdges, onNodeClick, onPaneClick } = useNodeSelection(baseEdges);

    return (
        <div style={{ width: "100%", height: "100%", border: '1px solid #ccc', borderRadius: '5px', padding: '5px' }}>
            <ReactFlow
                key={graphKey}
                nodes={layoutedNodes}
                edges={highlightedEdges}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                fitView
                connectionLineType={ConnectionLineType.SmoothStep}
            >
                <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                <Controls />
            </ReactFlow>
        </div>
    );
}