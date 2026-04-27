import { useState, useMemo } from "react";
import { useGithubApi } from "../hooks/useGithubApi";
import { FileList } from "./FileList";
import { Graph } from "./Graph";
import { isUrlValid } from "../helpers/CheckIfUrlIsValid";
import { createGithubApiUrl } from "../helpers/CreateGithubApiUrl";
import { extractRepoName } from "../helpers/ExtractRepoName";
import extractGithubFileNameFromPath from "../helpers/ExtractGithubFileName";
import type { FileGraphNode } from "../objects/FIleGraphNode";

export function MainPage() {
    const [textboxText, setTextboxText] = useState<string>('');
    const testURL = "https://api.github.com/repos/excalidraw/excalidraw/git/trees/HEAD?recursive=1";
    const { response, files, validFiles, adjacencyList, fileGraphNodeMap, callGithubApi } = useGithubApi(testURL);
    const [currentGraphFile, setCurrentGraphFile] = useState<string>("");
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    const filteredAdjacencyList = useMemo(() => {
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

    function enterUrl() {
        if(!isUrlValid(textboxText)) {
            console.log("url is invalid");
            return;
        }
        const { user, repoName } = extractRepoName(textboxText);
        const apiUrl = createGithubApiUrl(user, repoName);
        callGithubApi(apiUrl);
    }

    function editText(e: React.ChangeEvent<HTMLInputElement>) {
        setTextboxText(e.target.value);
    }

    function setGraphData(fileName: string) {
        setCurrentGraphFile(fileName);
    }

    

    return (
        <div>
            <div>
                <input type="text" placeholder="Enter a Github URL" onChange={editText} />
                <button onClick={enterUrl}>Enter</button>
                <button onClick={() => { setCurrentGraphFile(""); setSelectedNodeId(null); }}>Reset Graph</button>

            </div>

            <div style={{display:'flex'}}>
                <FileList
                    adjacencyList={adjacencyList}
                    fileGraphNodeMap={fileGraphNodeMap}
                    setCurrentGraphFile={setCurrentGraphFile}
                    currentGraphFile={currentGraphFile}
                />

                <Graph
    graphKey={JSON.stringify([...filteredAdjacencyList.keys()])}
    adjacencyList={filteredAdjacencyList}
    fileGraphNodeMap={fileGraphNodeMap}
    selectedNodeId={selectedNodeId}
    setSelectedNodeId={setSelectedNodeId}
/>
            </div>
        </div>
    );
}

function createGithubApiUrlFromRepoUrl(textboxText: string) {
    throw new Error("Function not implemented.");
}
