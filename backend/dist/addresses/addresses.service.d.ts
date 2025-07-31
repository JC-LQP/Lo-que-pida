import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { Customer } from '../customers/entities/customer.entity';
export declare class AddressesService {
    private readonly addressRepository;
    private readonly customerRepository;
    constructor(addressRepository: Repository<Address>, customerRepository: Repository<Customer>);
    create(input: CreateAddressInput): Promise<Address>;
    findAll(): Promise<Address[]>;
    findOne(id: string): Promise<Address>;
    update(id: string, input: UpdateAddressInput): Promise<Address>;
    remove(id: string): Promise<boolean>;
}
