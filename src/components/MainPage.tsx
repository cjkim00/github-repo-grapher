import { useState } from "react";
import { useGithubApi } from "../hooks/useGithubApi";
export function MainPage() {
    const [textboxText, setTextboxText] = useState<string>('');
    const testURL = "https://api.github.com/repos/cjkim00/whiteboard-app/git/trees/HEAD?recursive=1";
    const { response, files, validFiles, adjacencyList,
        getRepoFiles, getRepoFileContents, setValidFiles,
        parseCode, extractValidFiles, buildGraph, buildAdjacencyList } = useGithubApi(testURL);
    function enterUrl() {

    }
    return (
        <div>
            <input type="text" placeholder="Enter a Github URL"></input>
            <button onClick={() => enterUrl}>Enter</button>
        </div>
    );
}