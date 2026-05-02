import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './hooks/CartContext';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header/Header';
import MenuPage from './pages/MenuPage/MenuPage';
import ProductPage from './pages/ProductPage/ProductPage';
import CartPage from './pages/CartPage/CartPage';
import CouponsPage from './pages/CouponsPage/CouponsPage';
import LoginPage from './pages/LoginPage/LoginPage';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import './App.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="app">
          <Header />
          <Routes>
            <Route path="/" element={<MenuPage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/coupons" element={<CouponsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;

