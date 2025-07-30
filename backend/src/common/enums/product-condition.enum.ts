import { registerEnumType } from '@nestjs/graphql';

export enum ProductCondition {
  NEW = 'NEW',
  USED = 'USED',
  REFURBISHED = 'REFURBISHED',
}

registerEnumType(ProductCondition, {
  name: 'ProductCondition',
});
