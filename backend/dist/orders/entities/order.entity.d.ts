import { Customer } from '../../customers/entities/customer.entity';
import { OrderItem } from './order-item.entity';
import { Payment } from '../../payments/entities/payment.entity';
import { ShippingInfo } from '../../shipping-info/entities/shipping-info.entity';
export declare enum OrderStatus {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED = "delivered",
    CANCELLED = "cancelled"
}
export declare class Order {
    id: string;
    customer?: Customer;
    items: OrderItem[];
    payment?: Payment;
    shippingInfo?: ShippingInfo;
    status: OrderStatus;
    total: number;
    createdAt: Date;
    updatedAt: Date;
}
