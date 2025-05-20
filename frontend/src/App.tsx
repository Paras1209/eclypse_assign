import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import Navbar from './components/Navbar'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">Hello World</h1>
        </main>
      </div>
    </Router>
  )
}

export default App
