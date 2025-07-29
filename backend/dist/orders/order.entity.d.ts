import { Customer } from '../customers/customer.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    IN_PROCESS = "in_process",
    SHIPPED = "shipped",
    DELIVERED = "delivered"
}
export declare class Order {
    id: string;
    customer: Customer;
    totalAmount: number;
    status: OrderStatus;
    createdAt: Date;
}
