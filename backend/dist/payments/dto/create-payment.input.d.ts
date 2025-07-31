import { PaymentProvider } from '../entities/payment.entity';
export declare class CreatePaymentInput {
    orderId: string;
    provider: PaymentProvider;
    transactionId?: string;
}
