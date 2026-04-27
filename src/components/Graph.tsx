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

interface GraphProps {
    graphKey: string;
    adjacencyList: Map<string, FileGraphNode[]>;
    fileGraphNodeMap: Map<string, FileGraphNode>;
}

export function Graph({ graphKey, adjacencyList, fileGraphNodeMap }: GraphProps) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const { nodes: layoutedNodes, edges: baseEdges } = useMemo(() => {
        const { nodes, edges } = buildNodesAndEdges(adjacencyList, fileGraphNodeMap);
        return getLayoutedElements(nodes, edges);
    }, [adjacencyList, fileGraphNodeMap]);

    const highlightedEdges = useMemo(() => {
        if (!selectedNodeId) return baseEdges;
        return baseEdges.map((edge) => {
            const isConnected = edge.source === selectedNodeId || edge.target === selectedNodeId;
            return {
                ...edge,
                style: isConnected
                    ? { stroke: '#ff0073', strokeWidth: 2 }
                    : { stroke: '#b1b1b7', strokeWidth: 1, opacity: 0.3 },
            };
        });
    }, [selectedNodeId, baseEdges]);

    const onNodeClick: NodeMouseHandler = useCallback((_event, node) => {
        setSelectedNodeId((prev) => (prev === node.id ? null : node.id)); // click again to deselect
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    return (
        <div style={{ width: "100%", height: "95vh" }}>
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