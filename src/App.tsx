import './App.css'
<<<<<<< HEAD
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
=======
import { useGithubApi } from './hooks/useGithubApi';
export default function App() {
  const {response, getRepoContents} = useGithubApi();
  const testURL = "https://api.github.com/repos/cjkim00/whiteboard-app/git/trees/HEAD?recursive=1";
  //console.log(getRepoContents(testURL));
  
  return (
    <>
      <button onClick={() => {
        console.log("button clicked");
        getRepoContents(testURL);
      }}>get repo</button>
    </>
  );
}
>>>>>>> 9a322bfdc8d17c3591bdd9ca6cb9258b9598ca11
