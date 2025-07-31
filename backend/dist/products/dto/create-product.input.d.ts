import { ProductCondition } from '../../common/enums/product-condition.enum';
export declare class CreateProductInput {
    name: string;
    description?: string;
    price: number;
    condition: ProductCondition;
    sellerId: string;
}
