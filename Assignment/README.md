# Real-Time Collaborative Notes

A real-time collaborative note-taking application built with the MERN stack and Socket.io. This application allows multiple users to create, edit, and preview notes in real-time.

## Features

- Real-time collaborative editing
- Markdown support with live preview
- Room-based collaboration
- User presence indicators
- Persistent note storage

## Technologies Used

- **Frontend**: React, Socket.io-client
- **Backend**: Node.js, Express, Socket.io, MongoDB
- **Additional Libraries**: Markdown-it for Markdown rendering

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd real-time-notes
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Create a `.env` file in the backend directory:
```
MONGO_URI=mongodb://localhost:27017/real-time-notes
PORT=5000
```

### Running the Application

1. Start MongoDB server (if not already running)

2. Start the backend server:
```bash
cd backend
npm run dev
```

3. Start the frontend development server:
```bash
cd frontend
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## How It Works

### Real-Time Communication

This application uses Socket.io to enable real-time communication between clients and the server. Here's how it works:

1. When a user joins a note, they connect to a specific Socket.io room identified by the note's roomId.
2. Each change made by a user is instantly broadcasted to all other users in the same room.
3. The server uses room-based communication to ensure that updates are only sent to users who are viewing the same note.

### Collaborative Editing

- Changes are propagated in real-time to all connected clients
- Debounced saving ensures that changes are persisted to the database without overloading the server
- Markdown preview allows users to see how the formatted note will look

### User Presence

- The application tracks users joining and leaving rooms
- Updates the UI to display the current number of connected users

## Project Structure

```
real-time-notes/
├── backend/
│   ├── models/
│   │   └── Note.js
│   ├── routes/
│   │   └── notes.js
│   ├── server.js
│   └── package.json
└── frontend/
    ├── public/
    ├── src/
    │   ├── pages/
    │   │   ├── HomePage.js
    │   │   └── NoteEditor.js
    │   ├── App.js
    │   └── index.js
    └── package.json
```

## Future Enhancements

- User authentication and authorization
- Cursor position tracking for multiple users
- History/version control for notes
- Rich text editing options
- Offline mode with synchronization


