import React from 'react';
import ProductCard from '../components/features/ProductCard';
import { useFeaturedProducts } from '../features/products/hooks/useProducts';

const Home = () => {
  // Use the custom hook for featured products
  const { products, loading, error } = useFeaturedProducts(20);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-4 text-lg">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-8">
        <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
        <div className="text-gray-600 text-center">
          <p>To fix this:</p>
          <ol className="list-decimal list-inside mt-2 space-y-1">
            <li>Make sure your backend is running on port 3000</li>
            <li>Check your database connection</li>
            <li>Verify your API endpoints are working</li>
          </ol>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h1>
        <p className="text-gray-600">Discover our amazing collection of products</p>
      </div>
      
      {products.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No products found</div>
          <p className="text-gray-400 mt-2">Check back later for new products!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                compare_price: product.compare_price,
                description: product.description,
                image: product.image,
                is_featured: product.is_featured,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
