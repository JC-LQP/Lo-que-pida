import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';

@Resolver(() => Address)
export class AddressesResolver {
  constructor(private readonly addressesService: AddressesService) {}

  @Mutation(() => Address)
  createAddress(@Args('input') input: CreateAddressInput): Promise<Address> {
    return this.addressesService.create(input);
  }

  @Query(() => [Address], { name: 'addresses' })
  findAll(): Promise<Address[]> {
    return this.addressesService.findAll();
  }

  @Query(() => Address, { name: 'address' })
  findOne(@Args('id') id: string): Promise<Address> {
    return this.addressesService.findOne(id);
  }

  @Mutation(() => Address)
  updateAddress(@Args('input') input: UpdateAddressInput): Promise<Address> {
    return this.addressesService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  removeAddress(@Args('id') id: string): Promise<boolean> {
    return this.addressesService.remove(id);
  }
}
