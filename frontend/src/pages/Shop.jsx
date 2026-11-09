import { useState } from "react";
import ProductCard from "../components/ProductCard";
import "./Shop.css";
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

function Shop() {
  const [products] = useState(sampleProducts);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts = products.filter((product) => {
    const productText = `${product.name} ${product.description}`.toLowerCase();
    const matchesSearch = productText.includes(searchText.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" ||
      String(product.category_id) === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <main className="shop-page">
      <section className="shop-banner">
        <p className="shop-banner-label">A GIFT FOR EVERY MOMENT</p>
        <h1 className="shop-banner-title">Our Gifts</h1>
        <p className="shop-banner-description">
          Find something thoughtful for someone special.
        </p>
      </section>

      <section className="shop-catalogue">
        <div className="shop-toolbar">
          <h2 className="shop-section-title">Browse the collection</h2>

          <input
            className="shop-search"
            type="search"
            placeholder="Search products..."
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
          />

          <select
            className="shop-category"
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">All categories</option>
            <option value="1">Flowers (sample ID)</option>
            <option value="2">Mugs (sample ID)</option>
            <option value="3">Gift boxes (sample ID)</option>
          </select>
        </div>

        <div className="shop-product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="shop-empty-message">No matching gifts found.</p>
        )}
      </section>
    </main>
  );
}

export default Shop;