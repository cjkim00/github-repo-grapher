export interface FileGraphNode {
    fileName: string,
    fileCode: string,
    fileSource: string, //Basically a replacement for an ID
    adjacencyArray: FileGraphNode[]

}