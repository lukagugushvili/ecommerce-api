import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Payment status enum',
});
