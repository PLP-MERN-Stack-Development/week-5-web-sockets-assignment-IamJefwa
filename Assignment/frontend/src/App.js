import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import NoteEditor from './pages/NoteEditor';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/notes/:roomId" component={NoteEditor} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;