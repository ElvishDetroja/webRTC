import "./App.css";
import { Routes, Route } from "react-router-dom";
import Video from "./pages/video";

function App() {
  return (
    <>
      <Routes>
        <Route path="/video" element={<Video />} />
      </Routes>
    </>
  );
}

export default App;