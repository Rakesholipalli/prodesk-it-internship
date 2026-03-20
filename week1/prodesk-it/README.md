# Prodesk IT Digital Agency

A landing page for a digital marketing agency built with HTML, Tailwind CSS, and vanilla JavaScript. Has dark mode, glassmorphism navbar, scroll animations, service modals, and a validated contact form.

## Screenshot

![Screenshot](screenshot.png)

## Features

- Responsive layout using Tailwind CSS Grid and Flexbox(works on mobile and desktop)
- Dark mode with localStorage and prefers-color-scheme support
- Sticky glassmorphism navbar with backdrop-filter blur
- Scroll reveal animations using IntersectionObserver
- Service cards with modal popups and dynamic content
- Contact form with native browser validation via setCustomValidity
- Hamburger menu with CSS transform animation

## Technologies Used

- HTML5 with semantic elements (header, main, section, article, footer)
- Tailwind CSS v3 compiled locally via CLI
- Vanilla JavaScript (DOM manipulation, IntersectionObserver, localStorage)

## How to Run

```bash
npx serve prodesk-it --listen 3000
```

Open `http://localhost:3000` in your browser.

## Live Demo

Live Demo: https://your-site.vercel.app

## Lighthouse Report

### Desktop
- Performance: 100  
- Accessibility: 100  

![Desktop Lighthouse](lighthouse-desktop.png)

---

### Mobile
- Performance: 100  
- Accessibility: 100  

![Mobile Lighthouse](lighthouse-mobile.png)
