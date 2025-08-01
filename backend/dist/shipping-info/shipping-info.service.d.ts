import { Repository } from 'typeorm';
import { ShippingInfo } from './entities/shipping-info.entity';
import { CreateShippingInfoInput } from './dto/create-shipping-info.input';
import { UpdateShippingInfoInput } from './dto/update-shipping-info.input';
import { Order } from '../orders/entities/order.entity';
import { Address } from '../addresses/entities/address.entity';
export declare class ShippingInfoService {
    private readonly shippingInfoRepository;
    private readonly orderRepository;
    private readonly addressRepository;
    constructor(shippingInfoRepository: Repository<ShippingInfo>, orderRepository: Repository<Order>, addressRepository: Repository<Address>);
    create(input: CreateShippingInfoInput): Promise<ShippingInfo>;
    findAll(): Promise<ShippingInfo[]>;
    findOne(id: string): Promise<ShippingInfo>;
    update(id: string, input: UpdateShippingInfoInput): Promise<ShippingInfo>;
    remove(id: string): Promise<ShippingInfo>;
}
