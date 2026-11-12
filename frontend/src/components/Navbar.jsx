import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="layout-navbar">
      <Link to="/" className="layout-navbar-logo">
        GiftHub
      </Link>

      <div className="layout-navbar-links">
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">My Orders</Link>
      </div>
    </nav>
  );
}

export default Navbar;