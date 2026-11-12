// frontend/src/pages/AdminDashboard.jsx
import { useState, useEffect } from "react";
import api from "../services/api"; // the ONE shared Axios instance
import "./AdminDashboard.css";

// Temporary category list (no categories endpoint exists yet).
// The category_id values MUST match your categories table.
const categoryOptions = [
  { category_id: 1, name: "Category 1" },
  { category_id: 2, name: "Category 2" },
  { category_id: 3, name: "Category 3" },
];

const orderStatusOptions = ["Pending", "Processing", "Delivered", "Cancelled"];
const emptyProductForm = { name: "", description: "", price: "", image: "", category_id: "", stock: "" };

// Turns an Axios error into a message for the screen.
function getErrorMessage(error) {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message; // e.g. "Admin access required"
  }
  return "Cannot reach the server. Check Apache and CORS.";
}

function AdminDashboard() {
  const [products, setProducts] = useState([]);       // rows for the product table
  const [orders, setOrders] = useState([]);           // rows for the orders table
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState(null); // null = adding
  const [formMessage, setFormMessage] = useState(""); // validation or server error for the form
  const [pageMessage, setPageMessage] = useState(""); // errors loading the page data

  // Loads products from Member 2's endpoint.
  async function loadProducts() {
    try {
      const response = await api.get("products/get_products.php");
      setProducts(response.data.data);
    } catch (error) {
      setPageMessage(getErrorMessage(error));
    }
  }

  // Loads every order from my admin endpoint.
  async function loadOrders() {
    try {
      const response = await api.get("admin/get_all_orders.php");
      setOrders(response.data.data);
      setPageMessage("");
    } catch (error) {
      setPageMessage(getErrorMessage(error)); // 401/403 show here
    }
  }

  // Runs once when the page opens.
  useEffect(() => {
    loadProducts();
    loadOrders();
  }, []);

  function handleFormChange(event) {
    setProductForm({ ...productForm, [event.target.name]: event.target.value });
  }

  function handleCancelEdit() {
    setEditingProductId(null);
    setProductForm(emptyProductForm);
    setFormMessage("");
  }

  // Save = create or update, depending on editingProductId.
  async function handleFormSubmit(event) {
    event.preventDefault();
    const priceNumber = Number(productForm.price);
    const stockNumber = Number(productForm.stock);
    if (productForm.name.trim() === "") { setFormMessage("Name is required."); return; }
    if (productForm.price === "" || Number.isNaN(priceNumber) || priceNumber < 0) {
      setFormMessage("Price must be a number, 0 or more."); return;
    }
    if (productForm.stock === "" || !Number.isInteger(stockNumber) || stockNumber < 0) {
      setFormMessage("Stock must be a whole number, 0 or more."); return;
    }

    // requestBody is the JSON sent to manage_products.php (contract field names).
    const requestBody = {
      action: editingProductId === null ? "create" : "update",
      name: productForm.name.trim(),
      description: productForm.description,
      price: priceNumber,
      image: productForm.image.trim(),
      category_id: productForm.category_id === "" ? null : Number(productForm.category_id),
      stock: stockNumber,
    };
    if (editingProductId !== null) requestBody.product_id = editingProductId;

    try {
      await api.post("products/manage_products.php", requestBody);
      handleCancelEdit();
      loadProducts(); // reload so the table shows what the database holds
    } catch (error) {
      setFormMessage(getErrorMessage(error));
    }
  }

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

  async function handleDeleteClick(productIdToDelete) {
    if (!window.confirm("Delete this product?")) return;
    try {
      await api.post("products/manage_products.php", { action: "delete", product_id: productIdToDelete });
      loadProducts();
    } catch (error) {
      setFormMessage(getErrorMessage(error)); // e.g. product is in existing orders
    }
  }

  async function handleStatusChange(orderIdToUpdate, newStatus) {
    try {
      await api.post("admin/update_order.php", { order_id: orderIdToUpdate, status: newStatus });
      loadOrders();
    } catch (error) {
      setPageMessage(getErrorMessage(error));
    }
  }

  function getCategoryName(categoryId) {
    const foundCategory = categoryOptions.find((categoryRow) => categoryRow.category_id === categoryId);
    return foundCategory ? foundCategory.name : "None";
  }

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Dashboard</h1>
      {pageMessage !== "" && <p className="admin-error">{pageMessage}</p>}

      <section className="admin-section">
        <h2 className="admin-subtitle">{editingProductId === null ? "Add product" : "Edit product"}</h2>
        {formMessage !== "" && <p className="admin-error">{formMessage}</p>}
        <form className="admin-form" onSubmit={handleFormSubmit}>
          <input className="admin-input" name="name" placeholder="Name" value={productForm.name} onChange={handleFormChange} />
          <input className="admin-input" name="description" placeholder="Description" value={productForm.description} onChange={handleFormChange} />
          <input className="admin-input" name="price" placeholder="Price" value={productForm.price} onChange={handleFormChange} />
          <input className="admin-input" name="image" placeholder="Image file name (e.g. gift-box.png)" value={productForm.image} onChange={handleFormChange} />
          <select className="admin-input" name="category_id" value={productForm.category_id} onChange={handleFormChange}>
            <option value="">No category</option>
            {categoryOptions.map((categoryRow) => (
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
                <th className="admin-th">ID</th><th className="admin-th">Name</th><th className="admin-th">Price</th>
                <th className="admin-th">Category</th><th className="admin-th">Stock</th><th className="admin-th">Actions</th>
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

      <section className="admin-section">
        <h2 className="admin-subtitle">Customer orders</h2>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th className="admin-th">Order</th><th className="admin-th">Customer</th><th className="admin-th">Date</th>
                <th className="admin-th">Deliver to</th><th className="admin-th">Phone</th><th className="admin-th">Payment</th>
                <th className="admin-th">Total</th><th className="admin-th">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((orderRow) => (
                <tr key={orderRow.order_id}>
                  <td className="admin-td">{orderRow.order_id}</td>
                  <td className="admin-td">{orderRow.customer_name}</td>
                  <td className="admin-td">{orderRow.order_date}</td>
                  <td className="admin-td">{orderRow.delivery_name}, {orderRow.delivery_address}</td>
                  <td className="admin-td">{orderRow.phone}</td>
                  <td className="admin-td">{orderRow.payment_method}</td>
                  <td className="admin-td">{Number(orderRow.total)}</td>
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

export default AdminDashboard;