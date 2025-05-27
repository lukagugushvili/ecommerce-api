import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { OrdersService } from './orders.service';
import { Order } from './schema/order.schema';
import { OrderStatus } from 'src/enums/product-status.enum';
import { UpdatePaymentStatusInput } from './dto/update-payment-status.input';
import { UseGuards } from '@nestjs/common';
import { GqlJwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { Roles } from 'src/decorators/user-role.decorator';
import { UserRoles } from 'src/enums/user-roles.enum';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(GqlJwtAuthGuard)
@Resolver(() => Order)
export class OrdersResolver {
  constructor(private readonly ordersService: OrdersService) {}

  @Mutation(() => Order)
  async createOrder(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Order> {
    return await this.ordersService.createOrder(userId);
  }

  @Query(() => [Order], { name: 'orders' })
  async getOrders(
    @Args('userId', { type: () => ID }) userId: string,
  ): Promise<Order[]> {
    return this.ordersService.getOrders(userId);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Mutation(() => Order)
  async updateOrderStatus(
    @Args('orderId', { type: () => ID }) orderId: string,
    @Args('status', { type: () => OrderStatus }) status: OrderStatus,
  ): Promise<Order> {
    return this.ordersService.updateOrderStatus(orderId, status);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRoles.ADMIN)
  @Mutation(() => Order)
  async updatePaymentStatus(
    @Args('updatePaymentStatusInput')
    updatePaymentStatusInput: UpdatePaymentStatusInput,
  ): Promise<Order> {
    return this.ordersService.updatePaymentStatus(updatePaymentStatusInput);
  }
}
