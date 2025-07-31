import { CustomersService } from './customers.service';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
export declare class CustomersResolver {
    private readonly customersService;
    constructor(customersService: CustomersService);
    createCustomer(input: CreateCustomerInput): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer>;
    updateCustomer(input: UpdateCustomerInput): Promise<Customer>;
    removeCustomer(id: string): Promise<Customer>;
}
