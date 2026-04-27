export type FileGraphNode = {
  fileName: string;       // used as the lookup key (no extension)
  displayName: string;    // shown in the UI (with extension)
  fileCode: string;
  fileSource: string;
  adjacencyArray: FileGraphNode[];
};