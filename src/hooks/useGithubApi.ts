import { useState, useEffect } from 'react';
import type { GithubResponse } from '../objects/GithubResponse';
import type { GithubFile } from '../objects/GithubFile';
import type { ValidFile } from '../objects/ValidFile';
import type { FileContents } from '../objects/FileContents';
import type { FileGraphNode } from '../objects/FIleGraphNode';
import { getRepoFiles, getRepoFileContents } from '../api/githubApi';
import { buildGraph } from '../parser/treeParser';
import { buildAdjacencyList, extractValidFiles } from '../graph/graphBuilder';

export function useGithubApi(url: string) {
    const [response, setResponse] = useState<GithubResponse | null>();
    const [files, setFiles] = useState<GithubFile[]>([]);
    const [validFiles, setValidFiles] = useState<ValidFile[]>([]);
    const [adjacencyList, setAdjacencyList] = useState<Map<string, FileGraphNode[]>>(new Map());
    const [fileGraphNodeMap, setFileGraphNodeMap] = useState<Map<string, FileGraphNode>>(new Map());

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getRepoFiles(url);
                setFiles(res);
            } catch (err) {
                console.log(err);
            }
        }
        fetchData();
    }, [url]);

    async function callGithubApi(url: string): Promise<Map<string, FileGraphNode[]> | null> {
        try {
            const repoFiles = await getRepoFiles(url);

            if (!repoFiles || repoFiles.length === 0) {
                throw new Error("No files returned from GitHub API. Check the URL or token.");
            }

            setValidFiles(extractValidFiles(repoFiles));

            const tsFiles = repoFiles
                .filter((file) => file.path.endsWith(".ts"))
                .map((file) => ({
                    fileName: file.path.split('/').at(-1)!,
                    fileUrl: file.url,
                    filePath: file.path,
                }));

            if (tsFiles.length === 0) {
                throw new Error("No TypeScript files found in this repository.");
            }

            const fileContentsSettled = await Promise.allSettled(
                tsFiles.map(async (file) => {
                    const contents = await getRepoFileContents(file.fileUrl);

                    if (!contents || !contents.content) {
                        throw new Error(`Failed to fetch contents for file: ${file.fileName}`);
                    }

                    const decoded = atob(contents.content.replace(/\n/g, ""));
                    return { path: file.filePath, url: file.fileUrl, content: decoded } as FileContents;
                })
            );

            const fileContents = fileContentsSettled
                .filter((result): result is PromiseFulfilledResult<FileContents> => {
                    if (result.status === "rejected") {
                        console.warn("Skipping file due to error:", result.reason);
                        return false;
                    }
                    return true;
                })
                .map((result) => result.value);

            if (fileContents.length === 0) {
                throw new Error("All file content fetches failed.");
            }

            const graphNodes = await buildGraph(fileContents);
            const { adjList, nodeMap } = buildAdjacencyList(graphNodes);

            setAdjacencyList(adjList);
            setFileGraphNodeMap(nodeMap);

            return adjList;

        } catch (err) {
            console.error("callGithubApi failed:", err);
            return null;
        }
    }

    return { response, files, validFiles, adjacencyList, fileGraphNodeMap, callGithubApi };
}