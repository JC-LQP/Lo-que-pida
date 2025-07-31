import { Customer } from '../../customers/entities/customer.entity';
export declare class Address {
    id: string;
    recipientName: string;
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postalCode?: string;
    phoneNumber?: string;
    isDefault?: boolean;
    customer: Customer;
    customer_id: string;
    createdAt: Date;
    updatedAt: Date;
}
