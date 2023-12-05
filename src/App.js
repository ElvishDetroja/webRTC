import "./App.css";
import { Routes, Route } from "react-router-dom";
import Video from "./pages/video";
import Video2 from "./pages/video2";


function App() {
  return (
    <>
      <Routes>
        <Route path="/video" element={<Video />} />
        <Route path="/video2" element={<Video2 />} />
      </Routes>
    </>
  );
}

export default App;