import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="logo">
        CINE-STREAM
      </Link>
      <nav className="nav">
        <Link
          to="/"
          className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/favorites"
          className={`nav-link ${location.pathname === '/favorites' ? 'active' : ''}`}
        >
          Favorites
        </Link>
        <Link
          to="/mood-matcher"
          className={`nav-link ${location.pathname === '/mood-matcher' ? 'active' : ''}`}
        >
          AI Mood Matcher
        </Link>
      </nav>
    </header>
  );
};

export default Header;
