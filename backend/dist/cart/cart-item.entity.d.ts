import { Cart } from './cart.entity';
import { Product } from '../products/product.entity';
export declare class CartItem {
    cartId: string;
    productId: string;
    cart: Cart;
    product: Product;
    quantity: number;
}
