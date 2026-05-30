import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Favorites from './pages/Favorites';
import MoodMatcher from './pages/MoodMatcher';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/mood-matcher" element={<MoodMatcher />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
