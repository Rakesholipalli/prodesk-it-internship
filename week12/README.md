# WebSocket Real-Time Chat Room

A real-time bidirectional communication application built with Socket.io, Node.js, and React.

---

## Features

- Real-time bidirectional messaging
- Multiple isolated chat rooms
- Live typing indicators
- User join/leave notifications
- Room switching
- Session identity management
- Cross-device support (desktop & mobile)

---

## Tech Used

**Backend:** Node.js, Express.js, Socket.io  
**Frontend:** React 18, Socket.io-client  
**Protocol:** WebSocket (Socket.io)  
**Styling:** CSS3

---

## How to Run

### Step 1: Install Dependencies

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### Step 2: Start the Server

```bash
npm run server
```

Server will start on `http://localhost:4000`

### Step 3: Start the Client (New Terminal)

```bash
cd client
npm start
```

Client will start on `http://localhost:3000`

### Step 4: Test the Application

- **Browser 1:** Open `http://localhost:3000`
- **Browser 2:** Open `http://localhost:3000` (incognito mode)
- Enter usernames and join the same room to chat!

---

## Live Demo

Live Demo: 

