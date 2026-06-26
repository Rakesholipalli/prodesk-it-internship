# Sprint 10 MongoDB API

A blog post management API with MongoDB Atlas integration featuring relational data modeling and aggregation queries.

---

## Features

- MongoDB Atlas cloud database integration
- Relational schema with User and Post models
- Author data population using .populate()
- Aggregation query for top 3 recent posts
- Full CRUD operations (Create, Read, Update, Delete)
- Environment variable security with .env

---

## Tech Used

Node.js, Express.js, MongoDB Atlas, Mongoose ODM, dotenv, cors

---

## How to Run

```bash
cd week10
npm install
```

Create a `.env` file with your MongoDB Atlas connection string:
```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Then start the server:
```bash
npm start
```

Server will run on `http://localhost:5000`

> Note: Requires MongoDB Atlas account and active cluster.

## Live Demo

Live Demo: https://your-render-deployment-url.onrender.com/
