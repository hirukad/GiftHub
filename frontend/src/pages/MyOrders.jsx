
import { useEffect, useState } from "react";
import api from "../services/api";
import "./MyOrders.css";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get("orders/get_orders.php");

        if (response.data.success) {
          setOrders(response.data.data || []);
        } else {
          setError(response.data.message || "Could not load orders.");
        }
      } catch (err) {
        if (err.response && err.response.status === 401) {
          setError("Please log in to see your orders.");
        } else {
          setError("Could not load your orders. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="my-orders-page">
        <div className="orders-message-card">
          <div className="orders-loading"></div>
          <h2>Loading Your Orders</h2>
          <p>Please wait while we get your order history.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders-page">
      <div className="my-orders-container">

        <div className="my-orders-heading">
          <p className="orders-subtitle">YOUR GIFT JOURNEY</p>
          <h1>My Orders</h1>
          <p>Keep track of all your lovely gifts and purchases.</p>
        </div>

        {error && (
          <div className="orders-message-card orders-error">
            <div className="orders-message-icon">!</div>
            <h2>Unable to Load Orders</h2>
            <p>{error}</p>
          </div>
        )}

        {!error && orders.length === 0 && (
          <div className="orders-message-card">
            <div className="orders-message-icon">🎁</div>
            <h2>No Orders Yet</h2>
            <p>
              You haven't placed any orders yet.
              Your next perfect gift is waiting!
            </p>
            <a href="/shop" className="orders-shop-button">
              Start Shopping
            </a>
          </div>
        )}

        {!error && orders.length > 0 && (
          <>
            <div className="orders-count">
              <span>Order History</span>
              <span className="orders-count-number">
                {orders.length} {orders.length === 1 ? "Order" : "Orders"}
              </span>
            </div>

            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order.order_id}>

                  <div className="order-card-header">
                    <div>
                      <p className="order-label">ORDER ID</p>
                      <h2>#{order.order_id}</h2>
                    </div>

                    <span className="order-status">
                      {order.status}
                    </span>
                  </div>

                  <div className="order-date">
                    <span>Order Date</span>
                    <strong>{order.order_date}</strong>
                  </div>

                  <div className="order-divider"></div>

                  <div className="order-details-grid">

                    <div className="order-detail">
                      <span>Delivery Name</span>
                      <strong>{order.delivery_name}</strong>
                    </div>

                    <div className="order-detail">
                      <span>Phone Number</span>
                      <strong>{order.phone}</strong>
                    </div>

                    <div className="order-detail order-address">
                      <span>Delivery Address</span>
                      <strong>{order.delivery_address}</strong>
                    </div>

                    <div className="order-detail">
                      <span>Payment Method</span>
                      <strong>{order.payment_method}</strong>
                    </div>

                  </div>

                  <div className="order-card-footer">
                    <span>Order Total</span>
                    <strong>
                      Rs. {Number(order.total).toLocaleString("en-LK", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </strong>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default MyOrders;
