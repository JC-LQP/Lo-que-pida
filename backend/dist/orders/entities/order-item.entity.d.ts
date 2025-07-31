import { Order } from './order.entity';
import { Product } from '../../products/entities/product.entity';
export declare class OrderItem {
    orderId: string;
    productId: string;
    order: Order;
    product: Product;
    quantity: number;
    unitPrice: number;
}
