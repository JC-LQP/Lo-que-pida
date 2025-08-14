import { useState, useEffect, useCallback } from 'react';
import { productsService } from '../services/productsService';

// Product type (you can make this more specific based on your transformed product structure)
export interface Product {
  id: string;
  name: string;
  price: number;
  compare_price?: number | null;
  description: string;
  image: string;
  is_featured: boolean;
  brand?: string | null;
  model?: string | null;
  slug: string;
  stock?: number;
  isInStock?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
  category?: {
    id: string;
    name: string;
    description: string;
  };
  seller?: {
    id: string;
    businessName: string;
    user: {
      displayName: string;
      email: string;
    };
  };
}

// Types for the hook
interface UseProductsOptions {
  page?: number;
  limit?: number;
  categoryId?: string;
  search?: string;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  autoFetch?: boolean; // Whether to fetch automatically on mount
}

interface UseProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => Promise<void>;
  fetchProducts: (options?: UseProductsOptions) => Promise<void>;
}

// Main products hook
export function useProducts(options: UseProductsOptions = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  const fetchProducts = useCallback(async (fetchOptions: UseProductsOptions = {}) => {
    const combinedOptions = { ...options, ...fetchOptions };
    
    setLoading(true);
    setError(null);

    try {
      const result = await productsService.getProducts({
        page: combinedOptions.page || 1,
        limit: combinedOptions.limit || 20,
        categoryId: combinedOptions.categoryId,
        search: combinedOptions.search,
        isFeatured: combinedOptions.isFeatured,
        sortBy: combinedOptions.sortBy,
        sortOrder: combinedOptions.sortOrder,
      });

      if (result.success) {
        setProducts(result.products || []);
        setPagination(result.pagination || null);
      } else {
        setError(result.error || 'Failed to fetch products');
        setProducts([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [options]);

  const refetch = useCallback(() => fetchProducts(), [fetchProducts]);

  // Auto-fetch on mount if enabled
  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchProducts();
    }
  }, [fetchProducts, options.autoFetch]);

  return {
    products,
    loading,
    error,
    pagination,
    refetch,
    fetchProducts,
  };
}

// Hook specifically for featured products
export function useFeaturedProducts(limit: number = 12) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await productsService.getFeaturedProducts(limit);
      
      if (result.success) {
        setProducts(result.products || []);
      } else {
        setError(result.error || 'Failed to fetch featured products');
        setProducts([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    fetchFeaturedProducts();
  }, [fetchFeaturedProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchFeaturedProducts,
  };
}

// Hook for single product
export function useProduct(id: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await productsService.getProduct(id);
      
      if (result.success) {
        setProduct(result.product);
      } else {
        setError(result.error || 'Failed to fetch product');
        setProduct(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}

// Hook for product by slug
export function useProductBySlug(slug: string | null) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProductBySlug = useCallback(async () => {
    if (!slug) return;
    
    setLoading(true);
    setError(null);

    try {
      const result = await productsService.getProductBySlug(slug);
      
      if (result.success) {
        setProduct(result.product);
      } else {
        setError(result.error || 'Failed to fetch product');
        setProduct(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchProductBySlug();
  }, [fetchProductBySlug]);

  return {
    product,
    loading,
    error,
    refetch: fetchProductBySlug,
  };
}
