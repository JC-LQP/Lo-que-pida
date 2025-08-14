/**
 * Standard API Response Interface
 * This ensures all API endpoints return responses in a consistent format
 * Makes it easier for frontend developers to handle responses
 */
export interface ApiResponse<T = any> {
  /**
   * Indicates if the operation was successful
   */
  success: boolean;

  /**
   * Human-readable message describing the result
   */
  message: string;

  /**
   * The actual data returned by the endpoint
   * Can be any type depending on the endpoint
   */
  data?: T;

  /**
   * HTTP status code
   */
  statusCode: number;

  /**
   * Additional metadata (optional)
   * Useful for pagination, timestamps, etc.
   */
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
    timestamp?: string;
    [key: string]: any;
  };

  /**
   * Array of errors if any occurred (optional)
   * Useful for validation errors
   */
  errors?: Array<{
    field?: string;
    message: string;
    code?: string;
  }>;
}
