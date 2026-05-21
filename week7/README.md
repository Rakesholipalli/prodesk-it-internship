# Registration Wizard

A multi-step authentication system with enterprise-grade form validation built with React.js.

---

## Features

- Multi-step registration wizard with 3 steps (Personal Info, Account Details, Review)
- Real-time form validation with error messages
- Password strength validation (8+ chars, uppercase, lowercase, number)
- Password visibility toggle with eye icons
- Email format validation with regex
- Age verification (18+ years old)
- Progress bar showing current step
- State persistence across navigation (Back button retains data)
- User already exists check
- Login system with credential validation
- Welcome dashboard with personalized greeting
- LocalStorage persistence — registered users survive page refresh
- Professional date formatting (e.g., "February 21, 2008")
- Conditional button disabling until fields are valid
- Success screen after registration
- Responsive design with gradient backgrounds

---

## Tech Used

React, React Hook Form, Zod, lucide-react, JavaScript, CSS Gradients, LocalStorage

---

## How to Run

```bash
cd registration-wizard
npm install
npm start
```

Then open `http://localhost:3000` in your browser.

---

## Project Structure

```
src/
├── components/
│   ├── ProgressBar.jsx       # Dynamic step indicator
│   ├── StepOne.jsx            # Personal info form (name, DOB)
│   ├── StepTwo.jsx            # Account details (email, password)
│   ├── StepThree.jsx          # Review and submit screen
│   ├── SuccessScreen.jsx      # Post-registration success page
│   ├── LoginPage.jsx          # User login form
│   ├── WelcomeBack.jsx        # Dashboard after login
│   ├── StepForm.css           # Shared form styles
│   ├── ProgressBar.css        # Progress bar styles
│   ├── SuccessScreen.css      # Success page styles
│   ├── LoginPage.css          # Login page styles
│   └── WelcomeBack.css        # Dashboard styles
├── validationSchema.js        # Zod validation schemas
├── App.js                     # Root component — state, routing, auth flow
├── App.css                    # Main app styles with gradients
└── index.css                  # Global reset and base styles
```

---

## Live Demo

Live Demo: [Your Deployment URL Here]
