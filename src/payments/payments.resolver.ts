import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentsService } from './payments.service';
import { PaymentResponse } from './responses/payment.response';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/guards/jwt-auth.guard';

@UseGuards(GqlJwtAuthGuard)
@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Mutation(() => PaymentResponse, { name: 'payment' })
  async createPaymentIntent(
    @Args('amount') amount: number,
  ): Promise<PaymentResponse> {
    const { client_secret } =
      await this.paymentsService.createPaymentIntent(amount);

    return { client_secret: client_secret };
  }
}
