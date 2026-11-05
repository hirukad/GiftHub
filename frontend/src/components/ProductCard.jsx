function ProductCard({ product }) {
  return (
    <article className="pcard-card">
      {product.image ? (
        <img
          className="pcard-image"
          src={product.image}
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