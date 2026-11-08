import { useState } from "react";

const PAYMENT_METHOD = "COD"; // provisional, waiting for Member 1 to confirm

function Checkout() {
  const [form, setForm] = useState({
    delivery_name: "",
    delivery_address: "",
    phone: "",
  });
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setForm({ ...form, [name]: value });
  }

  function handleSubmit(event) {
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
    console.log("Order data (not sent yet):", {
      ...form,
      payment_method: PAYMENT_METHOD,
    });
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
        <button type="submit">Place order</button>
      </form>
    </div>
  );
}

export default Checkout;