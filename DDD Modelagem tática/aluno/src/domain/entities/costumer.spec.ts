import { Address } from "./address";
import { Customer } from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Customer("", "John")).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => new Customer("123", "")).toThrowError("Name is required");
  });

  it("should change name", () => {
    const customer = new Customer("123", "John");
    customer.changeName("Jane");
    expect(customer.name).toBe("Jane");
  });

  it("should throw if name to be changed is empty", () => {
    const customer = new Customer("123", "John");
    const call = () => customer.changeName("");
    expect(call).toThrowError("Name is required");
  });

  it("should activate customer", () => {
    const customer = new Customer("123", "John");
    const address = new Address("123", 123, "12500020", "São Paulo");
    customer.updateAddress(address);

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should deactivate customer", () => {
    const customer = new Customer("123", "John");
    customer.deactivate();
    expect(customer.isActive()).toBe(false);
  });

  it("should throw when trying to activate a customer", () => {
    const customer = new Customer("123", "John");

    const call = () => customer.activate();

    expect(call).toThrowError("Address is mandatory to activate a costumer");
  });

  it("should add reward points", () => {
    const customer = new Customer("123", "John");
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(20);
    expect(customer.rewardPoints).toBe(30);
  });
});
