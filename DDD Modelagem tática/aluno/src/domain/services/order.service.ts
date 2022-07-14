import { v4 as uuid } from "uuid";
import { Customer } from "../entities/customer";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/order-item";

export class OrderService {
  static placeOrder(customer: Customer, items: OrderItem[]): Order {
    if (items.length == 0) {
      throw new Error("Order must have at least one item");
    }
    const order = new Order(uuid(), customer.id, items);
    customer.addRewardPoints(order.total() / 2);
    return order;
  }

  static sumTotalOrderPrice(orders: Order[]): number {
    return orders.reduce((acc, order) => acc + order.total(), 0);
  }
}
