import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    customer: Customer;
    items: OrderItem[];
    status: OrderStatus;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}
