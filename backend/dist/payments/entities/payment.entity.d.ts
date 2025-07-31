import { Order } from '../../orders/entities/order.entity';
export declare enum PaymentProvider {
    STRIPE = "stripe",
    KUSHKI = "kushki",
    LOCAL = "local"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    PAID = "paid",
    FAILED = "failed"
}
export declare class Payment {
    id: string;
    order: Order;
    provider: PaymentProvider;
    status: PaymentStatus;
    transactionId: string;
    createdAt: Date;
}
