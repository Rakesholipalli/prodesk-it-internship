# AI Prompts Used

### Prompt 1:
What is the difference between WebSocket and HTTP polling for real-time communication?

### Why I used it:
I was confused about why we need WebSockets when HTTP can also send requests. I needed to understand the fundamental difference.

### What I learned:
WebSockets maintain a persistent bidirectional connection, while HTTP polling repeatedly sends requests. WebSockets are much more efficient for real-time apps because the connection stays open.

---

### Prompt 2:
How does `socket.emit()` differ from `socket.broadcast.emit()` in Socket.io?

### Why I used it:
I was trying to send messages to all users but the sender was also receiving their own message twice. I needed to understand the broadcast options.

### What I learned:
`socket.emit()` sends to one client, `socket.broadcast.emit()` sends to all except sender, and `io.emit()` sends to everyone including sender. For typing indicators I used broadcast to exclude the sender.

---

### Prompt 3:
Why is my React component creating duplicate socket connections?

### Why I used it:
My messages were appearing twice and the server logs showed two connections from the same browser. I couldn't figure out why.

### What I learned:
React 18 StrictMode double-mounts components in development. I needed to add a cleanup function `return () => socket.disconnect()` in the useEffect to prevent duplicate connections.

---

### Prompt 4:
How do I implement room-based chat where messages only go to specific rooms?

### Why I used it:
I had basic messaging working globally but needed to isolate conversations by room. I wasn't sure how Socket.io rooms work.

### What I learned:
`socket.join(roomName)` subscribes a user to a room, and `io.to(roomName).emit()` broadcasts only to that room. It's built into Socket.io and handles all the routing automatically.

---

### Prompt 5:
What causes "CORS policy blocked" errors with WebSocket connections?

### Why I used it:
My phone couldn't connect to the server even though both were on the same WiFi. The browser console showed CORS errors.

### What I learned:
Socket.io needs explicit CORS configuration. Adding `cors: { origin: "*", methods: ["GET", "POST"] }` to the Server constructor fixed it. WebSocket CORS is separate from Express CORS.

---

### Prompt 6:
How do I implement a typing indicator that disappears after the user stops typing?

### Why I used it:
I wanted to show "User is typing..." but needed it to auto-hide after 1 second of inactivity. I wasn't sure how to debounce this properly.

### What I learned:
Use `setTimeout()` and clear it with `clearTimeout()` on each keystroke. Set a 1000ms timeout to emit `typing: false`. This creates a debounce effect without any library.

---

### Prompt 7:
Why does `currentRoom` state not update immediately when I try to use it?

### Why I used it:
When switching rooms, the leave-room event wasn't being sent because `currentRoom` was already empty. State wasn't available when I needed it.

### What I learned:
React state updates are asynchronous. I used `useRef` to track the current room immediately without waiting for re-renders. Refs update synchronously and persist across renders.

---

### Prompt 8:
How do I format timestamps to show readable time like "11:30:45 AM"?

### Why I used it:
My messages had ISO timestamps like `2026-08-07T05:30:45.123Z` which looked technical. I wanted user-friendly time format.

### What I learned:
`new Date(timestamp).toLocaleTimeString()` converts to readable format automatically. It handles AM/PM and respects user's locale. No manual parsing needed.

---

### Prompt 9:
What's the best way to distinguish own messages from others in a chat UI?

### Why I used it:
All messages looked the same. I needed to style my messages differently (like WhatsApp with green bubbles vs white bubbles).

### What I learned:
Check `msg.username === username` in the render and add a CSS class like `own-message`. Then use CSS to align right and change background color. Simple conditional rendering.

---

### Prompt 10:
How do I make my React development server accessible from my phone on the same network?

### Why I used it:
I could access localhost:3000 on my computer but needed to test the chat on my phone browser. I didn't know how to expose the dev server.

### What I learned:
Set `HOST=0.0.0.0` in the npm start script and use your computer's IP address (from `ipconfig`). Then access `http://192.168.x.x:3000` from phone. Both devices need same WiFi.
