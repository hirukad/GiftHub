const CART_KEY = "gifthub_cart";

export function loadCart() {
  try {
    const saved = localStorage.getItem(CART_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Could not save cart", error);
  }
}

export function addToCart(product, quantity = 1, customName = "", customMessage = "") {
  if (!product || product.product_id === undefined) {
    console.error("addToCart needs a product with product_id", product);
    return;
  }

  const productId = Number(product.product_id);
  const cart = loadCart();
  const existing = cart.find((item) => item.product_id === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      product_id: productId,
      name: product.name,
      price: Number(product.price),
      image: product.image,
      quantity: quantity,
      custom_name: customName,
      custom_message: customMessage,
    });
  }

  saveCart(cart);
}