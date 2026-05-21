# AI Prompts Used

### Prompt 1:
How does React Hook Form differ from useState for managing form data?

### Why I used it:
I was building the multi-step wizard and wasn't sure if I should use useState for each field or try a form library. I'd heard React Hook Form was better for performance but didn't understand why.

### What I learned:
React Hook Form uses uncontrolled components, which means it doesn't re-render the entire component on every keystroke like useState does. It registers inputs using refs and only triggers validation when needed. This is way more efficient for large forms.

---

### Prompt 2:
What's the difference between Zod and Yup for form validation?

### Why I used it:
The sprint requirements mentioned using Zod or Yup, but I didn't know which one to pick or how they actually work with React Hook Form.

### What I learned:
Both are schema validation libraries. Zod is TypeScript-first and has better type inference. You define rules once (like `z.string().min(8)`) and Zod checks your data against those rules. The `@hookform/resolvers` package connects Zod to React Hook Form automatically.

---

### Prompt 3:
How do I validate specific fields before allowing navigation to the next step?

### Why I used it:
My Next button was letting users proceed even with empty fields. I needed to validate only the current step's fields, not the entire form.

### What I learned:
React Hook Form has a `trigger()` method that validates specific fields on demand. You pass it an array like `['firstName', 'lastName']` and it returns true/false. Perfect for step-by-step validation before changing the step state.

---

### Prompt 4:
What does mode: 'onChange' do in React Hook Form?

### Why I used it:
The requirements said "real-time validation" but by default my errors only showed after clicking submit. I wasn't sure how to make them appear while typing.

### What I learned:
The `mode` option controls when validation runs. `'onChange'` validates on every keystroke, `'onBlur'` validates when you leave the field, and `'onSubmit'` (default) only validates on submit. For real-time feedback, onChange is the right choice.

---

### Prompt 5:
How does conditional rendering work with unmounting components in React?

### Why I used it:
When I used `{step === 1 && <StepOne />}` to show different steps, I was worried the form data would disappear when the component unmounted.

### What I learned:
React Hook Form stores data internally, not in the component's state. Even when StepOne unmounts and StepTwo renders, the form values persist because they're managed by the `useForm` hook in the parent component. That's why the Back button works without losing data.

---

### Prompt 6:
What's the correct regex pattern for email validation?

### Why I used it:
I knew I needed to check for the @ symbol, but I wanted a proper regex that also validates the domain part (like `.com`).

### What I learned:
The pattern `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` breaks down as: start of string, one or more non-space/non-@ characters, an @, more characters, a dot, and more characters. It's not perfect but catches most invalid emails.

---

### Prompt 7:
How do I store and retrieve user data from localStorage in React?

### Why I used it:
I needed to save registered users so the login system could check if they exist. I'd used localStorage before but wasn't sure about the JSON parsing part.

### What I learned:
`localStorage.setItem('key', JSON.stringify(data))` saves objects as strings. `JSON.parse(localStorage.getItem('key') || '[]')` retrieves and parses them, with a fallback to an empty array if nothing exists. Always parse because localStorage only stores strings.

---

### Prompt 8:
What's the difference between .refine() and .regex() in Zod?

### Why I used it:
I needed to check if passwords match, but `.regex()` only works for single fields. I wasn't sure how to compare two fields.

### What I learned:
`.regex()` validates a single field's format. `.refine()` is for custom logic that needs access to multiple fields. You pass it a function that receives the entire data object, so you can compare `data.password === data.confirmPassword` and set a custom error path.

---

### Prompt 9:
How do I format dates in JavaScript to show "January 15, 2024" instead of "2024-01-15"?

### Why I used it:
The date input gives dates in YYYY-MM-DD format, but the requirements said to show them in a more professional format on the review page.

### What I learned:
`new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })` converts the date to a readable format. The options object lets you control exactly how it displays.

---

### Prompt 10:
What's the best way to structure authentication flow in a React app without a backend?

### Why I used it:
I needed to implement Register → Login → Dashboard flow but wasn't sure how to manage the different screens and check if a user is logged in.

### What I learned:
Use state variables like `showLogin`, `showRegister`, and `loggedInUser` to control which component renders. Check localStorage on login to verify credentials. Use conditional rendering at the top level: if `loggedInUser` exists, show the dashboard; otherwise show login or register based on the state flags.
