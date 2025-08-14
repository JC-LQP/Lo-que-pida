import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

export interface BestBuyProduct {
  sku: number;
  name: string;
  manufacturer?: string;
  salePrice?: number;
  regularPrice?: number;
  onlineAvailability?: boolean;
  shippingWeight?: number;
  class?: string;
  subclass?: string;
  department?: string;
  quantityLimit?: number;
  longDescription?: string;
  shortDescription?: string;
  weight?: number;
  width?: number;
  height?: number;
  depth?: number;
  images?: Array<{
    rel: string;
    unitOfMeasure: string;
    width: number;
    height: number;
    href: string;
  }>;
  modelNumber?: string;
  categoryPath?: Array<{
    id: string;
    name: string;
  }>;
  shippingLevelsOfService?: Array<{
    serviceLevelId: number;
    serviceLevelName: string;
    unitShippingPrice: number;
  }>;
}

export interface BestBuySearchResponse {
  from: number;
  to: number;
  total: number;
  currentPage: number;
  totalPages: number;
  queryTime: string;
  totalTime: string;
  partial: boolean;
  canonicalUrl: string;
  products: BestBuyProduct[];
}

@Injectable()
export class BestBuyService {
  private readonly logger = new Logger(BestBuyService.name);
  private readonly axiosInstance: AxiosInstance;
  private readonly baseUrl = 'https://api.bestbuy.com/v1';
  private readonly apiKey: string;

  constructor() {
    this.apiKey = process.env.BESTBUY_API_KEY || '';
    if (!this.apiKey) {
      this.logger.warn('BESTBUY_API_KEY not found in environment variables');
    }

    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Lo-que-pida/1.0.0',
      },
    });
  }

  /**
   * Get a single product by SKU
   */
  async getProduct(sku: string): Promise<BestBuyProduct | null> {
    if (!this.apiKey) {
      throw new HttpException('Best Buy API key not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    try {
      const response = await this.axiosInstance.get(`/products/${sku}.json`, {
        params: {
          show: 'manufacturer,salePrice,onlineAvailability,shippingWeight,class,subclass,department,regularPrice,quantityLimit,sku,name,salePrice,longDescription,shortDescription,weight,width,height,categoryPath.name,depth,images,modelNumber,shippingLevelsOfService',
          apiKey: this.apiKey,
        },
      });

      this.logger.debug(`Fetched product ${sku} from Best Buy API`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          this.logger.warn(`Product ${sku} not found on Best Buy`);
          return null;
        }
        this.logger.error(`Best Buy API error for SKU ${sku}:`, error.response?.data);
        throw new HttpException(
          `Best Buy API error: ${error.response?.statusText}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.logger.error(`Unexpected error fetching product ${sku}:`, error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Search products with filters
   */
  async searchProducts(params: {
    query?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    onSale?: boolean;
    inStock?: boolean;
    page?: number;
    pageSize?: number;
  }): Promise<BestBuySearchResponse> {
    if (!this.apiKey) {
      throw new HttpException('Best Buy API key not configured', HttpStatus.SERVICE_UNAVAILABLE);
    }

    try {
      // Build search criteria
      const searchCriteria: string[] = [];
      
      if (params.query) {
        // Search in name and description
        searchCriteria.push(`search=${encodeURIComponent(params.query)}`);
      }

      if (params.category) {
        searchCriteria.push(`categoryPath.name="${encodeURIComponent(params.category)}"`);
      }

      if (params.minPrice) {
        searchCriteria.push(`salePrice>=${params.minPrice}`);
      }

      if (params.maxPrice) {
        searchCriteria.push(`salePrice<=${params.maxPrice}`);
      }

      if (params.onSale) {
        searchCriteria.push('onSale=true');
      }

      if (params.inStock) {
        searchCriteria.push('onlineAvailability=true');
      }

      // Default to available products if no specific criteria
      if (searchCriteria.length === 0) {
        searchCriteria.push('onlineAvailability=true');
      }

      const page = params.page || 1;
      const pageSize = Math.min(params.pageSize || 25, 100); // Best Buy API max is 100

      const response = await this.axiosInstance.get('/products', {
        params: {
          format: 'json',
          show: 'manufacturer,salePrice,onlineAvailability,shippingWeight,class,subclass,department,regularPrice,quantityLimit,sku,name,longDescription,shortDescription,weight,width,height,categoryPath.name,depth,images,modelNumber,shippingLevelsOfService',
          sort: 'name.asc',
          page,
          pageSize,
          apiKey: this.apiKey,
          ...(searchCriteria.length > 0 && { filter: searchCriteria.join('&') }),
        },
      });

      this.logger.debug(`Searched Best Buy products with criteria: ${searchCriteria.join(', ')}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        this.logger.error('Best Buy API search error:', error.response?.data);
        throw new HttpException(
          `Best Buy API error: ${error.response?.statusText}`,
          error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
      this.logger.error('Unexpected error searching products:', error);
      throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Get featured/popular products
   */
  async getFeaturedProducts(limit: number = 12): Promise<BestBuyProduct[]> {
    try {
      const response = await this.searchProducts({
        inStock: true,
        pageSize: limit,
      });
      
      return response.products || [];
    } catch (error) {
      this.logger.error('Error fetching featured products:', error);
      return [];
    }
  }

  /**
   * Convert Best Buy product to our internal Product format
   */
  convertToInternalProduct(bestBuyProduct: BestBuyProduct): any {
    return {
      id: `bb-${bestBuyProduct.sku}`,
      name: bestBuyProduct.name,
      description: bestBuyProduct.longDescription || bestBuyProduct.shortDescription || '',
      shortDescription: bestBuyProduct.shortDescription,
      price: bestBuyProduct.salePrice || bestBuyProduct.regularPrice || 0,
      comparePrice: bestBuyProduct.regularPrice !== bestBuyProduct.salePrice ? bestBuyProduct.regularPrice : undefined,
      images: bestBuyProduct.images?.map(img => img.href) || [],
      brand: bestBuyProduct.manufacturer,
      sku: bestBuyProduct.sku.toString(),
      modelNumber: bestBuyProduct.modelNumber,
      inStock: bestBuyProduct.onlineAvailability || false,
      isActive: true,
      isFeatured: false,
      category: bestBuyProduct.categoryPath?.[0]?.name,
      categoryPath: bestBuyProduct.categoryPath,
      weight: bestBuyProduct.weight || bestBuyProduct.shippingWeight,
      dimensions: {
        width: bestBuyProduct.width,
        height: bestBuyProduct.height,
        depth: bestBuyProduct.depth,
      },
      source: 'bestbuy',
      sourceId: bestBuyProduct.sku.toString(),
      externalUrl: `https://www.bestbuy.com/site/sku/${bestBuyProduct.sku}.p`,
      quantityLimit: bestBuyProduct.quantityLimit,
      shippingOptions: bestBuyProduct.shippingLevelsOfService,
      class: bestBuyProduct.class,
      subclass: bestBuyProduct.subclass,
      department: bestBuyProduct.department,
    };
  }
}
