import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const HomePage = () => {
  const [notes, setNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/notes');
        setNotes(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching notes:', error);
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  const createNewNote = async () => {
    if (!newNoteTitle.trim()) return;
    
    const roomId = uuidv4();
    try {
      const response = await axios.post('http://localhost:5000/api/notes', {
        title: newNoteTitle,
        roomId
      });
      setNotes([...notes, response.data]);
      setNewNoteTitle('');
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Real-Time Collaborative Notes</h1>
      
      <div className="mb-6">
        <h2 className="text-xl mb-2">Create New Note</h2>
        <div className="flex">
          <input
            type="text"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
            placeholder="Enter note title"
            className="border p-2 rounded mr-2 flex-grow"
          />
          <button 
            onClick={createNewNote}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create
          </button>
        </div>
      </div>
      
      <div>
        <h2 className="text-xl mb-2">Your Notes</h2>
        {loading ? (
          <p>Loading...</p>
        ) : notes.length > 0 ? (
          <ul className="border rounded divide-y">
            {notes.map((note) => (
              <li key={note._id} className="p-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{note.title}</span>
                  <div>
                    <span className="text-sm text-gray-500 mr-4">
                      Last updated: {new Date(note.updatedAt).toLocaleString()}
                    </span>
                    <Link 
                      to={`/notes/${note.roomId}`}
                      className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                    >
                      Open
                    </Link>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes yet. Create one to get started!</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;