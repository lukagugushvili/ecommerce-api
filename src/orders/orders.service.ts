import {
  BadGatewayException,
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from './schema/order.schema';
import { Model } from 'mongoose';
import { CartService } from 'src/cart/cart.service';
import { OrderStatus } from 'src/enums/product-status.enum';
import { UpdatePaymentStatusInput } from './dto/update-payment-status.input';
import { PaymentStatus } from 'src/enums/payment-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    private readonly cartService: CartService,
  ) {}

  async createOrder(userId: string): Promise<Order> {
    try {
      const cart = await this.cartService.getCart(userId);

      if (!cart || cart.products.length === 0) {
        throw new BadGatewayException('Cart is empty!');
      }

      const order = new this.orderModel({
        user: userId,
        products: cart.products,
        totalPrice: cart.totalPrice,
        status: PaymentStatus.PENDING,
      });

      await order.populate(['user', 'products']);

      await order.save();

      return order;
    } catch (error) {
      console.error(`Error creating order: ${error.message}!`);
      throw new NotFoundException(`Could not create order: ${error.message}`);
    }
  }

  async getOrders(userId: string): Promise<Order[]> {
    try {
      const orders = this.orderModel
        .find({ user: userId })
        .populate('products')
        .exec();

      if (!orders) {
        throw new NotFoundException('No orders found for this user!');
      }

      return orders;
    } catch (error) {
      console.error(`Error getting orders: ${error.message}!`);
      throw new InternalServerErrorException(
        `Failed to retrieve orders: ${error.message}!`,
      );
    }
  }

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
  ): Promise<Order> {
    try {
      if (!Object.values(OrderStatus).includes(status)) {
        throw new BadRequestException(`Invalid order status: ${status}!`);
      }

      const order = await this.orderModel
        .findByIdAndUpdate(orderId, { status }, { new: true })
        .exec();

      if (!order) throw new NotFoundException('Order not found!');

      return order;
    } catch (error) {
      console.error(`Error updating order status: ${error.message}!`);
      throw new InternalServerErrorException(
        `Failed to update order status: ${error.message}!`,
      );
    }
  }

  async updatePaymentStatus(
    updatePaymentStatusInput: UpdatePaymentStatusInput,
  ): Promise<Order> {
    try {
      const { orderId, paymentStatus } = updatePaymentStatusInput;

      const updateStatus = await this.orderModel
        .findByIdAndUpdate(
          orderId,
          { paymentStatus: paymentStatus },
          { new: true },
        )
        .exec();

      if (!updateStatus) throw new NotFoundException('Order not found!');

      return updateStatus;
    } catch (error) {
      console.error(`Error updating payment status: ${error.message}!`);
      throw new InternalServerErrorException(
        `Failed to update payment status: ${error.message}!`,
      );
    }
  }
}
