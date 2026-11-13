import { NavLink } from "react-router-dom";

function getUserName() {
  try {
    const user = JSON.parse(localStorage.getItem("gifthub_user") || "null");
    return user?.name || "GiftHub Member";
  } catch {
    return "GiftHub Member";
  }
}

function Navbar() {
  const userName = getUserName();

  const navItems = [
    { to: "/", label: "Home", icon: "⌂", end: true },
    { to: "/shop", label: "Shop", icon: "▣" },
    { to: "/cart", label: "Cart", icon: "🛒" },
    { to: "/orders", label: "My Orders", icon: "♡" },
    { to: "/admin", label: "Admin", icon: "♙" },
  ];

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
            <span className="site-nav-icon" aria-hidden="true">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="site-account">
        <span className="site-account-avatar" aria-hidden="true">●</span>
        <span className="site-account-name">{userName}</span>
      </div>
    </header>
  );
}

export default Navbar;