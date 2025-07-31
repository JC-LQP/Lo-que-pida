import { Address } from '../../addresses/entities/address.entity';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/entities/order.entity';
export declare class Customer {
    id: string;
    user: User;
    createdAt: Date;
    addresses: Address[];
    orders: Order[];
}
