import { useState, useMemo } from "react";
import { useGithubApi } from "../hooks/useGithubApi";
import { FileList } from "./FileList";
import { Graph } from "./Graph";

export function MainPage() {
    const [textboxText, setTextboxText] = useState<string>('');
    const testURL = "https://api.github.com/repos/cjkim00/whiteboard-app/git/trees/HEAD?recursive=1";
    const { response, files, validFiles, adjacencyList, fileGraphNodeMap, callGithubApi } = useGithubApi(testURL);
    const [currentGraphFile, setCurrentGraphFile] = useState<string>("");

    const filteredAdjacencyList = useMemo(() => {
        if (!currentGraphFile) return adjacencyList;

        const neighbors = adjacencyList.get(currentGraphFile) ?? [];
        const relevantFiles = new Set([currentGraphFile, ...neighbors]);

        const filtered = new Map<string, string[]>();
        for (const file of relevantFiles) {
            const edges = (adjacencyList.get(file) ?? []).filter(n => relevantFiles.has(n));
            filtered.set(file, edges);
        }
        return filtered;
    }, [currentGraphFile, adjacencyList]);

    function enterUrl() {
        callGithubApi(textboxText);
    }

    function editText(e: React.ChangeEvent<HTMLInputElement>) {
        setTextboxText(e.target.value);
    }

    return (
        <div>
            <div>
                <input type="text" placeholder="Enter a Github URL" onChange={editText} />
                <button onClick={enterUrl}>Enter</button>
                <button onClick={() => setCurrentGraphFile("")}>Reset Graph</button>
                <button onClick={() => console.log(adjacencyList)}>Log Adjacency List</button>
                <button onClick={() => console.log(fileGraphNodeMap)}>Log File Graph Node Map</button>
            </div>

            {currentGraphFile && (
                <p>Showing neighbors of: <strong>{currentGraphFile}</strong></p>
            )}

            <FileList
                adjacencyList={adjacencyList}
                fileGraphNodeMap={fileGraphNodeMap}
                onFileClick={setCurrentGraphFile}
                currentGraphFile={currentGraphFile}
            />

            <Graph
                adjacencyList={filteredAdjacencyList}
                fileGraphNodeMap={fileGraphNodeMap}
            />
        </div>
    );
}