import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home/Home";
import DocumentationPage from "./components/Documentation/DocumentationPage";

function App() {
  return (
    <Router>
      <div className="w-full min-h-screen bg-black">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/docs" element={<DocumentationPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
