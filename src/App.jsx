import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import ItemDetail from './pages/ItemDetail';
import Constructor from './pages/Constructor'; // ← импорт

function App() {
  return (
    <BrowserRouter basename="/STHomebrew">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryList />} />
        <Route path="/category/:category/:id" element={<ItemDetail />} />
        <Route path="/constructor" element={<Constructor />} /> {/* ← новый маршрут */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
