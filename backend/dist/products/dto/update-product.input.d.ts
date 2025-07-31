import { CreateProductInput } from './create-product.input';
import { ProductCondition } from '../../common/enums/product-condition.enum';
declare const UpdateProductInput_base: import("@nestjs/common").Type<Partial<CreateProductInput>>;
export declare class UpdateProductInput extends UpdateProductInput_base {
    sellerId?: string;
    condition?: ProductCondition;
}
export {};
