interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    compare_price?: number | null;
    description?: string | null;
    image: string;
    is_featured?: boolean;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <div className="bg-white/40 backdrop-blur-md rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden">
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        {product.is_featured && (
          <span className="text-green-600 font-bold text-sm mb-1 inline-block">
            Destacado
          </span>
        )}
        <h3 className="text-lg font-semibold">{product.name}</h3>
        {product.description && (
          <p className="text-gray-600 text-sm">{product.description}</p>
        )}
        <div className="flex items-center gap-2 mt-2">
          <span className="text-green-600 font-bold">${product.price.toFixed(2)}</span>
          {product.compare_price && (
            <span className="line-through text-gray-400 text-sm">
              ${product.compare_price.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
