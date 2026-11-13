import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-logo">
            <span aria-hidden="true">🎁</span> GiftHub
          </Link>
          <p>Create · Gift · Share</p>
          <p>Thoughtful gifts for the people who matter.</p>
        </div>

        <div className="site-footer-links">
          <h2>Explore</h2>
          <Link to="/">Home</Link>
          <Link to="/shop">Shop gifts</Link>
          <Link to="/cart">Your cart</Link>
          <Link to="/orders">My orders</Link>
        </div>

        <div className="site-footer-note">
          <h2>Make it personal</h2>
          <p>Find a gift that makes every special moment memorable.</p>
        </div>
      </div>

      <div className="site-footer-bottom">
        <span>© 2026 GiftHub</span>
        <span>Made for meaningful moments</span>
      </div>
    </footer>
  );
}

export default Footer;