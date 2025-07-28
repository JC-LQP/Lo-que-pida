import { Resolver, Query } from '@nestjs/graphql';
import { Customer } from './models/customer.model';

/* The `CustomersResolver` class in TypeScript defines a resolver for fetching customer data with a
`getCustomers` method that returns a static array of customer objects. */
@Resolver(() => Customer)
export class CustomersResolver {
  @Query(() => [Customer])
  getCustomers(): Customer[] {
    // por ahora devolvemos un arreglo estático de prueba
    return [
      {
        id: '1',
        fullName: 'Juan Pérez',
        email: 'juan@example.com',
        phoneNumber: '0991234567',
      },
    ];
  }
}
