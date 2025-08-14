import { apiService, BackendProduct, ProductsResponse, transformBackendProductToFrontend } from '../../../lib/api';

// Service specifically for products with additional business logic
export class ProductsService {
  // Get all products with filters
  async getProducts(filters?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    condition?: string;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    try {
      const response = await apiService.getProducts({
        page: filters?.page || 1,
        limit: filters?.limit || 20,
        categoryId: filters?.categoryId,
        search: filters?.search,
        isActive: true, // Only show active products
        isFeatured: filters?.isFeatured,
        sortBy: filters?.sortBy,
        sortOrder: filters?.sortOrder,
      });

      // Transform products for frontend use
      const transformedProducts = response.data.products.map(transformBackendProductToFrontend);

      return {
        success: true,
        products: transformedProducts,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        }
      };
    } catch (error) {
      console.error('[Products Service] Error fetching products:', error);
      return {
        success: false,
        products: [],
        error: error instanceof Error ? error.message : 'Failed to fetch products'
      };
    }
  }

  // Get featured products
  async getFeaturedProducts(limit: number = 12) {
    try {
      const response = await apiService.getFeaturedProducts(limit);
      const transformedProducts = response.data.map(transformBackendProductToFrontend);

      return {
        success: true,
        products: transformedProducts
      };
    } catch (error) {
      console.error('[Products Service] Error fetching featured products:', error);
      return {
        success: false,
        products: [],
        error: error instanceof Error ? error.message : 'Failed to fetch featured products'
      };
    }
  }

  // Get single product by ID
  async getProduct(id: string) {
    try {
      const response = await apiService.getProduct(id);
      const transformedProduct = transformBackendProductToFrontend(response.data);

      return {
        success: true,
        product: transformedProduct
      };
    } catch (error) {
      console.error('[Products Service] Error fetching product:', error);
      return {
        success: false,
        product: null,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      };
    }
  }

  // Get product by slug
  async getProductBySlug(slug: string) {
    try {
      const response = await apiService.getProductBySlug(slug);
      const transformedProduct = transformBackendProductToFrontend(response.data);

      return {
        success: true,
        product: transformedProduct
      };
    } catch (error) {
      console.error('[Products Service] Error fetching product by slug:', error);
      return {
        success: false,
        product: null,
        error: error instanceof Error ? error.message : 'Failed to fetch product'
      };
    }
  }

  // Get products by seller
  async getSellerProducts(sellerId: string, page: number = 1, limit: number = 20) {
    try {
      const response = await apiService.getSellerProducts(sellerId, { page, limit });
      const transformedProducts = response.data.products.map(transformBackendProductToFrontend);

      return {
        success: true,
        products: transformedProducts,
        pagination: {
          page: response.data.page,
          limit: response.data.limit,
          total: response.data.total,
          totalPages: response.data.totalPages,
        }
      };
    } catch (error) {
      console.error('[Products Service] Error fetching seller products:', error);
      return {
        success: false,
        products: [],
        error: error instanceof Error ? error.message : 'Failed to fetch seller products'
      };
    }
  }

  // Search products
  async searchProducts(query: string, filters?: {
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
    condition?: string;
  }) {
    return this.getProducts({
      search: query,
      ...filters,
      sortBy: 'relevance'
    });
  }
}

// Export singleton instance
export const productsService = new ProductsService();
export default productsService;
