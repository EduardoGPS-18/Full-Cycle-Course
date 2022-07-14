import { Customer } from "../entities/customer";
import { Order } from "../entities/order";
import { OrderItem } from "../entities/order-item";
import { OrderService } from "./order.service";

describe("Order service unit tests", () => {
  it("should throw error if order has no items", () => {
    const customer = new Customer("1", "Customer 1");

    expect(() => OrderService.placeOrder(customer, [])).toThrowError("Order must have at least one item");
  });

  it("should place an order", () => {
    const customer = new Customer("1", "Customer 1");
    const item1 = new OrderItem("i1", "Item 1", 10, "p1", 2);

    const order = OrderService.placeOrder(customer, [item1]);

    expect(customer.rewardPoints).toBe(10);
    expect(order.total()).toBe(20);
  });

  it("should sum total order price", () => {
    const item1 = new OrderItem("1", "Item 1", 100, "p1", 1);
    const item2 = new OrderItem("2", "Item 2", 200, "p2", 2);
    const order1 = new Order("o1", "c1", [item1]);
    const order2 = new Order("o2", "c2", [item2]);

    const total = OrderService.sumTotalOrderPrice([order1, order2]);

    expect(total).toBe(500);
  });
});
