import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <div className="layout-app">
      <Navbar />

      <main className="layout-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />

          <Route
            path="/checkout"
            element={<ProtectedRoute><Checkout /></ProtectedRoute>}
          />
          <Route
            path="/orders"
            element={<ProtectedRoute><MyOrders /></ProtectedRoute>}
          />
          <Route
            path="/admin"
            element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>}
          />

          <Route path="*" element={<p>Page not found or not built yet.</p>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;