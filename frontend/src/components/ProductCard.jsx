import { useEffect, useState } from "react";
import { addToCart } from "../services/cartStorage";

function ProductCard({ product }) {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const isInStock = Number(product.stock) > 0;

  const imageSource = product.image
    ? product.image.startsWith("/")
      ? product.image
      : `/images/${product.image}`
    : "";

  useEffect(() => {
    if (!showSuccessModal) return;

    const timer = window.setTimeout(() => {
      setShowSuccessModal(false);
    }, 6000);

    return () => window.clearTimeout(timer);
  }, [showSuccessModal]);

  function handleAddToCart() {
    addToCart(product, 1, "", "");
    setShowSuccessModal(true);
  }

  return (
    <>
      <article className="pcard-card">
        <div className="pcard-image-wrap">
          <a
            className="pcard-image-link"
            href={`/product/${product.product_id}`}
            aria-label={`View ${product.name}`}
          >
            {imageSource ? (
              <img className="pcard-image" src={imageSource} alt={product.name} />
            ) : (
              <span className="pcard-placeholder" aria-hidden="true">🎁</span>
            )}
          </a>
        </div>

        <div className="pcard-info">
          <h3 className="pcard-name">{product.name}</h3>

          <p className="pcard-price">
            Rs. {Number(product.price).toLocaleString("en-LK")}
          </p>

          <p className={`pcard-stock ${isInStock ? "pcard-stock-available" : "pcard-stock-sold-out"}`}>
            {isInStock ? "In stock" : "Sold out"}
          </p>

          <div className="pcard-actions">
            <a
              className="pcard-details-button"
              href={`/product/${product.product_id}`}
            >
              View details
            </a>

            <button
              className="pcard-add-button"
              type="button"
              onClick={handleAddToCart}
              disabled={!isInStock}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </article>

      {showSuccessModal && (
        <div
          className="pcard-success-overlay"
          onClick={() => setShowSuccessModal(false)}
        >
          <section
            className="pcard-success-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-success-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="pcard-success-check" aria-hidden="true">✓</div>

            <h2 id="cart-success-title">Added Successfully!</h2>
            <p>Your gift has been added to your shopping cart.</p>

            <button
              className="pcard-continue-button"
              type="button"
              onClick={() => setShowSuccessModal(false)}
            >
              Continue Shopping
            </button>

            <a className="pcard-view-cart" href="/cart">
              View Cart →
            </a>
          </section>
        </div>
      )}
    </>
  );
}

export default ProductCard;