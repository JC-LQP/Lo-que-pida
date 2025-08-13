// ============================================================================
// TIPOS PRINCIPALES PARA LO-QUE-PIDA
// ============================================================================

// Usuario del sistema
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location: Location;
  rating: number;
  totalReviews: number;
  isVerified: boolean;
  isSeller: boolean;
  joinedAt: string;
  lastActive: string;
}

// Ubicación geográfica
export interface Location {
  country: string;
  state: string;
  city: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Producto en el catálogo
export interface Product {
  id: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  category: Category;
  subcategory?: string;
  seller: User;
  stock: number;
  condition: ProductCondition;
  tags: string[];
  specifications: Record<string, any>;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

// Solicitud de producto (Lo que pida)
export interface ProductRequest {
  id: string;
  requester: User;
  title: string;
  description: string;
  images?: string[];
  category: Category;
  budget: BudgetRange;
  location: Location;
  urgency: UrgencyLevel;
  tags: string[];
  specifications?: Record<string, any>;
  status: RequestStatus;
  responses: ProductResponse[];
  createdAt: string;
  expiresAt?: string;
}

// Respuesta a una solicitud de producto
export interface ProductResponse {
  id: string;
  request: ProductRequest;
  seller: User;
  title: string;
  description: string;
  images: string[];
  price: number;
  currency: string;
  estimatedDelivery: string;
  terms: string;
  status: ResponseStatus;
  createdAt: string;
}

// Categorías de productos
export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  parentId?: string;
  subcategories?: Category[];
  isActive: boolean;
}

// Rango de presupuesto
export interface BudgetRange {
  min: number;
  max: number;
  currency: string;
  isNegotiable: boolean;
}

// Enums
export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
  POOR = 'poor'
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum RequestStatus {
  ACTIVE = 'active',
  FULFILLED = 'fulfilled',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum ResponseStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  NEGOTIATING = 'negotiating'
}

export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

// Pedido/Orden
export interface Order {
  id: string;
  buyer: User;
  seller: User;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  shippingAddress: Location;
  billingAddress: Location;
  paymentMethod: PaymentMethod;
  tracking?: TrackingInfo;
  createdAt: string;
  updatedAt: string;
}

// Item del pedido
export interface OrderItem {
  id: string;
  product: Product;
  quantity: number;
  price: number;
  total: number;
}

// Método de pago
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer' | 'cash';
  name: string;
  details: Record<string, any>;
  isDefault: boolean;
}

// Información de seguimiento
export interface TrackingInfo {
  trackingNumber: string;
  carrier: string;
  status: string;
  estimatedDelivery: string;
  updates: TrackingUpdate[];
}

export interface TrackingUpdate {
  status: string;
  description: string;
  location: string;
  timestamp: string;
}

// Reseña/Calificación
export interface Review {
  id: string;
  reviewer: User;
  reviewee: User;
  order?: Order;
  rating: number;
  comment: string;
  images?: string[];
  isVerified: boolean;
  createdAt: string;
}

// Chat/Mensajería
export interface Conversation {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversation: Conversation;
  sender: User;
  content: string;
  type: 'text' | 'image' | 'file' | 'product' | 'offer';
  attachments?: Attachment[];
  isRead: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

// Notificación
export interface Notification {
  id: string;
  user: User;
  title: string;
  message: string;
  type: NotificationType;
  data?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
}

export enum NotificationType {
  NEW_RESPONSE = 'new_response',
  ORDER_UPDATE = 'order_update',
  MESSAGE = 'message',
  REVIEW = 'review',
  SYSTEM = 'system'
}

// Estados de carga y UI
export interface LoadingState {
  isLoading: boolean;
  error?: string;
  success?: boolean;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: PaginationInfo;
}

// Filtros y búsqueda
export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: ProductCondition;
  location?: string;
  sortBy?: SortOption;
  sortOrder?: 'asc' | 'desc';
}

export enum SortOption {
  RELEVANCE = 'relevance',
  PRICE_LOW_HIGH = 'price_asc',
  PRICE_HIGH_LOW = 'price_desc',
  NEWEST = 'newest',
  OLDEST = 'oldest',
  RATING = 'rating',
  DISTANCE = 'distance'
}
