# AI Prompts Used

### Prompt 1:
What's the difference between `app.use()` and `app.get()` in Express?

### Why I used it:
I was confused about when to use middleware versus route handlers, especially for the logger function.

### What I learned:
`app.use()` runs on every request and is for middleware, while `app.get()` only runs on GET requests to specific routes. Middleware must call `next()` to pass control.

---

### Prompt 2:
Why is `req.body` returning undefined when I POST JSON data?

### Why I used it:
My POST /posts endpoint kept receiving undefined even though I was sending JSON from Thunder Client.

### What I learned:
Express doesn't parse JSON automatically. You need `app.use(express.json())` before your routes to enable the JSON body parser middleware.

---

### Prompt 3:
How to format JavaScript Date to 12-hour time with AM/PM?

### Why I used it:
I needed to log timestamps in a readable format like "10:05 AM" instead of 24-hour time.

### What I learned:
`toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })` gives you the exact format. The `hour12: true` option is the key part.

---

### Prompt 4:
What HTTP status code should I return when creating a new resource?

### Why I used it:
I wasn't sure if POST should return 200 or something else when successfully creating a blog post.

### What I learned:
201 Created is the correct status for successful POST requests that create new resources. 200 OK is for general success but 201 is more specific.

---

### Prompt 5:
How does `Array.filter()` work in JavaScript?

### Why I used it:
I needed to delete a blog post from the array but wasn't sure how to remove a specific item by ID.

### What I learned:
`filter()` creates a new array with items that pass a test. For deletion, you keep everything that DOESN'T match the ID: `posts.filter(p => p.id !== targetId)`.

---

### Prompt 6:
Should I use `var`, `let`, or `const` for variables in modern JavaScript?

### Why I used it:
I kept seeing different variable declarations and wasn't sure which one to use for my blog posts array.

### What I learned:
Never use `var` anymore. Use `const` by default for values that don't change, and `let` only when you need to reassign (like filtering the posts array).

---

### Prompt 7:
How to generate a mock JWT token string in Node.js?

### Why I used it:
The Phase 3 requirements needed a mock authentication endpoint that returns a JWT-like token.

### What I learned:
JWTs have three base64-encoded parts separated by dots. I can fake one using `Buffer.from(JSON.stringify(data)).toString('base64')` for the payload section.

---

### Prompt 8:
What's the difference between `parseInt()` and just using the string ID directly?

### Why I used it:
My `req.params.id` was a string but I was comparing it to numeric IDs in the array, and nothing matched.

### What I learned:
Route parameters are always strings. Use `parseInt(req.params.id)` to convert "1" to 1 before comparing, or use `===` comparison after converting.

---

### Prompt 9:
How do I update only specific fields in an object without overwriting the rest?

### Why I used it:
For PUT /posts/:id, I wanted users to update just the title OR just the content, not require both fields.

### What I learned:
Check each field individually with `if (title) post.title = title`. This way you only update what's provided and leave other fields unchanged.

---

### Prompt 10:
What port number should I use for a local Express server?

### Why I used it:
I wasn't sure if there was a standard port for development servers or if I could pick any number.

### What I learned:
Common choices are 3000, 5000, or 8080. Port 5000 is popular and won't conflict with most other services. Ports below 1024 require admin privileges.

---
