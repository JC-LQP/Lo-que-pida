import { Order } from '../../orders/entities/order.entity';
import { Address } from '../../addresses/entities/address.entity';
export declare class ShippingInfo {
    id: string;
    order: Order;
    address: Address;
    shippingMethod: string;
    trackingNumber: string;
    carrierName: string;
    estimatedDeliveryDate: Date;
}
