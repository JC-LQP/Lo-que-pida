import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ShippingInfoService } from './shipping-info.service';
import { ShippingInfo } from './entities/shipping-info.entity';
import { CreateShippingInfoInput } from './dto/create-shipping-info.input';
import { UpdateShippingInfoInput } from './dto/update-shipping-info.input';

@Resolver(() => ShippingInfo)
export class ShippingInfoResolver {
  constructor(private readonly shippingInfoService: ShippingInfoService) {}

  @Mutation(() => ShippingInfo)
  createShippingInfo(@Args('input') input: CreateShippingInfoInput): Promise<ShippingInfo> {
    return this.shippingInfoService.create(input);
  }

  @Query(() => [ShippingInfo], { name: 'shippingInfos' })
  findAll(): Promise<ShippingInfo[]> {
    return this.shippingInfoService.findAll();
  }

  @Query(() => ShippingInfo, { name: 'shippingInfo' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<ShippingInfo> {
    return this.shippingInfoService.findOne(id);
  }

  @Mutation(() => ShippingInfo)
  updateShippingInfo(@Args('input') input: UpdateShippingInfoInput): Promise<ShippingInfo> {
    return this.shippingInfoService.update(input.id, input);
  }

  @Mutation(() => ShippingInfo)
  removeShippingInfo(@Args('id', { type: () => String }) id: string): Promise<ShippingInfo> {
    return this.shippingInfoService.remove(id);
  }
}
