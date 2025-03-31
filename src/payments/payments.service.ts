import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Stripe from 'stripe';
import { PaymentResponse } from './responses/payment.response';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor() {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (!stripeSecretKey) {
      throw new BadRequestException('Stripe secret key is missing!');
    }

    this.stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-02-24.acacia',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
  ): Promise<PaymentResponse> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amount * 100,
        currency,
        payment_method_types: ['card'],
      });

      if (!paymentIntent.client_secret) {
        throw new InternalServerErrorException(
          'Failed to generate client_secret',
        );
      }

      return { client_secret: paymentIntent.client_secret };
    } catch (error) {
      console.error(`Error create payment intent: ${error.message}`);
      throw new InternalServerErrorException(
        `Payment failed: ${error.message}`,
      );
    }
  }
}
