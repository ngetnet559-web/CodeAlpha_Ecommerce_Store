import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";

function App() {
  return (
    <BrowserRouter>
      <Routes>
  <Route path="/products" element={<Products />} />
  <Route path="/products/:id" element={<ProductDetails />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/" element={<Navigate to="/products" replace />} />
</Routes>
    </BrowserRouter>
  );
}

export default App;