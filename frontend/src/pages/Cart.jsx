
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadCart, saveCart } from "../services/cartStorage";
import "./Cart.css";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState(() => loadCart() || []);

  // Update cart and localStorage
  const updateCart = (updatedItems) => {
    setCartItems(updatedItems);
    saveCart(updatedItems);
  };

  // Remove an item
  const removeItem = (productId) => {
    const updatedItems = cartItems.filter(
      (item) => item.product_id !== productId
    );

    updateCart(updatedItems);
  };

  // Change item quantity
  const changeQuantity = (productId, amount) => {
    const updatedItems = cartItems.map((item) => {
      if (item.product_id === productId) {
        return {
          ...item,
          quantity: Math.max(1, Number(item.quantity || 1) + amount),
        };
      }

      return item;
    });

    updateCart(updatedItems);
  };

  // Update personalisation fields
  const updatePersonalisation = (productId, field, value) => {
    const updatedItems = cartItems.map((item) => {
      if (item.product_id === productId) {
        return {
          ...item,
          [field]: value,
        };
      }

      return item;
    });

    updateCart(updatedItems);
  };

  // Calculate total
  const total = cartItems.reduce((sum, item) => {
    return sum + Number(item.price || 0) * Number(item.quantity || 1);
  }, 0);
  const totalItems = cartItems.reduce((sum, item) => {
  return sum + Number(item.quantity || 1);
}, 0);

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-heading">
          <h1>Shopping Cart</h1>
          <p>Review your gifts before checkout.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="cart-empty">
            <h2>Your cart is empty</h2>
            <p>You haven't added any gifts yet.</p>

            <button
              className="cart-shop-button"
              onClick={() => navigate("/shop")}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="cart-layout">

            <div className="cart-items">
              {cartItems.map((item) => (
                <div className="cart-item" key={item.product_id}>

                  <div className="cart-item-top">
                    <img
                      src={
                      item.image
                        ? item.image.startsWith("http") ||
                          item.image.startsWith("/")
                          ? item.image
                          : `/images/${item.image}`
                        : "/placeholder.png"
                    }
                      alt={item.name}
                      className="cart-item-image"
                    />

                    <div className="cart-item-details">
                      <h3>{item.name}</h3>

                      <p className="cart-item-price">
                        Rs. {Number(item.price || 0).toFixed(2)}
                      </p>

                      <div className="cart-quantity">
                        <span>Quantity</span>

                        <div className="quantity-controls">
                          <button
                            onClick={() =>
                              changeQuantity(item.product_id, -1)
                            }
                          >
                            −
                          </button>

                          <span>{item.quantity || 1}</span>

                          <button
                            onClick={() =>
                              changeQuantity(item.product_id, 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <button
                      className="cart-remove-button"
                      onClick={() => removeItem(item.product_id)}
                    >
                      Remove
                    </button>
                  </div>

                  <div className="cart-personalisation">
                    <h4>Personalisation</h4>

                    <label>Recipient Name</label>
                    <input
                      type="text"
                      placeholder="Enter recipient name"
                      value={item.custom_name || ""}
                      onChange={(e) =>
                        updatePersonalisation(
                          item.product_id,
                          "custom_name",
                          e.target.value
                        )
                      }
                    />

                    <label>Gift Message</label>
                    <textarea
                      placeholder="Write your gift message..."
                      value={item.custom_message || ""}
                      onChange={(e) =>
                        updatePersonalisation(
                          item.product_id,
                          "custom_message",
                          e.target.value
                        )
                      }
                    />
                  </div>

                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>

              <div className="cart-summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>

              <div className="cart-summary-row">
                <span>Subtotal</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>

              <div className="cart-summary-row cart-summary-total">
                <span>Total</span>
                <span>Rs. {total.toFixed(2)}</span>
              </div>

              <button
                className="cart-checkout-button"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>

              <button
                className="cart-continue-button"
                onClick={() => navigate("/shop")}
              >
                Continue Shopping
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
