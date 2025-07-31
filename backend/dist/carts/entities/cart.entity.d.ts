import { Customer } from '../../customers/entities/customer.entity';
import { CartItem } from './cart-item.entity';
export declare class Cart {
    id: string;
    customer: Customer;
    items: CartItem[];
    createdAt: Date;
}
