import { useParams } from "react-router-dom";
import "./ProductDetails.css";
import roseBouquetImage from "../assets/rose-bouquet.png";
import personalisedMugImage from "../assets/personalised-mug.jpg";
import giftBoxImage from "../assets/gift-box.png";

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

  const selectedProduct = sampleProducts.find(
    (product) => String(product.product_id) === routeProductId
  );

  if (!selectedProduct) {
    return (
      <main className="pdetail-page">
        <p className="pdetail-message">We couldn’t find that gift.</p>
        <a className="pdetail-back-link" href="/shop">
          Back to gifts
        </a>
      </main>
    );
  }

  return (
    <main className="pdetail-page">
      <a className="pdetail-back-link" href="/shop">
        ← Back to gifts
      </a>

      <section className="pdetail-layout">
        <div className="pdetail-image-area">
          {selectedProduct.image ? (
            <img
              className="pdetail-image"
              src={selectedProduct.image}
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
            {selectedProduct.stock > 0 ? "In stock" : "Currently unavailable"}
          </p>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;