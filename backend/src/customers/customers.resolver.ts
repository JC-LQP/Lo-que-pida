import { Resolver, Query, Mutation, Args, ResolveField, Parent } from '@nestjs/graphql';
import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';

@Resolver(() => Customer)
export class CustomersResolver {
  constructor(private readonly customersService: CustomersService) {}

  @Mutation(() => Customer)
  createCustomer(@Args('input') input: CreateCustomerInput): Promise<Customer> {
    return this.customersService.create(input);
  }

  @Query(() => [Customer], { name: 'customers' })
  findAll(): Promise<Customer[]> {
    return this.customersService.findAll();
  }

  @Query(() => Customer, { name: 'customer' })
  findOne(@Args('id', { type: () => String }) id: string): Promise<Customer> {
    return this.customersService.findOne(id);
  }

  @Mutation(() => Customer)
  updateCustomer(@Args('input') input: UpdateCustomerInput): Promise<Customer> {
    return this.customersService.update(input);
  }

  @Mutation(() => Customer)
  removeCustomer(@Args('id', { type: () => String }) id: string): Promise<Customer> {
    return this.customersService.remove(id);
  }

  @ResolveField(() => String)
  email(@Parent() customer: Customer): string {
    return customer.user?.email || '';
  }

  @ResolveField(() => String)
  fullName(@Parent() customer: Customer): string {
    return customer.user?.fullName || '';
  }

  @ResolveField(() => String, { nullable: true })
  phoneNumber(@Parent() customer: Customer): string | null {
    // Assuming phoneNumber might be a field on User or Customer
    // For now returning null, can be updated when the field is added
    return null;
  }
}
