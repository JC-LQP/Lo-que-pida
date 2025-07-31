export declare class CreateShippingInfoInput {
    orderId: string;
    addressId: string;
    shippingMethod: string;
    trackingNumber?: string;
    carrierName?: string;
    estimatedDeliveryDate?: Date;
}
