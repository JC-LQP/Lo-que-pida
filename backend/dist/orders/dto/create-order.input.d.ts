import { OrderStatus } from '../entities/order.entity';
export declare class CreateOrderInput {
    customerId: string;
    shippingInfoId?: string;
    paymentId?: string;
    status: OrderStatus;
    total: number;
}
