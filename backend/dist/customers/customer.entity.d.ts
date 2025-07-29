import { User } from '../users/entities/user.entity';
import { Address } from '../addresses/address.entity';
export declare class Customer {
    id: string;
    user: User;
    country: string;
    postalCode: string;
    addresses: Address[];
}
