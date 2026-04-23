import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Navbar from './components/Navbar';
import CartDrawer from './components/CartDrawer';
import Cursor from './components/Cursor';
import GridBackground from './components/GridBackground';
import Home from './pages/Home';
import Checkout from './pages/Checkout';
import Chat from './pages/Chat';
import Pay from './pages/Pay';
import AuthCallback from './pages/AuthCallback';
import Dashboard from './pages/Dashboard';
import './index.css';

function Layout() {
  const { pathname } = useLocation();
  const hideCart = ['/checkout', '/chat', '/pay', '/auth'].some(p => pathname.startsWith(p));
  return (
    <>
      <Navbar />
      {!hideCart && <CartDrawer />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/chat/:orderId" element={<Chat />} />
        <Route path="/pay/:orderId" element={<Pay />} />
        <Route path="/auth" element={<AuthCallback />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <GridBackground />
        <Cursor />
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<Layout />} />
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
}
