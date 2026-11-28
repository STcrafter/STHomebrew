import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './context/ThemeContext.jsx';
import './App.css';

const Home = lazy(() => import('./pages/Home'));
const CategoryList = lazy(() => import('./pages/CategoryList'));
const ItemDetail = lazy(() => import('./pages/ItemDetail'));
const Constructor = lazy(() => import('./pages/Constructor'));

function App() {
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Suspense fallback={<div className="route-loading" role="status" aria-live="polite">Загрузка…</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:category" element={<CategoryList />} />
          <Route path="/category/:category/:id" element={<ItemDetail />} />
          <Route path="/constructor" element={<Constructor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
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
