import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";
import shopBannerImage from "../assets/home-hero.png";
import "./Shop.css";

const sampleProducts = [
  {
    product_id: 1,
    name: "Personalized Mug",
    description: "A personalized mug",
    price: 1500,
    image: "mug.jpg",
    category_id: 1,
    stock: 10,
  },
  {
    product_id: 2,
    name: "Magic Colour-Change Mug",
    description: "A colour-changing personalized mug",
    price: 2200,
    image: "magic-mug.jpg",
    category_id: 1,
    stock: 8,
  },
  {
    product_id: 3,
    name: "Custom Water Bottle",
    description: "A custom water bottle",
    price: 2500,
    image: "bottle.jpg",
    category_id: 1,
    stock: 12,
  },
  {
    product_id: 4,
    name: "Wooden Photo Frame",
    description: "A personalized wooden photo frame",
    price: 2800,
    image: "wooden-frame.jpg",
    category_id: 2,
    stock: 10,
  },
  {
    product_id: 5,
    name: "Collage Photo Frame",
    description: "A collage photo frame",
    price: 3500,
    image: "collage-frame.jpg",
    category_id: 2,
    stock: 6,
  },
  {
    product_id: 6,
    name: "Name Printed Cushion",
    description: "A cushion with a printed name",
    price: 2300,
    image: "cushion.jpg",
    category_id: 3,
    stock: 10,
  },
  {
    product_id: 7,
    name: "Photo Cushion",
    description: "A cushion with a personalized photo",
    price: 2600,
    image: "photo-cushion.jpg",
    category_id: 3,
    stock: 8,
  },
  {
    product_id: 8,
    name: "Engraved Wooden Keychain",
    description: "A wooden keychain with custom engraving",
    price: 800,
    image: "keychain.jpg",
    category_id: 4,
    stock: 25,
  },
  {
    product_id: 9,
    name: "Name Bracelet",
    description: "A bracelet with a personalized name",
    price: 1200,
    image: "bracelet.jpg",
    category_id: 4,
    stock: 15,
  },
  {
    product_id: 10,
    name: "Personalized Greeting Card",
    description: "A greeting card with a custom message",
    price: 600,
    image: "card.jpg",
    category_id: 5,
    stock: 30,
  },
  {
    product_id: 11,
    name: "Mini Gift Box Set",
    description: "A set of mini gift boxes",
    price: 3200,
    image: "gift-box.jpg",
    category_id: 5,
    stock: 7,
  },
  {
    product_id: 12,
    name: "Custom Name Pen",
    description: "A pen personalized with a custom name",
    price: 900,
    image: "custom-name-pen.jpg",
    category_id: 4,
    stock: 10,
  },
];

const categories = [
  { id: 1, name: "Mugs & Drinkware" },
  { id: 2, name: "Photo Frames" },
  { id: 3, name: "Cushions & Home Decor" },
  { id: 4, name: "Keychains & Accessories" },
  { id: 5, name: "Greeting Cards & Gift Boxes" },
];

const occasionProductIds = {
  birthday: [1, 2, 3, 8, 10, 11, 12],
  anniversary: [1, 4, 5, 6, 7, 9, 10, 11],
  graduation: [3, 4, 5, 8, 12],
  "mothers-day": [1, 4, 6, 7, 10, 11],
  christmas: [2, 3, 10, 11],
};

