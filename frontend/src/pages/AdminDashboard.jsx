// frontend/src/pages/AdminDashboard.jsx
import { useState } from "react"; // useState lets a component remember values
import "./AdminDashboard.css"; // my own CSS file

// ---------- FAKE DATA (Day 2 only, replaced by API calls on Day 3) ----------

// Stores a list of categories for the dropdown in the form.
const fakeCategories = [
  { category_id: 1, name: "Mugs" },
  { category_id: 2, name: "Cards" },
  { category_id: 3, name: "Frames" },
];

// Stores a starting list of products. Keys match the contract exactly.
const fakeProducts = [
  { product_id: 1, name: "Custom Mug", description: "White ceramic mug", price: 1500, image: "mug.jpg", category_id: 1, stock: 20 },
  { product_id: 2, name: "Birthday Card", description: "Folded greeting card", price: 400, image: "card.jpg", category_id: 2, stock: 50 },
  { product_id: 3, name: "Photo Frame", description: "Wooden 5x7 frame", price: 2200, image: "frame.jpg", category_id: 3, stock: 8 },
];

// Stores a starting list of orders. Keys match get_orders.php in the contract.
const fakeOrders = [
  { order_id: 101, order_date: "2026-11-05 10:30:00", total: 3400, status: "Pending", delivery_name: "Nimal Perera", delivery_address: "12 Temple Road, Colombo", phone: "0771234567", payment_method: "COD" },
  { order_id: 102, order_date: "2026-11-06 14:10:00", total: 1500, status: "Processing", delivery_name: "Kamala Silva", delivery_address: "5 Lake Drive, Kandy", phone: "0719876543", payment_method: "COD" },
];

// The four allowed status values, exactly as in the contract.
const orderStatusOptions = ["Pending", "Processing", "Delivered", "Cancelled"];

// An empty form. Every value is text because input boxes always give text.
const emptyProductForm = { name: "", description: "", price: "", image: "", category_id: "", stock: "" };

