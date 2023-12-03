import './App.css';
import { Routes, Route} from "react-router-dom"
import React from 'react';
import Homepage from './pages/Homepage/Homepage';
import Dashboard from "./pages/Dashboard/Dashboard";


function App() {
  return ( 
    <Routes>
      <Route index element={<Homepage />} />
      <Route path="/" element={<Homepage />} />
      <Route path="/dashboard"  element={<Dashboard />} />
    </Routes>
  );
}

export default App;