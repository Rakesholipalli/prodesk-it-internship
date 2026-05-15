# AI Prompts Used

### Prompt 1:
How do I set up React Router v6 with dynamic routes and useParams?

### Why I used it:
I knew I needed routing for the product pages, but the v6 syntax was different from tutorials I'd seen using v5.

### What I learned:
`useParams()` returns an object with the URL parameters. For `/product/:id`, you destructure it as `const { id } = useParams()`. Also learned that `<Routes>` replaced `<Switch>` in v6.

---

### Prompt 2:
What's the correct pattern for syncing React state with localStorage?

### Why I used it:
My cart was disappearing on page refresh, and I wasn't sure if I should use useEffect or handle it differently.

### What I learned:
Initialize state with a function that reads from localStorage, then use `useEffect` with the state as a dependency to auto-save changes. The effect runs after every state update, keeping them in sync.

---

### Prompt 3:
How does Context API work and when should I use it over prop drilling?

### Why I used it:
I needed the cart data in multiple components (Navbar, Cart page, Product page) and passing props through every level felt messy.

### What I learned:
Create context with `createContext()`, wrap your app in a Provider, and consume it with `useContext()`. Custom hooks like `useCart()` make it even cleaner — you just call the hook instead of importing useContext everywhere.

---

### Prompt 4:
What's the difference between controlled and uncontrolled inputs in React forms?

### Why I used it:
My contact form inputs weren't updating properly when I typed, and I was getting console warnings.

### What I learned:
Controlled inputs use `value={state}` and `onChange={handler}` — React controls the input value. The state is the single source of truth, which makes validation and submission way easier.

---

### Prompt 5:
How do I create a protected route that redirects to login in React Router v6?

### Why I used it:
The checkout page needed authentication, but I wasn't sure how to implement route guards without the old `<Redirect>` component.

### What I learned:
Create a wrapper component that checks auth state and returns either `<Navigate to="/login" />` or the children. Wrap protected routes with it: `<Route element={<ProtectedRoute><Checkout /></ProtectedRoute>} />`.

---

### Prompt 6:
What's the best way to fetch data from an API in React with loading and error states?

### Why I used it:
My product list was showing nothing while loading, and errors were crashing the app instead of showing a message.

### What I learned:
Use three states: `loading`, `error`, and `data`. Wrap the fetch in try-catch with async/await, and always set loading to false in a `finally` block so it runs whether the request succeeds or fails.

---

### Prompt 7:
How do I prevent "Can't perform a React state update on an unmounted component" warning?

### Why I used it:
After placing an order, I was getting this warning in the console when the redirect happened.

### What I learned:
If you use `setTimeout` in a component, return a cleanup function from `useEffect` that clears it: `return () => clearTimeout(id)`. This prevents the timeout from trying to update state after the component unmounts.

---

### Prompt 8:
What's the difference between Link and anchor tags in React Router?

### Why I used it:
My cart was emptying when I clicked navigation links, and I couldn't figure out why the state was resetting.

### What I learned:
`<a>` tags cause full page reloads, which destroys all React state. Always use `<Link>` from React Router for internal navigation — it updates the URL without reloading, keeping your state intact.

---

### Prompt 9:
How do I fix 404 errors on page refresh when deploying a React SPA to Vercel?

### Why I used it:
I knew SPAs have this issue where refreshing on `/product/5` gives a 404 because the server doesn't know about client-side routes.

### What I learned:
Create a `vercel.json` with a rewrite rule: `{"rewrites": [{"source": "/(.*)", "destination": "/"}]}`. This tells Vercel to serve `index.html` for all paths, letting React Router handle the routing.

---

### Prompt 10:
How do I calculate cart totals using reduce in JavaScript?

### Why I used it:
I was using a for loop to sum prices and quantities, but it felt clunky and I'd heard reduce was better for this.

### What I learned:
`cart.reduce((total, item) => total + item.price * item.quantity, 0)` — the accumulator starts at 0 and adds each item's subtotal. Way cleaner than a loop with a counter variable.
