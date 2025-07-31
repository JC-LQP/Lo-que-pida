import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { AddItemToCartInput } from './dto/add-item-to-cart.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';
import { Customer } from '../customers/entities/customer.entity';
import { Product } from '../products/entities/product.entity';
export declare class CartsService {
    private cartRepo;
    private itemRepo;
    private customerRepo;
    private productRepo;
    constructor(cartRepo: Repository<Cart>, itemRepo: Repository<CartItem>, customerRepo: Repository<Customer>, productRepo: Repository<Product>);
    create(input: CreateCartInput): Promise<Cart>;
    addItem(input: AddItemToCartInput): Promise<CartItem>;
    updateItem(input: UpdateCartItemInput): Promise<CartItem>;
    removeItem(itemId: string): Promise<boolean>;
    findCartByCustomer(customerId: string): Promise<Cart | null>;
}
