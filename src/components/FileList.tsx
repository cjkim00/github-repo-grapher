import type { FileGraphNode } from "../objects/FIleGraphNode";
import { File } from "./File";

interface FileListProps {
    adjacencyList: Map<string, string[]>;
    fileGraphNodeMap: Map<string, FileGraphNode>;
    onFileClick: (fileName: string) => void;
    currentGraphFile: string;
}

export function FileList({ adjacencyList, fileGraphNodeMap, onFileClick, currentGraphFile }: FileListProps) {
    return (
        <div>
            <p>File List</p>
            {Array.from(adjacencyList.keys()).map((fileName) => (
                <File
                    key={fileName}
                    fileNode={fileGraphNodeMap.get(fileName)!}
                    onFileClick={onFileClick}
                    isActive={fileName === currentGraphFile}
                />
            ))}
        </div>
    );
}