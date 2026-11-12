import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  useLocation(); // makes the Navbar re-check the user on every page change

  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem("gifthub_user"));
  } catch (error) {
    currentUser = null;
  }

  async function handleLogout() {
    try {
      await api.post("auth/logout.php");
    } catch (error) {
      console.log("Logout request failed:", error);
    } finally {
      localStorage.removeItem("gifthub_user");
      navigate("/login");
    }
  }

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

        {currentUser !== null && currentUser.role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}

        {currentUser === null ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="layout-navbar-username">{currentUser.name}</span>
            <button className="layout-navbar-logout" onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;