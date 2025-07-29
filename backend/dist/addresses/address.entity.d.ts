import { Customer } from '../customers/customer.entity';
export declare class Address {
    id: string;
    customer: Customer;
    recipientName: string;
    streetAddress: string;
    city: string;
    province: string;
    country: string;
    postalCode: string;
    phoneNumber: string;
    isDefault: boolean;
}
