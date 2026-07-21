import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import ItemDetail from './pages/ItemDetail';
import Constructor from './pages/Constructor';
import { useTheme } from './context/ThemeContext.jsx';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter basename="/STHomebrew">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryList />} />
        <Route path="/category/:category/:id" element={<ItemDetail />} />
        <Route path="/constructor" element={<Constructor />} />
      </Routes>
      <button 
        onClick={toggleTheme} 
        className="theme-toggle"
        aria-label="Переключить тему"
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </BrowserRouter>
  );
}

export default App;
