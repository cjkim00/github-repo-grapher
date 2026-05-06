export type FileGraphNode = {
  fileName: string;
  displayName: string;
  fileCode: string;
  fileSource: string;
  adjacencyArray: FileGraphNode[];
};