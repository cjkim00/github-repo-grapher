import { useState } from "react";
import type { FileGraphNode } from "../objects/FIleGraphNode";

interface FileProps {
    fileNode: FileGraphNode;
    onFileClick: (fileName: string) => void;
    isActive: boolean;
}

export function File({ fileNode, onFileClick, isActive }: FileProps) {
    const [showCode, setShowCode] = useState<boolean>(false);

    return (
        <div
            style={{
                backgroundColor: isActive ? "#a8d8ea" : "lightgray",
                margin: "10px",
                padding: "10px",
                borderRadius: "5px",
                cursor: "pointer",
                outline: isActive ? "2px solid #0077aa" : "none",
            }}
            onClick={() => onFileClick(fileNode.fileName)}
        >
            <span
                onClick={(e) => { e.stopPropagation(); setShowCode(s => !s); }}
                style={{ marginRight: "8px", fontSize: "0.8em", opacity: 0.6 }}
            >

            </span>
            {fileNode.fileName ?? "no file"}

            {showCode && (
                <pre style={{ textAlign: "left" }}>
                    <code>{fileNode.fileCode}</code>
                </pre>
            )}
        </div>
    );
}