import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import EventPage from './pages/EventPage';
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-blue-600 text-white shadow-md">
          <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-2xl font-bold">🎟️ Sistema de Reservas</h1>
          </div>
        </header>
        <main className="py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventPage />} />
          </Routes>
        </main>
        <footer className="bg-gray-200 text-center py-4 mt-8">
          <p className="text-sm text-gray-600">© 2026 Sistema de Reservas - Prueba Técnica</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;