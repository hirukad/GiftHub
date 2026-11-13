
import { useState } from "react";
import api from "../services/api";
import { loadCart } from "../services/cartStorage";
import "./Checkout.css";

const PAYMENT_METHOD = "COD";

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

  // Calculate cart total
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  // Handle input changes
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // Submit order
  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    if (!form.delivery_name.trim() ||
        !form.delivery_address.trim() ||
        !form.phone.trim()) {
      setError("Please fill in all delivery details.");
      return;
    }

    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    const phone = form.phone.trim();

if (!/^(?:\+94|0)?7[0-9]{8}$/.test(phone)) {
  setError("Please enter a valid Sri Lankan mobile number.");
  return;
}

    const items = cart.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      custom_name: item.custom_name || "",
      custom_message: item.custom_message || "",
    }));

    const orderData = {
      delivery_name: form.delivery_name,
      delivery_address: form.delivery_address,
      phone: form.phone,
      payment_method: PAYMENT_METHOD,
      items,
    };

    try {
      setSubmitting(true);

      const response = await api.post(
        "orders/create_order.php",
        orderData
      );

      if (response.data.success) {
        setOrderId(response.data.data.order_id);

        // Clear cart after successful order
        localStorage.removeItem("gifthub_cart");
      } else {
        setError(response.data.message || "Unable to place order.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Order success screen
  if (orderId) {
    return (
      <div className="checkout-page">
        <div className="checkout-success">
          <div className="success-icon">✓</div>

          <h1>Order Placed Successfully!</h1>

          <p>
            Thank you for shopping with GiftHub.
            Your order has been received.
          </p>

          <div className="success-order-id">
            Order ID: #{orderId}
          </div>

          <p className="success-payment">
            Payment Method: Cash on Delivery
          </p>

          <a href="/orders" className="checkout-success-button">
            View My Orders
          </a>
        </div>
      </div>
    );
  }

  // Empty cart screen
  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-empty">
          <div className="empty-cart-icon">🛒</div>

          <h1>Your Cart is Empty</h1>

          <p>Add some lovely gifts before proceeding to checkout.</p>

          <a href="/shop" className="checkout-back-button">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">

        <div className="checkout-heading">
          <p className="checkout-subtitle">ALMOST THERE!</p>
          <h1>Checkout</h1>
          <p>Complete your delivery details to place your order.</p>
        </div>

        <div className="checkout-layout">

          {/* Delivery Details */}
          <div className="checkout-form-card">
            <h2>Delivery Information</h2>
            <p className="checkout-card-description">
              Where should we deliver your gift?
            </p>

            <form onSubmit={handleSubmit}>

              <div className="checkout-form-group">
                <label htmlFor="delivery_name">Full Name</label>

                <input
                  type="text"
                  id="delivery_name"
                  name="delivery_name"
                  placeholder="Enter your full name"
                  value={form.delivery_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-form-group">
                <label htmlFor="phone">Phone Number</label>

                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-form-group">
                <label htmlFor="delivery_address">Delivery Address</label>

                <textarea
                  id="delivery_address"
                  name="delivery_address"
                  placeholder="Enter your complete delivery address"
                  rows="4"
                  value={form.delivery_address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="checkout-payment">
                <h3>Payment Method</h3>

                <div className="checkout-payment-option">
                  <span className="payment-icon">💵</span>

                  <div>
                    <strong>Cash on Delivery</strong>
                    <p>Pay when your order arrives.</p>
                  </div>

                  <span className="payment-check">✓</span>
                </div>
              </div>

              {error && (
                <div className="checkout-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="checkout-place-order"
                disabled={submitting}
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>

            </form>
          </div>

          {/* Order Summary */}
          <div className="checkout-summary-card">
            <h2>Order Summary</h2>

            <p className="checkout-card-description">
              Review your selected gifts.
            </p>

            <div className="checkout-summary-items">
              {cart.map((item, index) => (
                <div
                  className="checkout-summary-item"
                  key={item.product_id || index}
                >
                  <div className="checkout-item-info">
                    <strong>{item.name}</strong>

                    <span>
                      Quantity: {item.quantity}
                    </span>

                    {item.custom_name && (
                      <span>Recipient: {item.custom_name}</span>
                    )}
                  </div>

                  <strong className="checkout-item-price">
                    Rs.{" "}
                    {(
                      Number(item.price) * Number(item.quantity)
                    ).toLocaleString("en-LK")}
                  </strong>
                </div>
              ))}
            </div>

            <div className="checkout-summary-total">
              <span>Total</span>

              <strong>
                Rs. {total.toLocaleString("en-LK")}
              </strong>
            </div>

            <div className="checkout-summary-note">
              <span>🎁</span>
              <p>Your perfect gift is just one step away!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Checkout;
