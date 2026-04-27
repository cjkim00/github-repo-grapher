import type { Node, Edge } from '@xyflow/react';
import extractGithubFileNameFromPath from '../helpers/ExtractGithubFileName';
import type { FileGraphNode } from '../objects/FIleGraphNode';

export function buildNodesAndEdges(
    adjacencyList: Map<string, FileGraphNode[]>,
    fileGraphNodeMap: Map<string, FileGraphNode>,
) {
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    for (const [fileName, neighborNodes] of adjacencyList.entries()) {
        if (!fileName) continue;

        const displayName = fileGraphNodeMap.get(fileName)?.displayName ?? fileName;
        nodes.push({
            id: fileName,
            data: { label: displayName },
            position: { x: 0, y: 0 }, // dagre will set real positions
        });

        for (const neighbor of neighborNodes) {
            if (!neighbor?.fileSource) continue;
            const neighborName = extractGithubFileNameFromPath(neighbor.fileSource);
            if (!neighborName) continue;

            edges.push({
                id: `${fileName}-${neighborName}`,
                source: fileName,
                target: neighborName,
            });
        }
    }

    return { nodes, edges };
}