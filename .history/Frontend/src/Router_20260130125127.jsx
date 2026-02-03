import { Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import SortTestEngine from "./components/test_engine/sortTestEngine.jsx";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/test" element={<SortTestEngine />} />
    </Routes>
  );
}
