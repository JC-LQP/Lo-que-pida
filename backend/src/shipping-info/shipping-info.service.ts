import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingInfo } from './entities/shipping-info.entity';
import { CreateShippingInfoInput } from './dto/create-shipping-info.input';
import { UpdateShippingInfoInput } from './dto/update-shipping-info.input';
import { Order } from '../orders/entities/order.entity';
import { Address } from '../addresses/entities/address.entity';

@Injectable()
export class ShippingInfoService {
  constructor(
    @InjectRepository(ShippingInfo)
    private readonly shippingInfoRepository: Repository<ShippingInfo>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {}

  async create(input: CreateShippingInfoInput): Promise<ShippingInfo> {
    const { orderId, addressId, ...shippingData } = input;

    // Check if shipping info already exists for this order
    const existingShippingInfo = await this.shippingInfoRepository.findOne({
      where: { order: { id: orderId } }
    });
    if (existingShippingInfo) {
      throw new Error(`Shipping info already exists for order ${orderId}`);
    }

    // Load the Order and Address entities
    const order = await this.orderRepository.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Order with id ${orderId} not found`);
    }

    const address = await this.addressRepository.findOne({ where: { id: addressId } });
    if (!address) {
      throw new NotFoundException(`Address with id ${addressId} not found`);
    }

    // Create shipping info with relations
    const shippingInfo = this.shippingInfoRepository.create({
      ...shippingData,
      order,
      address,
    });

    const savedShippingInfo = await this.shippingInfoRepository.save(shippingInfo);
    
    // Return with relations loaded
    const result = await this.shippingInfoRepository.findOne({
      where: { id: savedShippingInfo.id },
      relations: ['order', 'address'],
    });
    
    if (!result) {
      throw new NotFoundException(`Failed to retrieve created ShippingInfo`);
    }
    
    return result;
  }

  async findAll(): Promise<ShippingInfo[]> {
    return this.shippingInfoRepository.find({ relations: ['order', 'address'] });
  }

  async findOne(id: string): Promise<ShippingInfo> {
    const shippingInfo = await this.shippingInfoRepository.findOne({
      where: { id },
      relations: ['order', 'address'],
    });
    if (!shippingInfo) {
      throw new NotFoundException(`ShippingInfo with id ${id} not found`);
    }
    return shippingInfo;
  }

  async update(id: string, input: UpdateShippingInfoInput): Promise<ShippingInfo> {
    const shippingInfo = await this.findOne(id);
    Object.assign(shippingInfo, input);
    return this.shippingInfoRepository.save(shippingInfo);
  }

  async remove(id: string): Promise<ShippingInfo> {
    const shippingInfo = await this.findOne(id);
    await this.shippingInfoRepository.remove(shippingInfo);
    return shippingInfo;
  }
}
