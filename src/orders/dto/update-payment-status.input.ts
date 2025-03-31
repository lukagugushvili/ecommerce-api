import { Field, InputType } from '@nestjs/graphql';
import { PaymentStatus } from 'src/enums/payment-status.enum';

@InputType()
export class UpdatePaymentStatusInput {
  @Field()
  orderId: string;

  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;
}
