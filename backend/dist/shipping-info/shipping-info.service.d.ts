import { Repository } from 'typeorm';
import { ShippingInfo } from './entities/shipping-info.entity';
import { CreateShippingInfoInput } from './dto/create-shipping-info.input';
import { UpdateShippingInfoInput } from './dto/update-shipping-info.input';
export declare class ShippingInfoService {
    private readonly shippingInfoRepository;
    constructor(shippingInfoRepository: Repository<ShippingInfo>);
    create(input: CreateShippingInfoInput): Promise<ShippingInfo>;
    findAll(): Promise<ShippingInfo[]>;
    findOne(id: string): Promise<ShippingInfo>;
    update(id: string, input: UpdateShippingInfoInput): Promise<ShippingInfo>;
    remove(id: string): Promise<ShippingInfo>;
}
