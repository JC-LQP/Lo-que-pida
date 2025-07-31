import { SellerStatus } from '../entities/seller.entity';
export declare class CreateSellerInput {
    userId: string;
    storeName: string;
    storeDescription?: string;
    storeLogo?: string;
    subscriptionId?: string;
    status?: SellerStatus;
}