function AdminDashboard() {
  // products: the list shown in the table. setProducts changes it.
  const [products, setProducts] = useState(fakeProducts);
  // orders: the list shown in the orders section.
  const [orders, setOrders] = useState(fakeOrders);
  // productForm: what is typed in the form right now.
  const [productForm, setProductForm] = useState(emptyProductForm);
  // editingProductId: null means "adding new". A number means "editing that product".
  const [editingProductId, setEditingProductId] = useState(null);
  // formMessage: a validation error shown above the form.
  const [formMessage, setFormMessage] = useState("");

  // Runs on every keystroke in the form.
  function handleFormChange(event) {
    const fieldName = event.target.name;   // which box, e.g. "price"
    const fieldValue = event.target.value; // what is typed in it
    // Copy the old form, then replace only the changed field.
    setProductForm({ ...productForm, [fieldName]: fieldValue });
  }

  // Runs when Save is clicked.
  function handleFormSubmit(event) {
    event.preventDefault(); // stop the browser reloading the page

    // --- validation (the PHP server will validate again on Day 3) ---
    const priceNumber = Number(productForm.price);
    const stockNumber = Number(productForm.stock);
    if (productForm.name.trim() === "") {
      setFormMessage("Name is required.");
      return;
    }
    if (productForm.price === "" || Number.isNaN(priceNumber) || priceNumber < 0) {
      setFormMessage("Price must be a number, 0 or more.");
      return;
    }
    if (productForm.stock === "" || !Number.isInteger(stockNumber) || stockNumber < 0) {
      setFormMessage("Stock must be a whole number, 0 or more.");
      return;
    }

    // Build one product object with the correct types.
    const savedProduct = {
      product_id: editingProductId,
      name: productForm.name.trim(),
      description: productForm.description,
      price: priceNumber,
      image: productForm.image,
      category_id: productForm.category_id === "" ? null : Number(productForm.category_id),
      stock: stockNumber,
    };

    if (editingProductId === null) {
      // ADD: new id = biggest existing id + 1 (fake only; the database does this later)
      const newProductId = Math.max(0, ...products.map((productRow) => productRow.product_id)) + 1;
      setProducts([...products, { ...savedProduct, product_id: newProductId }]);
    } else {
      // EDIT: replace the matching product, keep all the others
      setProducts(
        products.map((productRow) =>
          productRow.product_id === editingProductId ? savedProduct : productRow
        )
      );
    }
    handleCancelEdit(); // clear the form
  }

  // Fills the form with the chosen product so you can edit it.
  function handleEditClick(productToEdit) {
    setEditingProductId(productToEdit.product_id);
    setProductForm({
      name: productToEdit.name,
      description: productToEdit.description || "",
      price: String(productToEdit.price),
      image: productToEdit.image || "",
      category_id: productToEdit.category_id === null ? "" : String(productToEdit.category_id),
      stock: String(productToEdit.stock),
    });
    setFormMessage("");
  }

  // Clears the form and goes back to "add" mode.
  function handleCancelEdit() {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setFormMessage("");
  }

  // Removes a product after the admin confirms.
  function handleDeleteClick(productIdToDelete) {
    const confirmed = window.confirm("Delete this product?");
    if (!confirmed) return;
    setProducts(products.filter((productRow) => productRow.product_id !== productIdToDelete));
  }

  // Changes the status of one order (screen only for now).
  function handleStatusChange(orderIdToUpdate, newStatus) {
    setOrders(
      orders.map((orderRow) =>
        orderRow.order_id === orderIdToUpdate ? { ...orderRow, status: newStatus } : orderRow
      )
    );
  }

  // Finds a category name from its id, for the table.
  function getCategoryName(categoryId) {
    const foundCategory = fakeCategories.find((categoryRow) => categoryRow.category_id === categoryId);
    return foundCategory ? foundCategory.name : "None";
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>

      {/* ---------- PRODUCTS ---------- */}
      <section className="admin-section">
        <h2 className="admin-subtitle">{editingProductId === null ? "Add product" : "Edit product"}</h2>
        {formMessage !== "" && <p className="admin-error">{formMessage}</p>}

        <form className="admin-form" onSubmit={handleFormSubmit}>
          <input className="admin-input" name="name" placeholder="Name" value={productForm.name} onChange={handleFormChange} />
          <input className="admin-input" name="description" placeholder="Description" value={productForm.description} onChange={handleFormChange} />
          <input className="admin-input" name="price" placeholder="Price" value={productForm.price} onChange={handleFormChange} />
          <input className="admin-input" name="image" placeholder="Image file name" value={productForm.image} onChange={handleFormChange} />
          <select className="admin-input" name="category_id" value={productForm.category_id} onChange={handleFormChange}>
            <option value="">No category</option>
            {fakeCategories.map((categoryRow) => (
              <option key={categoryRow.category_id} value={categoryRow.category_id}>{categoryRow.name}</option>
            ))}
          </select>
          <input className="admin-input" name="stock" placeholder="Stock" value={productForm.stock} onChange={handleFormChange} />
          <button className="admin-button" type="submit">Save</button>
          {editingProductId !== null && (
            <button className="admin-button admin-button-grey" type="button" onClick={handleCancelEdit}>Cancel</button>
          )}
        </form>

        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">ID</th>
                <th className="admin-th">Name</th>
                <th className="admin-th">Price</th>
                <th className="admin-th">Category</th>
                <th className="admin-th">Stock</th>
                <th className="admin-th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((productRow) => (
                <tr key={productRow.product_id}>
                  <td className="admin-td">{productRow.product_id}</td>
                  <td className="admin-td">{productRow.name}</td>
                  <td className="admin-td">{productRow.price}</td>
                  <td className="admin-td">{getCategoryName(productRow.category_id)}</td>
                  <td className="admin-td">{productRow.stock}</td>
                  <td className="admin-td">
                    <button className="admin-button" onClick={() => handleEditClick(productRow)}>Edit</button>
                    <button className="admin-button admin-button-red" onClick={() => handleDeleteClick(productRow.product_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------- ORDERS ---------- */}
      <section className="admin-section">
        <h2 className="admin-subtitle">Customer orders</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Order</th>
                <th className="admin-th">Date</th>
                <th className="admin-th">Deliver to</th>
                <th className="admin-th">Phone</th>
                <th className="admin-th">Payment</th>
                <th className="admin-th">Total</th>
                <th className="admin-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderRow) => (
                <tr key={orderRow.order_id}>
                  <td className="admin-td">{orderRow.order_id}</td>
                  <td className="admin-td">{orderRow.order_date}</td>
                  <td className="admin-td">{orderRow.delivery_name}, {orderRow.delivery_address}</td>
                  <td className="admin-td">{orderRow.phone}</td>
                  <td className="admin-td">{orderRow.payment_method}</td>
                  <td className="admin-td">{orderRow.total}</td>
                  <td className="admin-td">
                    <select className="admin-input" value={orderRow.status} onChange={(event) => handleStatusChange(orderRow.order_id, event.target.value)}>
                      {orderStatusOptions.map((statusName) => (
                        <option key={statusName} value={statusName}>{statusName}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard; // lets App.jsx import this component