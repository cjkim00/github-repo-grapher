import { Parser, Language, Tree } from 'web-tree-sitter';
import type { FileContents } from '../objects/FileContents';
import type { FileGraphNode } from '../objects/FIleGraphNode';
import extractGithubFileNameFromPath, { extractGithubFileNameFromUrl } from '../helpers/ExtractGithubFileName';

let parser: Parser | null = null;
let tsLanguage: Language | null = null;

export async function initParser() {
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

export function extractImportsExports(fileContents: FileContents, tree: Tree, allFiles: FileContents[]): FileGraphNode {
    const root = tree.rootNode;
    const importNodes = root.descendantsOfType('import_statement');

    const importsArr = Array.from(importNodes, node => node.childForFieldName('source')?.text?.replace(/['"]/g, ''))
        .filter((item): item is string => item !== undefined);

    const extractedImportsArr = importsArr.map(name => extractGithubFileNameFromUrl(name));

    const adjacencyArray: FileGraphNode[] = extractedImportsArr
        .map(importName => (allFiles ?? []).find(f => extractGithubFileNameFromPath(f.path) === importName))
        .filter((f): f is FileContents => f !== undefined && !!f.path)
        .map(f => ({
            fileName: extractGithubFileNameFromPath(f.path),
            displayName: f.path.split('/').at(-1)!,
            fileCode: f.content,
            fileSource: f.path,
            adjacencyArray: []
        }));

    return {
        fileName: extractGithubFileNameFromPath(fileContents.path),
        displayName: fileContents.path.split('/').at(-1)!,
        fileCode: fileContents.content,
        fileSource: fileContents.path,
        adjacencyArray
    };
}

export async function parseCode(code: FileContents, allFiles: FileContents[]): Promise<FileGraphNode> {
    await initParser();
    const tree = parser!.parse(code.content);
    if (!tree) throw new Error("Tree is undefined");
    return extractImportsExports(code, tree, allFiles);
}

export async function buildGraph(allFiles: FileContents[]): Promise<FileGraphNode[]> {
    const batchSize = 10;
    const result: FileGraphNode[] = [];

    for (let i = 0; i < allFiles.length; i += batchSize) {
        const batch = allFiles.slice(i, i + batchSize);
        const batchResults = await Promise.all(
            batch.map(file => parseCode(file, allFiles))
        );
        result.push(...batchResults);
    }

    return result;
}