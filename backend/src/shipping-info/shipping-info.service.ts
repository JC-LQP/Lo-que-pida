import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShippingInfo } from './entities/shipping-info.entity';
import { CreateShippingInfoInput } from './dto/create-shipping-info.input';
import { UpdateShippingInfoInput } from './dto/update-shipping-info.input';

@Injectable()
export class ShippingInfoService {
  constructor(
    @InjectRepository(ShippingInfo)
    private readonly shippingInfoRepository: Repository<ShippingInfo>,
  ) {}

  async create(input: CreateShippingInfoInput): Promise<ShippingInfo> {
    const shippingInfo = this.shippingInfoRepository.create(input);
    return this.shippingInfoRepository.save(shippingInfo);
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
