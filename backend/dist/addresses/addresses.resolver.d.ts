import { AddressesService } from './addresses.service';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
export declare class AddressesResolver {
    private readonly addressesService;
    constructor(addressesService: AddressesService);
    createAddress(input: CreateAddressInput): Promise<Address>;
    findAll(): Promise<Address[]>;
    findOne(id: string): Promise<Address>;
    updateAddress(input: UpdateAddressInput): Promise<Address>;
    removeAddress(id: string): Promise<boolean>;
}
