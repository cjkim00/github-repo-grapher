import type { FileGraphNode } from "../objects/FIleGraphNode";
import { File } from "./File";
interface FileListProps {
    adjacencyList: Map<string, string[]>;
    fileGraphNodeMap: Map<string, FileGraphNode>;
}

export function FileList({ adjacencyList, fileGraphNodeMap }: FileListProps) {
    console.log("file list");
    console.log(adjacencyList);
    console.log(fileGraphNodeMap);
    return (
        <div>
            <p>File List</p>
            {
                Array.from(adjacencyList.keys()).map((fileName) => (
                    <File 
                        key = {fileName}
                        fileNode={fileGraphNodeMap.get(fileName)!}
                    />
                ))
            }
        </div>
    );
}