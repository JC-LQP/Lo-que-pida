import { Customer } from '../customers/customer.entity';
export declare enum NotificationType {
    ORDER = "order",
    PAYMENT = "payment",
    GENERAL = "general"
}
export declare class Notification {
    id: string;
    customer: Customer;
    type: NotificationType;
    message: string;
    isRead: boolean;
    createdAt: Date;
}
