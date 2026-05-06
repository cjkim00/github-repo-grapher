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
        <div style={{width: '100%', height: '100%', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '5px' }}>
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