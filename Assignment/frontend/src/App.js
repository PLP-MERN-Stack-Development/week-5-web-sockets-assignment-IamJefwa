import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NoteEditor from './pages/NoteEditor';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/notes/:roomId" element={<NoteEditor />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;