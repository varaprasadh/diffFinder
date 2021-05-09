import logo from './logo.svg';
import './App.css';
import file1 from "./helpers/DiffFinder/__test__/mock_data/mock_package_original.json"
import file2 from "./helpers/DiffFinder/__test__/mock_data/mock_package_modified.json";


import DiffFinder from "./helpers/DiffFinder/index";
import { useEffect, useState } from 'react';

function App() {
  const [segments, setSegments] = useState([]);

  useEffect(()=>{
    const originalContent = "varaprasadskjsgkj";
    const modifiedContent = "varaprasadh";

    const finder = new DiffFinder();
    const diffSegments = finder.getDiff(originalContent, modifiedContent);
    setSegments(diffSegments);
  },[])

  const generateMarkup = (segments = []) => {
    const JSX = segments.map(segment => {
      return (
        <span key={segment.key} className={segment.type}>
          {segment.content}
        </span>
      )
    })
    return JSX;
  }
  

  return (
    <div className="App">
      {generateMarkup(segments)}
    </div>
  );
}

export default App;
