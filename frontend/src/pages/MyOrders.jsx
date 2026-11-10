import { useEffect, useState } from "react";
import api from "../services/api";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await api.get("orders/get_orders.php");
        if (response.data.success) {
          setOrders(response.data.data);
        } else {
          setError(response.data.message);
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
    return <p>Loading your orders...</p>;
  }

  return (
    <div>
      <h1>My Orders</h1>
      {error && <p>{error}</p>}
      {!error && orders.length === 0 && <p>You have no orders yet.</p>}
      {orders.length > 0 && (
        <ul>
          {orders.map((order) => (
            <li key={order.order_id}>
              <p>Order #{order.order_id}</p>
              <p>Date: {order.order_date}</p>
              <p>Total: {Number(order.total).toFixed(2)}</p>
              <p>Status: {order.status}</p>
              <p>Delivery to: {order.delivery_name}, {order.delivery_address}</p>
              <p>Phone: {order.phone}</p>
              <p>Payment: {order.payment_method}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyOrders;