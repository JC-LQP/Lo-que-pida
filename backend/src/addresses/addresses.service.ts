import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { Customer } from '../customers/entities/customer.entity';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  async create(input: CreateAddressInput): Promise<Address> {
    const customer = await this.customerRepository.findOne({ where: { id: input.customerId } });
    if (!customer) throw new NotFoundException('Customer not found');

    const address = this.addressRepository.create({ ...input, customer });
    return this.addressRepository.save(address);
  }

  findAll(): Promise<Address[]> {
    return this.addressRepository.find({ relations: ['customer'] });
  }

  async findOne(id: string): Promise<Address> {
    const address = await this.addressRepository.findOne({ where: { id }, relations: ['customer'] });
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async update(id: string, input: UpdateAddressInput): Promise<Address> {
    const address = await this.findOne(id);
    Object.assign(address, input);
    return this.addressRepository.save(address);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.addressRepository.delete(id);
    return result.affected > 0;
  }
}
