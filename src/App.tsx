import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AppRoutes from "./core/AppRoutes";
import { FileProvider } from "./pages/Folders/FileContext";

function App() {
  return (
    <Router>
      <FileProvider>
        <AppRoutes />
      </FileProvider>
    </Router>
  );
}

export default App;
