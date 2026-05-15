# ShopZone - E-Commerce Store

A complete Level 3 e-commerce application built with React, featuring routing, global state management, persistent cart, and protected routes.

## Features Implemented

### Level 1: Navigation Structure ✅
- **Routes Setup**: BrowserRouter with multiple routes
  - `/` - Home page with welcome banner
  - `/shop` - Product grid fetched from API
  - `/contact` - Static contact form
- **Dynamic Routing**: Product detail pages at `/product/:id`
- **useParams Hook**: Fetches specific product data based on URL parameter

### Level 2: Global State (Cart) ✅
- **Context API**: CartContext wraps entire application
- **Add to Cart**: Button on product detail page adds items to global cart
- **Navbar Badge**: Cart icon with live item count on all pages
- **Cart Page**: `/cart` route displays all items with total price calculation
- **Cart Features**:
  - Quantity controls (increase/decrease)
  - Remove items
  - Clear entire cart
  - Real-time total calculation

### Level 3: Auth & Persistence ✅
- **Persistent Cart**: Cart syncs with localStorage - survives page refresh
- **Authentication System**:
  - Login page at `/login`
  - "Login as Guest" button
  - Custom username option
  - User state persisted in localStorage
- **Protected Routes**:
  - `/checkout` page is protected
  - Redirects to `/login` if not authenticated
  - Returns to intended page after login

## Additional Features

- **Responsive Design**: Mobile-friendly layout
- **Product Features**:
  - Image gallery with thumbnails
  - Discount badges
  - Rating display
  - Stock information
  - Product metadata
- **Checkout Page**: Complete order form with success message
- **Contact Page**: Functional contact form with validation
- **Error Handling**: Loading states and error messages
- **Navigation**: Smooth routing with React Router Link components

## Tech Stack

- React 18
- React Router DOM v6
- Context API for state management
- localStorage for persistence
- DummyJSON API for product data
- CSS3 for styling

## Installation

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## Deployment

The project includes a `vercel.json` file to handle SPA routing on Vercel:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

This prevents 404 errors when refreshing on dynamic routes.

## Project Structure

```
shopzone/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Navbar.css
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   ├── CartContext.jsx
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Home.jsx & Home.css
│   │   ├── Shop.jsx & Shop.css
│   │   ├── ProductDetail.jsx & ProductDetail.css
│   │   ├── Cart.jsx & Cart.css
│   │   ├── Contact.jsx & Contact.css
│   │   ├── Login.jsx & Login.css
│   │   └── Checkout.jsx & Checkout.css
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── vercel.json
└── package.json
```

## Key Implementation Details

### Cart Context
- Manages cart state globally
- Provides functions: addToCart, removeFromCart, updateQuantity, clearCart
- Calculates total price and item count
- Syncs with localStorage on every change

### Auth Context
- Manages user authentication state
- Provides functions: login, logout
- Persists user data in localStorage
- Exposes isAuthenticated boolean

### Protected Routes
- Checks authentication status
- Redirects to login if not authenticated
- Preserves intended destination for post-login redirect

## API Integration

Uses DummyJSON API:
- Product list: `https://dummyjson.com/products?limit=30`
- Single product: `https://dummyjson.com/products/{id}`

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This is a demo project for educational purposes.
