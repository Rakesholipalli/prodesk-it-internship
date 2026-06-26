# AI Prompts Used

### Prompt 1:
What is the difference between `mongoose.connect()` and creating a connection manually with `mongoose.createConnection()`?

### Why I used it:
I wanted to understand the best way to connect to MongoDB Atlas and whether I needed multiple connections.

### What I learned:
`mongoose.connect()` creates a default connection that's used globally. For most apps, this is sufficient. `createConnection()` is only needed when managing multiple databases.

---

### Prompt 2:
How do I reference another model in Mongoose using ObjectId?

### Why I used it:
I needed to link Post documents to User documents but wasn't sure about the correct schema syntax.

### What I learned:
Use `type: mongoose.Schema.Types.ObjectId` with a `ref` property pointing to the model name. This sets up the relationship for population.

---

### Prompt 3:
What does `.populate()` do in Mongoose and when should I use it?

### Why I used it:
My Post queries were returning just the user ID, but I needed the full user details like name and email.

### What I learned:
`.populate('authorId', 'name email')` replaces the ObjectId with the actual user document. The second parameter lets you select specific fields.

---

### Prompt 4:
How do I sort and limit results in MongoDB queries?

### Why I used it:
I needed to implement the "Top 3 Most Recent Posts" aggregation feature but didn't know the Mongoose syntax.

### What I learned:
Chain `.sort({ createdAt: -1 })` for descending order and `.limit(3)` to get only 3 results. The -1 means newest first.

---

### Prompt 5:
What's the difference between `findByIdAndUpdate()` and `findByIdAndDelete()` in Mongoose?

### Why I used it:
I was refactoring from array methods to Mongoose and needed to understand the equivalent database operations.

### What I learned:
Both find a document by ID, but one updates it and one deletes it. Pass `{ new: true }` to `findByIdAndUpdate()` to return the updated document instead of the old one.

---

### Prompt 6:
How do I handle unique constraint errors in MongoDB?

### Why I used it:
My User model has a unique email field, and I was getting cryptic errors when trying to create duplicate users.

### What I learned:
MongoDB returns error code `11000` for duplicate key violations. I wrapped this in a try-catch and checked `error.code === 11000` to send a user-friendly message.

---

### Prompt 7:
What does `async/await` do and why is it needed for database operations?

### Why I used it:
All the Mongoose examples used `async/await` but I wasn't sure why it was necessary for every database call.

### What I learned:
Database operations are asynchronous — they take time to complete. `await` pauses execution until the Promise resolves, making the code readable and avoiding callback hell.

---

### Prompt 8:
How do I use environment variables with `dotenv` in Node.js?

### Why I used it:
I knew I shouldn't hardcode my MongoDB password in the code but wasn't sure how to securely store credentials.

### What I learned:
Create a `.env` file, add variables like `MONGO_URI=value`, then call `require('dotenv').config()` at the top of the file. Access values with `process.env.MONGO_URI`.

---

### Prompt 9:
What's the purpose of `.gitignore` and what should I include?

### Why I used it:
I was about to push to GitHub and realized my `.env` file with the MongoDB password would be exposed publicly.

### What I learned:
`.gitignore` tells Git which files to exclude. Always add `node_modules`, `.env`, and log files. This keeps secrets safe and reduces repo size.

---

### Prompt 10:
How do I handle connection errors when MongoDB Atlas refuses the connection?

### Why I used it:
My code was crashing immediately when the database connection failed, and I needed better error handling.

### What I learned:
Wrap `mongoose.connect()` in a try-catch block. Log the error message and call `process.exit(1)` to stop the server gracefully instead of leaving it in a broken state.
