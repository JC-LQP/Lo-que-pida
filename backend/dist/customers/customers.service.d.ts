import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { User } from '../users/entities/user.entity';
export declare class CustomersService {
    private readonly customerRepository;
    private readonly userRepository;
    constructor(customerRepository: Repository<Customer>, userRepository: Repository<User>);
    create(input: CreateCustomerInput): Promise<Customer>;
    findAll(): Promise<Customer[]>;
    findOne(id: string): Promise<Customer>;
    update(input: UpdateCustomerInput): Promise<Customer>;
    remove(id: string): Promise<Customer>;
}
