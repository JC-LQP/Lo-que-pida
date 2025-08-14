import React from 'react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    compare_price?: number | null;
    description: string;
    image: string;
    is_featured: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      {product.compare_price && <p className="compare">${product.compare_price}</p>}
    </div>
  );
};

export default ProductCard;
