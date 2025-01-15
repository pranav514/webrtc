import "./App.css";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import Sender from "./components/Sender";
import Reciver from "./components/Reciver";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sender" element={<Sender />} />
        <Route path="/reciver" element={<Reciver />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
