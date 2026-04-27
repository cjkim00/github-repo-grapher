import type { FileGraphNode } from "../objects/FIleGraphNode";
import { File } from "./File";

interface FileListProps {
    adjacencyList: Map<string, FileGraphNode[]>;
    fileGraphNodeMap: Map<string, FileGraphNode>;
    setCurrentGraphFile: (fileName: string) => void;
    currentGraphFile: string;
}

export function FileList({ adjacencyList, fileGraphNodeMap, setCurrentGraphFile, currentGraphFile }: FileListProps) {
    return (
        <div style={{width: '350px', maxHeight: '95vh', overflowY: 'auto', padding: '10px', borderRight: '1px solid #ccc'}}>
            {Array.from(adjacencyList.keys()).sort((a, b) => a.localeCompare(b)).map((fileName) => (
                <File
                    key={fileGraphNodeMap.get(fileName)!.fileSource}
                    fileNode={fileGraphNodeMap.get(fileName)!}
                    setCurrentGraphFile={setCurrentGraphFile}
                    isActive={fileName === currentGraphFile}
                />
            ))}
        </div>
    );
}