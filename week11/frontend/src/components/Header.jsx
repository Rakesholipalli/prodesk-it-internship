import { Rocket } from 'lucide-react';

function Header() {
  return (
    <header className="app-header">
      <h1>
        <Rocket size={32} style={{ display: 'inline', marginRight: '12px' }} />
        MERN Post Management System
      </h1>
    </header>
  );
}

export default Header;
