import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import './App.css';

const ROOMS = ['General', 'Tech Support', 'Random'];

function App() {
  const [socket, setSocket] = useState(null);
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [currentRoom, setCurrentRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentRoomRef = useRef('');

  // socket connection
  useEffect(() => {
    const serverUrl = process.env.REACT_APP_SERVER_URL || 'http://localhost:4000';
    const newSocket = io(serverUrl);
    
    newSocket.on('connect', () => {
      setSocket(newSocket);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // socket events
  useEffect(() => {
    if (!socket) return;

    socket.on('receive-message', (payload) => {
      setMessages(prev => [...prev, { type: 'message', ...payload }]);
    });

    socket.on('user-joined-room', (data) => {
      setMessages(prev => [...prev, { type: 'system', ...data }]);
    });

    socket.on('user-left-room', (data) => {
      setMessages(prev => [...prev, { type: 'system', ...data }]);
    });

    socket.on('user-typing', ({ username, isTyping }) => {
      setTypingUsers(prev => {
        if (isTyping) {
          return prev.includes(username) ? prev : [...prev, username];
        }
        return prev.filter(user => user !== username);
      });
    });

    socket.on('room-joined', ({ room }) => {
      setCurrentRoom(room);
      currentRoomRef.current = room;
    });

    return () => {
      socket.off('receive-message');
      socket.off('user-joined-room');
      socket.off('user-left-room');
      socket.off('user-typing');
      socket.off('room-joined');
    };
  }, [socket]);

  // auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      socket.emit('user-joined', { username: username.trim() });
      setIsConnected(true);
    }
  };

  const handleJoinRoom = (room) => {
    const previousRoom = currentRoomRef.current;
    
    if (previousRoom) {
      socket.emit('leave-room', { room: previousRoom, username });
    }

    setMessages([]);
    setTypingUsers([]);
    socket.emit('join-room', { room, username });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (message.trim() && currentRoom) {
      socket.emit('send-message', {
        room: currentRoom,
        message: message.trim(),
        username
      });
      
      setMessage('');
      setIsTyping(false);
      
      socket.emit('typing', {
        room: currentRoom,
        username,
        isTyping: false
      });
    }
  };

  const handleTyping = (e) => {
    const inputValue = e.target.value;
    setMessage(inputValue);

    if (!socket || !currentRoom) return;

    if (!isTyping) {
      setIsTyping(true);
      socket.emit('typing', {
        room: currentRoom,
        username,
        isTyping: true
      });
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      socket.emit('typing', {
        room: currentRoom,
        username,
        isTyping: false
      });
    }, 1000);
  };

  // username screen
  if (!isConnected) {
    return (
      <div className="app">
        <div className="username-container">
          <div className="username-card">
            <h1>🚀 WebSocket Chat Room</h1>
            <p>Enter your username to start chatting</p>
            <form onSubmit={handleUsernameSubmit}>
              <input
                type="text"
                placeholder="Enter username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                autoFocus
              />
              <button type="submit">Join Chat</button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // room selection
  if (!currentRoom) {
    return (
      <div className="app">
        <div className="room-selection">
          <div className="room-card">
            <h1>👋 Welcome, {username}!</h1>
            <p>Select a room to join:</p>
            <div className="room-buttons">
              {ROOMS.map(room => (
                <button
                  key={room}
                  onClick={() => handleJoinRoom(room)}
                  className="room-button"
                >
                  <span className="room-icon">
                    {room === 'General' ? '💬' : room === 'Tech Support' ? '🛠️' : '🎲'}
                  </span>
                  {room}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // chat interface
  return (
    <div className="app">
      <div className="chat-container">
        <div className="chat-header">
          <div className="header-left">
            <h2>#{currentRoom}</h2>
            <span className="username-badge">@{username}</span>
          </div>
          <div className="header-right">
            <button onClick={() => setCurrentRoom('')} className="change-room-btn">
              Change Room
            </button>
          </div>
        </div>

        <div className="messages-container">
          {messages.length === 0 && (
            <div className="empty-state">
              <p>No messages yet. Start the conversation!</p>
            </div>
          )}
          
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.type === 'system' ? 'system-message' : ''} ${
                msg.username === username ? 'own-message' : ''
              }`}
            >
              {msg.type === 'system' ? (
                <div className="system-text">
                  <span>ℹ️ {msg.message}</span>
                </div>
              ) : (
                <div className="message-content">
                  <div className="message-header">
                    <span className="message-username">{msg.username}</span>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-text">{msg.message}</div>
                </div>
              )}
            </div>
          ))}
          
          {typingUsers.length > 0 && (
            <div className="typing-indicator">
              <span>
                ✍️ {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        <div className="input-container">
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder={`Message #${currentRoom}...`}
              value={message}
              onChange={handleTyping}
              autoFocus
            />
            <button type="submit" disabled={!message.trim()}>
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
