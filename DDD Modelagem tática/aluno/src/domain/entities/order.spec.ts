import { Order } from "./order";
import { OrderItem } from "./order-item";

describe("Order unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Order("", "123", [])).toThrowError("Id is required");
  });

  it("should throw error when customerId is empty", () => {
    expect(() => new Order("123", "", [])).toThrowError("CustomerId is required");
  });

  it("should throw error when items is empty", () => {
    expect(() => new Order("123", "321", [])).toThrowError("Item are required");
  });

  it("should calculate total", () => {
    const item1 = new OrderItem("1", "Item 1", 50, "p1", 2);
    const item2 = new OrderItem("2", "Item 2", 150, "p2", 3);
    const order = new Order("123", "321", [item1, item2]);

    const item3 = new OrderItem("3", "Item 3", 200, "p3", 1);
    const order2 = new Order("123", "321", [item1, item2, item3]);

    const totalOrder1 = order.total();
    const totalOrder2 = order2.total();

    expect(totalOrder1).toBe(550);
    expect(totalOrder2).toBe(750);
  });

  it("should remove an item from order items", () => {
    const item1 = new OrderItem("1", "Item 1", 50, "p1", 2);
    const item2 = new OrderItem("2", "Item 2", 150, "p2", 3);
    const order = new Order("123", "321", [item1, item2]);

    order.removeOrderItem("1");

    expect(order.items).toEqual([
      {
        _id: "2",
        _name: "Item 2",
        _price: 150,
        _productId: "p2",
        _quantity: 3,
      },
    ]);
  });

  it("should throw error if the item qtd is less or equals than zero", () => {
    const item = new OrderItem("1", "Item 1", 50, "p1", 0);

    const call = () => new Order("123", "321", [item]);

    expect(call).toThrowError("Item quantity must be greater than zero");
  });
});
