import { useMemo } from 'react';
import type { FileGraphNode } from '../objects/FIleGraphNode';
import extractGithubFileNameFromPath from "../helpers/ExtractGithubFileName";
export function useFilteredAdjacencyList(
    adjacencyList: Map<string, FileGraphNode[]>,
    currentGraphFile: string
) {
    return useMemo(() => {
        if (!currentGraphFile) return adjacencyList;

        const neighborNodes = adjacencyList.get(currentGraphFile) ?? [];
        const neighborNames = neighborNodes.map(n => extractGithubFileNameFromPath(n.fileSource));
        const relevantFiles = new Set([currentGraphFile, ...neighborNames]);

        const filtered = new Map<string, FileGraphNode[]>();
        for (const file of relevantFiles) {
            const edges = (adjacencyList.get(file) ?? []).filter(n =>
                relevantFiles.has(extractGithubFileNameFromPath(n.fileSource))
            );
            filtered.set(file, edges);
        }
        return filtered;
    }, [currentGraphFile, adjacencyList]);
}