function Shop() {
  const [searchParams] = useSearchParams();
  const selectedOccasion = searchParams.get("occasion");

  const [products, setProducts] = useState(sampleProducts);
  const [searchText, setSearchText] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortOrder, setSortOrder] = useState("default");
  const [productMessage, setProductMessage] = useState("");

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
            apiResult.message || "Sample products are shown."
          );
        }
      } catch {
        setProductMessage(
          "The product API is unavailable; sample products are shown."
        );
      }
    }

    loadProducts();
  }, []);

  function toggleCategory(categoryId) {
    setSelectedCategories((current) =>
      current.includes(categoryId)
        ? current.filter((id) => id !== categoryId)
        : [...current, categoryId]
    );
  }

  const filteredProducts = products.filter((product) => {
    const productText =
      `${product.name} ${product.description || ""}`.toLowerCase();
    const matchesSearch = productText.includes(searchText.toLowerCase());

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(Number(product.category_id));

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

    const productsForOccasion = occasionProductIds[selectedOccasion];
    const matchesOccasion =
      !productsForOccasion ||
      productsForOccasion.includes(Number(product.product_id));

    return (
      matchesSearch &&
      matchesCategory &&
      matchesPrice &&
      matchesOccasion
    );
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
      <section
        className="shop-banner"
        style={{ "--shop-banner-image": `url("${shopBannerImage}")` }}
      >
        <div className="shop-banner-content">
          <div>
            <h1 className="shop-banner-title">Our Gifts</h1>
            <p className="shop-banner-description">
              Find the perfect gift for every special moment ✦
            </p>
          </div>

          <label className="shop-banner-search">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search products..."
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              aria-label="Search products"
            />
          </label>
        </div>
      </section>

      <section className="shop-catalogue">
        <aside className="shop-filter-sidebar">
          <h2 className="shop-filter-title">Filter by</h2>

          <fieldset className="shop-filter-group">
            <legend>Category</legend>

            <label className="shop-filter-option">
              <input
                type="checkbox"
                checked={selectedCategories.length === 0}
                onChange={() => setSelectedCategories([])}
              />
              <span>All</span>
            </label>

            {categories.map((category) => (
              <label className="shop-filter-option" key={category.id}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleCategory(category.id)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="shop-filter-group">
            <legend>Price Range</legend>

            <label className="shop-filter-option">
              <input
                type="radio"
                name="priceRange"
                value="all"
                checked={selectedPriceRange === "all"}
                onChange={(event) =>
                  setSelectedPriceRange(event.target.value)
                }
              />
              <span>All prices</span>
            </label>

            <label className="shop-filter-option">
              <input
                type="radio"
                name="priceRange"
                value="under1000"
                checked={selectedPriceRange === "under1000"}
                onChange={(event) =>
                  setSelectedPriceRange(event.target.value)
                }
              />
              <span>Under Rs. 1,000</span>
            </label>

            <label className="shop-filter-option">
              <input
                type="radio"
                name="priceRange"
                value="1000to2500"
                checked={selectedPriceRange === "1000to2500"}
                onChange={(event) =>
                  setSelectedPriceRange(event.target.value)
                }
              />
              <span>Rs. 1,000–2,500</span>
            </label>

            <label className="shop-filter-option">
              <input
                type="radio"
                name="priceRange"
                value="2500to5000"
                checked={selectedPriceRange === "2500to5000"}
                onChange={(event) =>
                  setSelectedPriceRange(event.target.value)
                }
              />
              <span>Rs. 2,500–5,000</span>
            </label>

            <label className="shop-filter-option">
              <input
                type="radio"
                name="priceRange"
                value="5000to10000"
                checked={selectedPriceRange === "5000to10000"}
                onChange={(event) =>
                  setSelectedPriceRange(event.target.value)
                }
              />
              <span>Rs. 5,000–10,000</span>
            </label>

            <label className="shop-filter-option">
              <input
                type="radio"
                name="priceRange"
                value="above10000"
                checked={selectedPriceRange === "above10000"}
                onChange={(event) =>
                  setSelectedPriceRange(event.target.value)
                }
              />
              <span>Above Rs. 10,000</span>
            </label>
          </fieldset>
        </aside>

        <div className="shop-results">
          <div className="shop-results-toolbar">
            <h2 className="shop-section-title">Browse the collection</h2>

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
        </div>
      </section>
    </main>
  );
}

export default Shop;