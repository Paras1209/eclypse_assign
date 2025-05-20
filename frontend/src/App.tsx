import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './components/Home'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black px-12">
        <Navbar />
        <Home />
      </div>
    </Router>
  )
}

export default App
