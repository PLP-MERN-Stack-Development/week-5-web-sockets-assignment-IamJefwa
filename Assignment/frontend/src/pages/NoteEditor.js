import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt();

const NoteEditor = () => {
  const { roomId } = useParams();
  const [note, setNote] = useState(null);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState('');
  const [showUserForm, setShowUserForm] = useState(true);
  
  const socketRef = useRef();
  const lastSavedContentRef = useRef('');
  
  // Connect to Socket.io and fetch note data
  useEffect(() => {
    if (showUserForm) return;
    
    // Connect to Socket.io server
    socketRef.current = io('http://localhost:5000');
    
    // Join the room
    socketRef.current.on('connect', () => {
      setConnected(true);
      socketRef.current.emit('join-room', roomId);
    });
    
    // Listen for user joined event
    socketRef.current.on('user-joined', (userId) => {
      console.log(`User joined: ${userId}`);
    });
    
    // Listen for room users event
    socketRef.current.on('room-users', (users) => {
      setUsers(users);
    });
    
    // Listen for user left event
    socketRef.current.on('user-left', (userId) => {
      console.log(`User left: ${userId}`);
      setUsers(prev => prev.filter(id => id !== userId));
    });
    
    // Listen for note updates
    socketRef.current.on('note-updated', (updatedContent) => {
      setContent(updatedContent);
      lastSavedContentRef.current = updatedContent;
    });
    
    // Fetch note data
    const fetchNote = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/notes/${roomId}`);
        setNote(response.data);
        setTitle(response.data.title);
        setContent(response.data.content);
        lastSavedContentRef.current = response.data.content;
        setLoading(false);
      } catch (err) {
        setError('Failed to load note');
        setLoading(false);
      }
    };
    
    fetchNote();
    
    // Clean up
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [roomId, showUserForm]);
  
  // Handle content changes
  const handleContentChange = (e) => {
    const newContent = e.target.value;
    setContent(newContent);
    
    // Emit change to others
    if (socketRef.current) {
      socketRef.current.emit('note-update', {
        roomId,
        content: newContent
      });
    }
    
    // Save to database after a delay
    debounceSave(newContent);
  };
  
  // Debounce save function
  const debounceSave = useRef(
    debounce(async (content) => {
      try {
        await axios.patch(`http://localhost:5000/api/notes/${roomId}`, {
          content
        });
        lastSavedContentRef.current = content;
      } catch (err) {
        console.error('Error saving note:', err);
      }
    }, 1000)
  ).current;
  
  // Handle title change
  const handleTitleChange = async (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    try {
      await axios.patch(`http://localhost:5000/api/notes/${roomId}`, {
        title: newTitle
      });
    } catch (err) {
      console.error('Error updating title:', err);
    }
  };
  
  // Handle username submit
  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUserForm(false);
    }
  };
  
  if (showUserForm) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl mb-4">Enter Your Name</h2>
          <form onSubmit={handleUsernameSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your name"
              className="w-full p-2 border rounded mb-4"
              required
            />
            <button 
              type="submit" 
              className="w-full bg-blue-500 text-white py-2 rounded"
            >
              Join Note
            </button>
          </form>
        </div>
      </div>
    );
  }
  
  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-center p-4 text-red-500">{error}</div>;
  
  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          className="text-2xl font-bold border-b border-gray-300 focus:outline-none focus:border-blue-500 p-1 mr-2 flex-grow"
        />
        <div className="flex items-center">
          <div className="mr-4">
            <span className="text-sm text-gray-600 mr-2">
              {connected ? 
                <span className="text-green-500">Connected</span> : 
                <span className="text-red-500">Disconnected</span>
              }
            </span>
            <span className="text-sm text-gray-600">
              Users online: {users.length}
            </span>
          </div>
          <button
            onClick={() => setPreview(!preview)}
            className={`px-3 py-1 rounded text-sm ${
              preview ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex">
          {users.map((user, index) => (
            <div 
              key={index} 
              className="mr-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
            >
              {user === socketRef.current?.id ? `${username} (you)` : `User ${index + 1}`}
            </div>
          ))}
        </div>
      </div>
      
      {preview ? (
        <div 
          className="border p-4 rounded min-h-[300px] markdown-preview"
          dangerouslySetInnerHTML={{ __html: md.render(content) }}
        ></div>
      ) : (
        <textarea
          value={content}
          onChange={handleContentChange}
          className="w-full border p-4 rounded min-h-[300px] font-mono"
          placeholder="Start typing your note..."
        ></textarea>
      )}
      
      <div className="mt-4 text-right text-sm text-gray-500">
        <p>Room ID: {roomId}</p>
        <p>Share this URL to collaborate in real-time</p>
      </div>
    </div>
  );
};

// Debounce helper function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default NoteEditor;