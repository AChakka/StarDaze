import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import Landing from './components/Landing'
import ParkMap from './components/ParkMap'
import StarVisualization from './components/StarVisualization'
import LoginHome from './components/LoginHome'


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/star-map" element={<StarVisualization />} />
        <Route path="/park-map" element={<ParkMap />} />
        <Route path="/login-home" element={<LoginHome />} />
      </Routes>
    </Router>
  );
}

export default App
