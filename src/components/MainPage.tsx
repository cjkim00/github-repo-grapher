import { useState } from "react";
import { useGithubApi } from "../hooks/useGithubApi";
import { FileList } from "./FileList";
export function MainPage() {
    const [textboxText, setTextboxText] = useState<string>('');
    const testURL = "https://api.github.com/repos/cjkim00/whiteboard-app/git/trees/HEAD?recursive=1";
    
    const { response, files, validFiles, adjacencyList, fileGraphNodeMap, callGithubApi } = useGithubApi(testURL);
    function enterUrl() {
        callGithubApi(textboxText);
    }

    function editText(e: React.ChangeEvent<HTMLInputElement>) {
        setTextboxText((prev) => e.target.value);
        console.log(textboxText);
    }
    return (
        <div>
            <div>
                <input type="text" placeholder="Enter a Github URL" onChange={(e) => editText(e)}></input>
                <button onClick={enterUrl}>Enter</button>
                <button onClick={() => console.log(adjacencyList)}>Log Adjacency List</button>
                <button onClick={() => console.log(fileGraphNodeMap)}>Log File Graph Node Map</button>
            </div>

            <FileList
                adjacencyList={adjacencyList}
                fileGraphNodeMap={fileGraphNodeMap}
            />
        </div>
    );
}