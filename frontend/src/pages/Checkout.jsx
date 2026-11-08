import { useState } from "react";
import api from "../services/api";

const CART_KEY = "gifthub_cart";
const PAYMENT_METHOD = "COD"; // decided by Member 1

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function Checkout() {
  const [cart] = useState(loadCart);
  const [form, setForm] = useState({
    delivery_name: "",
    delivery_address: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (
      !form.delivery_name.trim() ||
      !form.delivery_address.trim() ||
      !form.phone.trim()
    ) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setSubmitting(true);

    const payload = {
      delivery_name: form.delivery_name.trim(),
      delivery_address: form.delivery_address.trim(),
      phone: form.phone.trim(),
      payment_method: PAYMENT_METHOD,
      items: cart.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        custom_name: item.custom_name || "",
        custom_message: item.custom_message || "",
      })),
    };

    try {
      const response = await api.post("orders/create_order.php", payload);
      if (response.data.success) {
        localStorage.removeItem(CART_KEY);
        setOrderId(response.data.data.order_id);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Please log in to place your order.");
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Could not place the order. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  if (orderId) {
    return (
      <div>
        <h1>Order placed</h1>
        <p>Thank you! Your order number is #{orderId}.</p>
        <p>Payment: Cash on delivery</p>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div>
        <h1>Checkout</h1>
        <p>Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Checkout</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="delivery_name"
            value={form.delivery_name}
            onChange={handleChange}
            maxLength={100}
          />
        </div>
        <div>
          <label>Address</label>
          <textarea
            name="delivery_address"
            value={form.delivery_address}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            maxLength={20}
          />
        </div>
        <p>Payment method: Cash on delivery</p>
        {error && <p>{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Placing order..." : "Place order"}
        </button>
      </form>
    </div>
  );
}

export default Checkout;