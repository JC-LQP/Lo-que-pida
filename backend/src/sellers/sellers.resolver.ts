import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { SellersService } from './sellers.service';
import { Seller } from './entities/seller.entity';
import { CreateSellerInput } from './dto/create-seller.input';
import { UpdateSellerInput } from './dto/update-seller.input';

@Resolver(() => Seller)
export class SellersResolver {
  constructor(private readonly sellersService: SellersService) {}

  @Mutation(() => Seller)
  createSeller(@Args('input') input: CreateSellerInput): Promise<Seller> {
    return this.sellersService.create(input);
  }

  @Query(() => [Seller], { name: 'sellers' })
  findAll(): Promise<Seller[]> {
    return this.sellersService.findAll();
  }

  @Query(() => Seller, { name: 'seller' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Seller> {
    return this.sellersService.findOne(id);
  }

  @Mutation(() => Seller)
  updateSeller(@Args('input') input: UpdateSellerInput): Promise<Seller> {
    return this.sellersService.update(input.id, input);
  }

  @Mutation(() => Seller)
  removeSeller(@Args('id', { type: () => String }) id: string): Promise<Seller> {
    return this.sellersService.remove(id);
  }
}
