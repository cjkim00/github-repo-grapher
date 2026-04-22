import { useState, useEffect, useRef } from 'react';
import type { GithubResponse } from '../objects/GithubResponse';
import type { GithubFile } from '../objects/GithubFile';
import type { GithubFileContents } from '../objects/GithubFileContents';
import type { ValidFile } from '../objects/ValidFile';
import { Parser, Language, Tree } from 'web-tree-sitter';
import type { FileContents } from '../objects/FileContents';
import type { FileGraphNode } from '../objects/FIleGraphNode';
import extractGithubFileNameFromPath, { extractGithubFileNameFromUrl } from '../helpers/ExtractGithubFileName';

export function useGithubApi(url: string) {
    const [response, setResponse] = useState<GithubResponse | null>();
    const [files, setFiles] = useState<GithubFile[]>([]);

    const [validFiles, setValidFiles] = useState<ValidFile[]>([]);
    const [adjacencyList, setAdjacencyList] = useState<Map<string, string[]>>(new Map());
    const [fileGraphNodeMap, setFileGraphNodeMap] = useState<Map<string, FileGraphNode>>(new Map());

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getRepoFiles(url, token);
                setFiles(res);
            } catch (err) {
                console.log(err);
            }
        }

        fetchData();
    }, [url]);

    function buildAdjacencyList(graphNodes: FileGraphNode[]): Map<string, string[]> {
    const adjList = new Map<string, string[]>();
    const nodeMap = new Map<string, FileGraphNode>();

    for (const node of graphNodes) {
        const fileName = extractGithubFileNameFromPath(node.fileSource);
        adjList.set(
            fileName,
            node.adjacencyArray.map(neighbor => extractGithubFileNameFromPath(neighbor.fileSource))
        );
        nodeMap.set(fileName, node);
    }

    setAdjacencyList(adjList);
    setFileGraphNodeMap(nodeMap);
    return adjList;
}

    async function callGithubApi(apiUrl: string = url): Promise<Map<string, string[]> | null> {
        try {
            // 1. Fetch all files in the repo tree
            const repoFiles = await getRepoFiles(apiUrl, token);

            if (!repoFiles || repoFiles.length === 0) {
                throw new Error("No files returned from GitHub API. Check the URL or token.");
            }

            // 2. Extract only valid TypeScript files
            extractValidFiles(repoFiles, setValidFiles);

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

            // 3. Fetch the contents of each valid file
            const fileContentsSettled = await Promise.allSettled(
                tsFiles.map(async (file) => {
                    const contents = await getRepoFileContents(file.fileUrl, token);

                    // Bad server response check
                    if (!contents || !contents.content) {
                        throw new Error(`Failed to fetch contents for file: ${file.fileName}`);
                    }

                    const decoded = atob(contents.content.replace(/\n/g, ""));

                    return {
                        path: file.filePath,
                        url: file.fileUrl,
                        content: decoded,
                    };
                })
            );

            // Filter out failed fetches and log them
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

            // 4. Build the dependency graph and adjacency list
            const graphNodes = await buildGraph(fileContents);
            const adjList = buildAdjacencyList(graphNodes);

            return adjList;

        } catch (err) {
            console.error("callGithubApi failed:", err);
            return null;
        }
    }

    async function getRepoFiles(url: string, token: string): Promise<GithubFile[]> {
        const res = await fetch(url, {
            headers: {
                Authorization: token
            }
        });
        const data = await res.json();
        const githubFiles: GithubFile[] = Array.from((data.tree));
        return githubFiles;
    }

    async function getRepoFileContents(url: string, token: string): Promise<GithubFileContents> {
        const res = await fetch(url, {
            headers: {
                Authorization: token
            }
        });
        const data: GithubFileContents = await res.json();
        return data;
    }

    let parser: Parser | null = null;
    let tsLanguage: Language | null = null;

    async function initParser() {
        if (parser) return;

        await Parser.init({
            locateFile() {
                return "/web-tree-sitter.wasm";
            },
        });

        parser = new Parser();
        tsLanguage = await Language.load("./tree-sitter-typescript.wasm");
        parser.setLanguage(tsLanguage);
    }

    async function parseCode(code: FileContents, allFiles: FileContents[]): Promise<FileGraphNode> {
        await initParser();
        console.log(code.url);
        const tree = parser!.parse(code.content);
        if (!tree) throw new Error("Tree is undefined");

        const node = extractImportsExports(code, tree, allFiles);
        console.log(node);
        return node;
    }

    function extractImportsExports(fileContents: FileContents, tree: Tree, allFiles: FileContents[]): FileGraphNode {
        const root = tree.rootNode;
        const importNodes = root.descendantsOfType('import_statement');

        const importsArr = Array.from(importNodes, node => node.childForFieldName('source')?.text?.replace(/['"]/g, ''))
            .filter((item): item is string => item !== undefined);

        const extractedImportsArr = importsArr.map(name => extractGithubFileNameFromUrl(name));

        const adjacencyArray: FileGraphNode[] = extractedImportsArr
            .map(importName => (allFiles ?? []).find(f => extractGithubFileNameFromPath(f.path) === importName))
            .filter((f): f is FileContents => f !== undefined)
            .map(f => ({
                fileName: extractGithubFileNameFromPath(f.path),
                fileCode: f.content,
                fileSource: f.path,
                adjacencyArray: []
            }));

        return {
            fileName: extractGithubFileNameFromPath(fileContents.path),
            fileCode: fileContents.content,
            fileSource: fileContents.path,
            adjacencyArray
        };
    }

    async function buildGraph(allFiles: FileContents[]): Promise<FileGraphNode[]> {
        return Promise.all(allFiles.map(file => parseCode(file, allFiles)));
    }

    function extractValidFiles(files: GithubFile[], setValidFiles: React.Dispatch<React.SetStateAction<ValidFile[]>>) {
        const validFilesArr = files
            .filter((file) => file.path.endsWith(".ts"))
            .map((file) => ({ fileName: file.path.split('/').at(-1)!, fileUrl: file.url, filePath: file.path }));
        for (const file of validFilesArr) {
            console.log(file.fileName);
        }
        setValidFiles(validFilesArr);
    }

    return {
        response,
        files,
        validFiles,
        adjacencyList,
        fileGraphNodeMap,
        callGithubApi
    }
}

