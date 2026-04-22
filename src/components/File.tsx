import { useState } from "react";
import type { FileGraphNode } from "../objects/FIleGraphNode";
interface FileProps {
    fileNode: FileGraphNode
}
export function File({ fileNode }: FileProps) {
    const [showCode, setShowCode] = useState<boolean>(false);
    return (

        <div 
        style={{ backgroundColor: "lightgray", margin: "10px", padding: "10px", borderRadius: "5px" }}
        onClick={() => setShowCode((state) => !state)}
        >
            {fileNode.fileName ?? "no file"}

            {showCode &&
                <pre style={{ textAlign: "left" }}>
                    <code>
                        {fileNode.fileCode}
                    </code>
                </pre>
            }
        </div>
    );
}