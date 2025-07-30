import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { CreateCustomerInput } from './dto/create-customer.input';
import { UpdateCustomerInput } from './dto/update-customer.input';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(input: CreateCustomerInput): Promise<Customer> {
    const user = await this.userRepository.findOne({ where: { id: input.userId } });
    if (!user) throw new NotFoundException('User not found');

    const customer = this.customerRepository.create({ user });
    return this.customerRepository.save(customer);
  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id }, relations: ['user'] });
    if (!customer) throw new NotFoundException('Customer not found');
    return customer;
  }

  async update(input: UpdateCustomerInput): Promise<Customer> {
    const customer = await this.findOne(input.id);
    if (input.userId) {
      const user = await this.userRepository.findOne({ where: { id: input.userId } });
      if (!user) throw new NotFoundException('User not found');
      customer.user = user;
    }
    return this.customerRepository.save(customer);
  }

  async remove(id: string): Promise<Customer> {
    const customer = await this.findOne(id);
    return this.customerRepository.remove(customer);
  }
}
