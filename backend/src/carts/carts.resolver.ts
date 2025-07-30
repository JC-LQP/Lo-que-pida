import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { CartsService } from './carts.service';
import { Cart } from './entities/cart.entity';
import { CartItem } from './entities/cart-item.entity';
import { CreateCartInput } from './dto/create-cart.input';
import { AddItemToCartInput } from './dto/add-item-to-cart.input';
import { UpdateCartItemInput } from './dto/update-cart-item.input';

@Resolver(() => Cart)
export class CartsResolver {
  constructor(private readonly cartsService: CartsService) {}

  @Mutation(() => Cart)
  createCart(@Args('input') input: CreateCartInput) {
    return this.cartsService.create(input);
  }

  @Mutation(() => CartItem)
  addItemToCart(@Args('input') input: AddItemToCartInput) {
    return this.cartsService.addItem(input);
  }

  @Mutation(() => CartItem)
  updateCartItem(@Args('input') input: UpdateCartItemInput) {
    return this.cartsService.updateItem(input);
  }

  @Mutation(() => Boolean)
  removeCartItem(@Args('itemId', { type: () => String }) itemId: string) {
    return this.cartsService.removeItem(itemId);
  }

  @Query(() => Cart, { nullable: true })
  findCartByCustomer(
    @Args('customerId', { type: () => String }) customerId: string,
  ) {
    return this.cartsService.findCartByCustomer(customerId);
  }
}
