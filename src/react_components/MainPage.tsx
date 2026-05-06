import { useState } from "react";
import { useGithubApi } from "../hooks/useGithubApi";
import { FileList } from "./FileList";
import { Graph } from "./Graph";
import { isUrlValid } from "../helpers/CheckIfUrlIsValid";
import { createGithubApiUrl } from "../helpers/CreateGithubApiUrl";
import { extractRepoName } from "../helpers/ExtractRepoName";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { EmptyFileList } from "./EmptyFileList";
import { EmptyGraph } from "./EmptyGraph";
import { useFilteredAdjacencyList } from "../hooks/useFilteredAdjacencyList";

export function MainPage() {
    const [textboxText, setTextboxText] = useState<string>('');
    const { response, files, validFiles, adjacencyList, fileGraphNodeMap, callGithubApi } = useGithubApi("");
    const [currentGraphFile, setCurrentGraphFile] = useState<string>("");
    const [showEmpty, setShowEmpty] = useState<boolean>(false);
    const filteredAdjacencyList = useFilteredAdjacencyList(adjacencyList, currentGraphFile);

    function enterUrl() {
        if (!isUrlValid(textboxText)) {
            console.log("url is invalid");
            return;
        }
        
        callGithubApi(textboxText);
        setShowEmpty((show) => true);
    }

    function editText(e: React.ChangeEvent<HTMLInputElement>) {
        setTextboxText(e.target.value);
    }

    return (
        <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: '10px' }}>
                {/*<button onClick={() => { setCurrentGraphFile(""); setSelectedNodeId(null); }}>Reset Graph</button>*/}
                <Field orientation="horizontal">
                    <Input type="search" placeholder="Enter a link to a Github repo" onChange={editText} />
                    <Button onClick={enterUrl} style={{ border: '1px solid #ccc' }}>Search</Button>
                </Field>
            </div>

            <div style={{ display: 'flex', width: "100%", flex: 1, minHeight: 0 }}>
                <div style={{ width: '350px', height: '100%', padding: '10px' }}>
                    {showEmpty ?
                        <FileList
                            adjacencyList={adjacencyList}
                            fileGraphNodeMap={fileGraphNodeMap}
                            setCurrentGraphFile={setCurrentGraphFile}
                            currentGraphFile={currentGraphFile}
                        />
                        :
                        <EmptyFileList />
                    }
                </div>
                <div style={{ width: '100%', height: '100%', padding: '10px' }}>
                    {showEmpty ?
                        <Graph
                            graphKey={JSON.stringify([...filteredAdjacencyList.keys()])}
                            adjacencyList={filteredAdjacencyList}
                            fileGraphNodeMap={fileGraphNodeMap}
                        />
                        :
                        <EmptyGraph />
                    }
                </div>
            </div>
        </div>
    );
}
