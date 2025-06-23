# 🎯 Objective

## 1. Setting Up a Real-Time Server with Socket.io

[Repo](https://github.com/PLP-Full-Stack-Development-MERN/week-5-real-time-communication-with-socket-io-Machuge27.git)

- Understand the fundamentals of real-time communication.
- Learn how WebSockets work and how Socket.io enhances real-time applications.

## 🛠️ Step 1: What is Real-Time Communication?

Real-Time Communication (RTC) refers to the instantaneous exchange of data between users, devices, or systems without noticeable delay.

### Examples of Real-Time Applications

- **Messaging apps**: WhatsApp, Slack  
- **Live notifications**: Stock market updates, sports scores  
- **Collaborative tools**: Google Docs  

### Traditional HTTP vs. WebSockets

#### HTTP:
- Client requests data → Server responds → Connection closes.

#### WebSockets:
- Persistent connection between client and server enabling bi-directional communication.

### How WebSockets Work

1. Client sends a handshake request.  
2. Server acknowledges and upgrades to WebSocket.  
3. Both parties can now send messages asynchronously.

## 🛠️ Step 2: What is Socket.io?

Socket.io is a JavaScript library that simplifies WebSocket implementation by providing features such as:

- Automatic reconnection  
- Event-based communication  
- Room management for group interactions  
- Cross-browser compatibility  

## 🚧 Hands-On Activities

- **Concept Mapping**: Create a diagram showing the difference between HTTP and WebSocket connections.  
- **Discussion Prompt**: How would WebSockets improve performance for collaborative tools like Google Docs?  

# 🎯 Objective

## 2. Set up a Node.js Express server integrated with Socket.io.

## 🛠️ Step 1: Install Dependencies

### Create a New Project:

```bash
mkdir socket-io-app
cd socket-io-app
npm init -y
```

### Install Required Packages:

```bash
npm install express socket.io dotenv cors
```

## 🛠️ Step 2: Create Project Structure

```
socket-io-app/
├── server.js
├── .env
├── package.json
├── README.md
```

## 🛠️ Step 3: Configure the Express Server

### Create `server.js`:

```javascript
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

server.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
```

### Create `.env` File:

```
PORT=5000
```

### Run the Server:

```bash
node server.js
```

## 🚧 Hands-On Activities

- Test the server by connecting multiple clients using a WebSocket client tool.
- Modify the code to emit a welcome message to users upon connection.

[![alt text](images/image-1.png)](https://youtu.be/1BfCnjr_Vjg)

# Building a Real-Time Chat Application

## 🎯 Objective

## 3. Create a simple chat feature using Socket.io.

---

## 🛠️ Step 1: Create the Frontend with React

### Initialize React App

```bash
npx create-react-app frontend
cd frontend
npm install socket.io-client
```

### Update `src/App.jsx`

```jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
    const [message, setMessage] = useState('');
    const [chat, setChat] = useState([]);

    useEffect(() => {
        socket.on('message', (msg) => setChat((prevChat) => [...prevChat, msg]));
        return () => socket.disconnect();
    }, []);

    const sendMessage = () => {
        socket.emit('message', message);
        setMessage('');
    };

    return (
        <div>
            <h2>Chat App</h2>
            <div>
                {chat.map((msg, idx) => (
                    <p key={idx}>{msg}</p>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
}

export default App;
```

---

## 🛠️ Step 2: Handle Messages on the Server

### Modify `server.js`

```javascript
io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        io.emit('message', msg);
    });
});
```

---

## 🛠️ Step 3: Running the Full Application

### Start the Backend Server

```bash
node server.js
```

### Start the Frontend

```bash
cd frontend
npm start
```

### Visit

Open [http://localhost:3000](http://localhost:3000) to test the chat application.

# 🎯 Objective

## 4. Understand advanced features like rooms and namespaces.

## 🛠️ Step 1: Implementing Rooms

Rooms allow users to join specific channels for targeted communication.

### Modify `server.js`:

```javascript
io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.join(room);
        socket.to(room).emit('message', `User joined room: ${room}`);
    });

    socket.on('message', ({ room, msg }) => {
        io.to(room).emit('message', msg);
    });
});
```

### Update Frontend to Join Rooms:

```javascript
const joinRoom = (room) => {
    socket.emit('joinRoom', room);
};
```

## 🛠️ Step 2: Using Namespaces

Namespaces allow segmentation of logic for different use cases within the same server.

### Add Namespace to `server.js`:

```javascript
const chatNamespace = io.of('/chat');

chatNamespace.on('connection', (socket) => {
    socket.on('message', (msg) => {
        chatNamespace.emit('message', msg);
    });
});
```

### Connect to Namespace on Frontend:

```javascript
const chatSocket = io('http://localhost:5000/chat');
```

# Session 1

[Content Coverage](https://drive.google.com/file/d/1l2gmtRJBH9N1Md-muFf_G5JW3NW-9gkh/view?usp=sharing)

# Session 2

[Afternoon Session](https://drive.google.com/file/d/1OJlBprFB8BvI3YTPo_z5EOBUC4MmcFAu/view?usp=sharing)