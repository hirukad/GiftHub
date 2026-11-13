import { NavLink, useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";

function Navbar() {
  const navigate = useNavigate();
  useLocation(); // Re-check the saved user when the page changes.

  let currentUser = null;

  try {
    currentUser = JSON.parse(localStorage.getItem("gifthub_user"));
  } catch {
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

  const navItems = [
    { to: "/", label: "Home", icon: "⌂", end: true },
    { to: "/shop", label: "Shop", icon: "▣" },
    { to: "/cart", label: "Cart", icon: "🛒" },
    { to: "/orders", label: "My Orders", icon: "♡" },
  ];

  if (currentUser?.role === "admin") {
    navItems.push({ to: "/admin", label: "Admin", icon: "♙" });
  }

  if (currentUser === null) {
    navItems.push(
      { to: "/login", label: "Login" },
      { to: "/register", label: "Register" }
    );
  }

  return (
    <header className="site-header">
      <NavLink to="/" className="site-brand" aria-label="GiftHub home">
        <span className="site-brand-icon" aria-hidden="true">🎁</span>
        <span className="site-brand-name">GiftHub</span>
      </NavLink>

      <nav className="site-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `site-nav-link${isActive ? " is-active" : ""}`
            }
          >
            {item.icon && (
              <span className="site-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {currentUser && (
        <div className="site-account">
          <span className="site-account-avatar" aria-hidden="true">●</span>
          <span className="site-account-name">{currentUser.name}</span>
          <button
            className="layout-navbar-logout"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;