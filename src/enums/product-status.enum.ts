import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Order status enum',
});
