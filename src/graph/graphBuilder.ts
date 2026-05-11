import type { GithubFile } from '../objects/GithubFile';
import type { FileGraphNode } from '../objects/FIleGraphNode';
import type { ValidFile } from '../objects/ValidFile';
import extractGithubFileNameFromPath from '../helpers/ExtractGithubFileName';

export function buildAdjacencyList(graphNodes: FileGraphNode[]): {
    adjList: Map<string, FileGraphNode[]>;
    nodeMap: Map<string, FileGraphNode>;
} {
    const adjList = new Map<string, FileGraphNode[]>();
    const nodeMap = new Map<string, FileGraphNode>();

    for (const node of graphNodes) {
        const fileName = extractGithubFileNameFromPath(node.fileSource);
        adjList.set(fileName, node.adjacencyArray);
        nodeMap.set(fileName, node);
    }

    return { adjList, nodeMap };
}

export function extractValidFiles(files: GithubFile[]): ValidFile[] {
    return files
        .filter((file) => file.path.endsWith(".ts"))
        .map((file) => ({
            fileName: file.path.split('/').at(-1)!,
            fileUrl: file.url,
            filePath: file.path,
        }));
}