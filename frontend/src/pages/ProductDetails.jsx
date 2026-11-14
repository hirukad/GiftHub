import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";
import { addToCart } from "../services/cartStorage";
import roseBouquetImage from "../assets/rose-bouquet.png";
import personalisedMugImage from "../assets/personalised-mug.jpg";
import giftBoxImage from "../assets/gift-box.png";
import "./ProductDetails.css";

const sampleProducts = [
  {
    product_id: 1,
    name: "Rose Bouquet",
    description: "Fresh roses for a special moment.",
    price: 2500,
    image: roseBouquetImage,
    category_id: 1,
    stock: 10,
  },
  {
    product_id: 2,
    name: "Personalised Mug",
    description: "A thoughtful mug for someone special.",
    price: 1800,
    image: personalisedMugImage,
    category_id: 2,
    stock: 8,
  },
  {
    product_id: 3,
    name: "Gift Box",
    description: "A little box filled with lovely surprises.",
    price: 3200,
    image: giftBoxImage,
    category_id: 3,
    stock: 5,
  },
];

function ProductDetails() {
  const { id: routeProductId } = useParams();

  const [selectedProduct, setSelectedProduct] = useState(() =>
    sampleProducts.find(
      (product) => String(product.product_id) === routeProductId
    ) ?? null
  );
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    let isCurrentRequest = true;

    const fallbackProduct = sampleProducts.find(
      (product) => String(product.product_id) === routeProductId
    );

    setSelectedProduct(fallbackProduct ?? null);

    async function loadProduct() {
      try {
        const response = await api.get(
          `products/get_product.php?id=${routeProductId}`
        );
        const apiResult = response.data;

        if (
          isCurrentRequest &&
          apiResult.success &&
          apiResult.data &&
          !Array.isArray(apiResult.data)
        ) {
          setSelectedProduct(apiResult.data);
        }
      } catch {
        // Keep showing the sample product if the endpoint is unavailable.
      }
    }

    loadProduct();

    return () => {
      isCurrentRequest = false;
    };
  }, [routeProductId]);

  useEffect(() => {
    if (!showSuccessModal) return;

    const timer = window.setTimeout(() => {
      setShowSuccessModal(false);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [showSuccessModal]);

  function handleAddToCart() {
    addToCart(selectedProduct, 1, "", "");
    setShowSuccessModal(true);
  }

  if (!selectedProduct) {
    return (
      <main className="pdetail-page">
        <p className="pdetail-message">We couldn’t find that gift.</p>
        <Link className="pdetail-back-link" to="/shop">
          Back to gifts
        </Link>
      </main>
    );
  }

  const productImageSource = selectedProduct.image
    ? selectedProduct.image.startsWith("/")
      ? selectedProduct.image
      : `/images/${selectedProduct.image}`
    : "";

  const isInStock = Number(selectedProduct.stock) > 0;

  return (
    <main className="pdetail-page">
      <Link className="pdetail-back-link" to="/shop">
        ← Back to gifts
      </Link>

      <section className="pdetail-layout">
        <div className="pdetail-image-area">
          {selectedProduct.image ? (
            <img
              className="pdetail-image"
              src={productImageSource}
              alt={selectedProduct.name}
            />
          ) : (
            <div className="pdetail-image-placeholder" aria-hidden="true">
              🎁
            </div>
          )}
        </div>

        <div className="pdetail-information">
          <p className="pdetail-label">A THOUGHTFUL GIFT</p>
          <h1 className="pdetail-title">{selectedProduct.name}</h1>
          <p className="pdetail-price">Rs. {selectedProduct.price}</p>
          <p className="pdetail-description">{selectedProduct.description}</p>
          <p className="pdetail-stock">
            {isInStock ? "In stock" : "Currently unavailable"}
          </p>

          <button
            className="pdetail-add-button"
            type="button"
            onClick={handleAddToCart}
            disabled={!isInStock}
          >
            Add to Cart
          </button>
        </div>
      </section>

      {showSuccessModal && (
        <div
          className="pdetail-success-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <section
            className="pdetail-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pdetail-success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pdetail-success-check" aria-hidden="true">
              ✓
            </div>

            <h2 id="pdetail-success-title">Added Successfully!</h2>
            <p>Your gift has been added to your shopping cart.</p>

            <button
              className="pdetail-continue-button"
              type="button"
              onClick={() => setShowSuccessModal(false)}
            >
              Continue Shopping
            </button>

            <Link className="pdetail-view-cart" to="/cart">
              View Cart →
            </Link>
          </section>
        </div>
      )}
    </main>
  );
}

export default ProductDetails;