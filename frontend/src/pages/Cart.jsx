import { useState } from "react";

function loadCart() {
  try {
    const saved = localStorage.getItem("gifthub_cart");
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    return [];
  }
}

function Cart() {
  const [cart] = useState(loadCart);

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
                {item.name} - {Number(item.price).toFixed(2)} x {item.quantity}
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