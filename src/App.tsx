import './App.css'
import { MainPage } from './components/MainPage';

export default function App() {
  return (
    <>
      <MainPage />
    </>
  );

  /**
   * 
   * <>
      <button onClick={() => {
        extractValidFiles(files, setValidFiles);
      }}>get repo</button>

      <button onClick={() => {
        console.log(validFiles);
      }}>get valid files</button>

      <button onClick={() => {
        getFileContents();
      }}>get file</button>

      <button onClick={handleParseCode}>Parse Code</button>

      <button onClick={() => {
        buildAdjacencyList(fileGraphNodes);
        console.log(adjacencyList);
      }}>Build Adjacency List</button>
    </>
   */
}
