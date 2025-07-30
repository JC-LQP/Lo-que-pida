import { InputType, Field, registerEnumType } from '@nestjs/graphql';
import { PaymentProvider } from '../entities/payment.entity';

registerEnumType(PaymentProvider, { name: 'PaymentProvider' });

@InputType()
export class CreatePaymentInput {
  @Field(() => String)
  orderId: string;

  @Field(() => PaymentProvider)
  provider: PaymentProvider;

  @Field(() => String, { nullable: true })
  transactionId?: string;
}
