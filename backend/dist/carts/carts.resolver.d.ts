import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { AddItemToCartInput } from './dto/add-item-to-cart.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
export declare class CartsResolver {
    private readonly cartsService;
    constructor(cartsService: CartsService);
    createCart(input: CreateCartInput): Promise<Cart>;
    addItemToCart(input: AddItemToCartInput): Promise<CartItem>;
    updateCartItem(input: UpdateCartItemInput): Promise<CartItem>;
    removeCartItem(itemId: string): Promise<boolean>;
    findCartByCustomer(customerId: string): Promise<Cart | null>;
}
