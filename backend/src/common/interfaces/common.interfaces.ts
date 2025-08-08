// Base entity interface with common fields
export interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
}

// Pagination interface for list responses
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Paginated response wrapper
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Standard API response format
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Pagination options for requests
export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

// Search and filter interface
export interface SearchOptions {
  search?: string;
  filters?: Record<string, any>;
}

// File upload interface
export interface FileUpload {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}