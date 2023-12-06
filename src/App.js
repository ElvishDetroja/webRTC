import "./App.css";
import { Routes, Route } from "react-router-dom";
import Video from "./pages/video";
import Video2 from "./pages/video2";
import Video3 from "./pages/video3";
import Audio from './pages/audio';

function App() {
  return (
    <>
      <Routes>
        <Route path="/video" element={<Video />} />
        <Route path="/video2" element={<Video2 />} />
        <Route path="/video3" element={<Video3 />} />
        <Route path="/audio" element={<Audio />} />
      </Routes>
    </>
  );
}

export default App;
