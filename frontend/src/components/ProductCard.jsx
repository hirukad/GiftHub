function ProductCard({ product }) {
  const isInStock = Number(product.stock) > 0;
  const productImageSource = product.image
  ? product.image.startsWith("/")
    ? product.image
    : `/images/${product.image}`
  : "";
  return (
    <article className="pcard-card">
      {product.image ? (
        <img
          className="pcard-image"
          src={productImageSource}
          alt={product.name}
        />
      ) : (
        <div className="pcard-placeholder" aria-hidden="true">
          🎁
        </div>
      )}

      <div className="pcard-info">
        <h3 className="pcard-name">{product.name}</h3>
        <p className="pcard-description">{product.description}</p>
        <p className="pcard-price">Rs. {product.price}</p>
      <p
  className={`pcard-stock ${
    !isInStock
      ? "pcard-stock-sold-out"
      : Number(product.stock) <= 3
        ? "pcard-stock-low"
        : "pcard-stock-available"
  }`}
>
  {!isInStock
    ? "Sold out"
    : Number(product.stock) <= 3
      ? `Only ${product.stock} left`
      : "In stock"}
    </p>
        <a
          className="pcard-link"
          href={`/product/${product.product_id}`}
        >
          View details
        </a>
      </div>
    </article>
  );
}

export default ProductCard;