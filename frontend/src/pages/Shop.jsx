import { useEffect, useState } from "react";
import api from "../services/services";
import ProductCard from "../components/ProductCard";
import roseBouquetImage from "../assets/rose-bouquet.png";
import personalisedMugImage from "../assets/personalised-mug.jpg";
import giftBoxImage from "../assets/gift-box.png";
import "./Shop.css";

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
  const [products, setProducts] = useState(sampleProducts);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [productMessage, setProductMessage] = useState(
    "Showing sample products until the product API is ready."
  );

  useEffect(() => {
    async function loadProducts() {
      try {
        const response = await api.get("products/get_products.php");
        const apiResult = response.data;

        if (apiResult.success && Array.isArray(apiResult.data)) {
          setProducts(apiResult.data);
          setProductMessage("");
        } else {
          setProductMessage(
            apiResult.message ||
              "Could not load products; sample products are shown."
          );
        }
      } catch {
        setProductMessage(
          "Product API is not available yet; sample products are shown."
        );
      }
    }

    loadProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const productText =
      `${product.name} ${product.description || ""}`.toLowerCase();
    const matchesSearch = productText.includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategory === "all" ||
      String(product.category_id) === selectedCategory;

    const price = Number(product.price);
    const matchesPrice =
      selectedPriceRange === "all" ||
      (selectedPriceRange === "under1000" && price < 1000) ||
      (selectedPriceRange === "1000to2500" &&
        price >= 1000 &&
        price <= 2500) ||
      (selectedPriceRange === "2500to5000" &&
        price > 2500 &&
        price <= 5000) ||
      (selectedPriceRange === "5000to10000" &&
        price > 5000 &&
        price <= 10000) ||
      (selectedPriceRange === "above10000" && price > 10000);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === "priceLowHigh") {
      return Number(a.price) - Number(b.price);
    }

    if (sortOrder === "priceHighLow") {
      return Number(b.price) - Number(a.price);
    }

    if (sortOrder === "name") {
      return a.name.localeCompare(b.name);
    }

    return 0;
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
            aria-label="Filter by category"
          >
            <option value="all">All categories</option>
            <option value="1">Birthday Gifts</option>
            <option value="2">Anniversary Gifts</option>
            <option value="3">Personalized Gifts</option>
          </select>

          <select
            className="shop-price-range"
            value={selectedPriceRange}
            onChange={(event) => setSelectedPriceRange(event.target.value)}
            aria-label="Filter by price"
          >
            <option value="all">All prices</option>
            <option value="under1000">Under Rs. 1,000</option>
            <option value="1000to2500">Rs. 1,000–2,500</option>
            <option value="2500to5000">Rs. 2,500–5,000</option>
            <option value="5000to10000">Rs. 5,000–10,000</option>
            <option value="above10000">Above Rs. 10,000</option>
          </select>

          <select
            className="shop-sort"
            value={sortOrder}
            onChange={(event) => setSortOrder(event.target.value)}
            aria-label="Sort products"
          >
            <option value="default">Sort by</option>
            <option value="priceLowHigh">Price: low to high</option>
            <option value="priceHighLow">Price: high to low</option>
            <option value="name">Name: A to Z</option>
          </select>
        </div>

        {productMessage && (
          <p className="shop-api-message">{productMessage}</p>
        )}

        <div className="shop-product-grid">
          {sortedProducts.map((product) => (
            <ProductCard key={product.product_id} product={product} />
          ))}
        </div>

        {sortedProducts.length === 0 && (
          <p className="shop-empty-message">No matching gifts found.</p>
        )}
      </section>
    </main>
  );
}

export default Shop;