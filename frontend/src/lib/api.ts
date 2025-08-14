// API Configuration and Service Layer for Frontend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Types matching your backend API responses
export interface BackendProduct {
  id: string;
  name: string;
  description: string;
  shortDescription: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  costPrice: number | null;
  categoryId: string;
  sellerId: string;
  condition: string;
  brand: string | null;
  model: string | null;
  weight: string | null;
  dimensions: Record<string, any> | null;
  images: string[];
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  isActive: boolean;
  isFeatured: boolean;
  trackQuantity: boolean;
  createdAt: string;
  updatedAt: string;
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
  inventory?: Array<{
    quantity: number;
    reserved: number;
    reorderLevel: number;
  }>;
  stock?: number;
  averageRating?: number;
  reviewCount?: number;
  isInStock?: boolean;
  isOnSale?: boolean;
  discountPercentage?: number;
}

export interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ProductsResponse {
  products: BackendProduct[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API Service Class
class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Frontend-Client/1.0',
        ...options.headers,
      },
      ...options,
    };

    console.log(`[API Service] Making request to: ${url}`);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(
          `API request failed: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`[API Service] Request successful:`, data);
      return data;
    } catch (error) {
      console.error(`[API Service] Request failed for ${url}:`, error);
      throw error;
    }
  }

  // Products API
  async getProducts(params?: {
    page?: number;
    limit?: number;
    categoryId?: string;
    sellerId?: string;
    search?: string;
    isActive?: boolean;
    isFeatured?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<BackendApiResponse<ProductsResponse>> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`;
    
    return this.request<BackendApiResponse<ProductsResponse>>(endpoint);
  }

  async getFeaturedProducts(
    limit: number = 12
  ): Promise<BackendApiResponse<BackendProduct[]>> {
    return this.request<BackendApiResponse<BackendProduct[]>>(
      `/api/products/featured?limit=${limit}`
    );
  }

  async getProduct(id: string): Promise<BackendApiResponse<BackendProduct>> {
    return this.request<BackendApiResponse<BackendProduct>>(
      `/api/products/${id}`
    );
  }

  async getProductBySlug(slug: string): Promise<BackendApiResponse<BackendProduct>> {
    return this.request<BackendApiResponse<BackendProduct>>(
      `/api/products/slug/${slug}`
    );
  }

  async getSellerProducts(
    sellerId: string,
    params?: { page?: number; limit?: number }
  ): Promise<BackendApiResponse<ProductsResponse>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    
    const queryString = searchParams.toString();
    const endpoint = `/api/products/seller/${sellerId}${queryString ? `?${queryString}` : ''}`;
    
    return this.request<BackendApiResponse<ProductsResponse>>(endpoint);
  }

  // Categories API (when you need it)
  async getCategories(): Promise<BackendApiResponse<any[]>> {
    return this.request<BackendApiResponse<any[]>>('/api/categories');
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/');
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Helper functions to transform backend data to frontend format
export function transformBackendProductToFrontend(backendProduct: BackendProduct) {
  return {
    id: backendProduct.id,
    name: backendProduct.name,
    price: backendProduct.price,
    compare_price: backendProduct.comparePrice,
    description: backendProduct.shortDescription || backendProduct.description,
    image: backendProduct.images?.[0] || '/images/default.jpg',
    is_featured: backendProduct.isFeatured,
    // Additional fields that might be useful
    brand: backendProduct.brand,
    model: backendProduct.model,
    slug: backendProduct.slug,
    stock: backendProduct.stock,
    isInStock: backendProduct.isInStock,
    isOnSale: backendProduct.isOnSale,
    discountPercentage: backendProduct.discountPercentage,
    category: backendProduct.category,
    seller: backendProduct.seller,
  };
}

export default apiService;
