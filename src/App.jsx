import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CategoryList from './pages/CategoryList';
import ItemDetail from './pages/ItemDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:category" element={<CategoryList />} />
        <Route path="/category/:category/:id" element={<ItemDetail />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
