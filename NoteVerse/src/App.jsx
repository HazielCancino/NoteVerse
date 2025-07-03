// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './components/HomePage';
import NotesApp from './components/NotesApp';
import ThemeService from './services/themeService.js';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await ThemeService.initialize();
        setIsLoading(false);
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#102542] to-[#1a3a5c] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <h2 className="text-white text-xl font-semibold">Loading NoteVerse...</h2>
          <p className="text-white/80 mt-2">Preparing your workspace</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#102542] to-[#1a3a5c] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl font-semibold mb-4">Error Loading App</h2>
          <p className="text-white/80 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-[#f87060] text-white px-4 py-2 rounded-lg hover:bg-[#e55a45] transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/notes" element={<NotesApp />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;