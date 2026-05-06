import { useState, useMemo, useCallback } from "react";
import type { Edge, NodeMouseHandler } from "@xyflow/react";
export function useNodeSelection(baseEdges: Edge[]) {
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

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
        setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
    }, []);

    const onPaneClick = useCallback(() => {
        setSelectedNodeId(null);
    }, []);

    return { highlightedEdges, onNodeClick, onPaneClick };
}