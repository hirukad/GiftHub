import { useState } from "react";

const CART_KEY = "gifthub_cart";

function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save cart", error);
  }
}

function Cart() {
  const [cart, setCart] = useState(loadCart);

  function updateCart(newCart) {
    setCart(newCart);
    saveCart(newCart);
  }

  function changeQuantity(productId, change) {
    const newCart = cart.map((item) => {
      if (item.product_id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + change) };
      }
      return item;
    });
    updateCart(newCart);
  }

  function changeText(productId, field, value) {
    const newCart = cart.map((item) => {
      if (item.product_id === productId) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateCart(newCart);
  }

  function removeItem(productId) {
    const newCart = cart.filter((item) => item.product_id !== productId);
    updateCart(newCart);
  }

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  return (
    <div>
      <h1>Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {cart.map((item) => (
              <li key={item.product_id}>
                {item.name} - {Number(item.price).toFixed(2)}
                <button onClick={() => changeQuantity(item.product_id, -1)}>-</button>
                {item.quantity}
                <button onClick={() => changeQuantity(item.product_id, 1)}>+</button>
                <button onClick={() => removeItem(item.product_id)}>Remove</button>
                <div>
                  <label>Recipient name (optional)</label>
                  <input
                    type="text"
                    maxLength={100}
                    value={item.custom_name || ""}
                    onChange={(e) =>
                      changeText(item.product_id, "custom_name", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label>Gift message (optional)</label>
                  <textarea
                    value={item.custom_message || ""}
                    onChange={(e) =>
                      changeText(item.product_id, "custom_message", e.target.value)
                    }
                  />
                </div>
              </li>
            ))}
          </ul>
          <p>Total: {total.toFixed(2)}</p>
        </>
      )}
    </div>
  );
}

export default Cart;