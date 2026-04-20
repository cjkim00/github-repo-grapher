import { useState, useEffect } from 'react';
import type { GithubResponse } from '../objects/GithubResponse';
<<<<<<< HEAD
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

        for (const node of graphNodes) {
            adjList.set(
                extractGithubFileNameFromPath(node.fileSource),
                node.adjacencyArray.map(neighbor => extractGithubFileNameFromPath(neighbor.fileSource))
            );
        }

        setAdjacencyList(adjList);
        return adjList;
    }

    return {
        response,
        files,
        validFiles,
        adjacencyList,
        getRepoFiles,
        getRepoFileContents,
        setValidFiles,
        parseCode,
        extractValidFiles,
        buildGraph,
        buildAdjacencyList
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
=======
export function useGithubApi() {
    const [response, setResponse] = useState<GithubResponse | null>();
    //const testURL = "https://api.github.com/repos/cjkim00/whiteboard-app/git/trees/HEAD?recursive=1";

    //console.log(getRepoContents(testURL));
    return {
        response,
        getRepoContents
    }
}

async function getRepoContents(url: string) {
    console.log("function called");
    const res = await fetch(
    url
  );
  const data = await res.json();
  console.log(data);
  console.log(atob(data.content));
  return res.json();
>>>>>>> 9a322bfdc8d17c3591bdd9ca6cb9258b9598ca11
}