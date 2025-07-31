import { ShippingInfoService } from './shipping-info.service';
import { ShippingInfo } from './entities/shipping-info.entity';
import { CreateShippingInfoInput } from './dto/create-shipping-info.input';
import { UpdateShippingInfoInput } from './dto/update-shipping-info.input';
export declare class ShippingInfoResolver {
    private readonly shippingInfoService;
    constructor(shippingInfoService: ShippingInfoService);
    createShippingInfo(input: CreateShippingInfoInput): Promise<ShippingInfo>;
    findAll(): Promise<ShippingInfo[]>;
    findOne(id: string): Promise<ShippingInfo>;
    updateShippingInfo(input: UpdateShippingInfoInput): Promise<ShippingInfo>;
    removeShippingInfo(id: string): Promise<ShippingInfo>;
}
