import { EventDispatcher } from "../event/@shared/event-dispatcher";
import { CustomerUpdatedAddress } from "../event/customer/events-types/customer-updated-address.event";
import { Log1CustomerCreatedHandler } from "../event/customer/handler/log-1-customer-created.handle";
import { Log2CustomerCreatedHandler } from "../event/customer/handler/log-2-customer-created.handler";
import { LogCustomerUpdatedAddressHandler } from "../event/customer/handler/log-customer-update-address.handler";
import { Address } from "./address";
import { Customer } from "./customer";

describe("Customer unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Customer("", "John", new EventDispatcher())).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => new Customer("123", "", new EventDispatcher())).toThrowError("Name is required");
  });

  it("should change name", () => {
    const customer = new Customer("123", "John", new EventDispatcher());
    customer.changeName("Jane");
    expect(customer.name).toBe("Jane");
  });

  it("should throw if name to be changed is empty", () => {
    const customer = new Customer("123", "John", new EventDispatcher());
    const call = () => customer.changeName("");
    expect(call).toThrowError("Name is required");
  });

  it("should activate customer", () => {
    const customer = new Customer("123", "John", new EventDispatcher());
    const address = new Address("123", 123, "12500020", "São Paulo");
    customer.updateAddress(address);

    customer.activate();

    expect(customer.isActive()).toBe(true);
  });

  it("should deactivate customer", () => {
    const customer = new Customer("123", "John", new EventDispatcher());
    customer.deactivate();
    expect(customer.isActive()).toBe(false);
  });

  it("should throw when trying to activate a customer", () => {
    const customer = new Customer("123", "John", new EventDispatcher());

    const call = () => customer.activate();

    expect(call).toThrowError("Address is mandatory to activate a costumer");
  });

  it("should add reward points", () => {
    const customer = new Customer("123", "John", new EventDispatcher());
    expect(customer.rewardPoints).toBe(0);

    customer.addRewardPoints(10);
    expect(customer.rewardPoints).toBe(10);

    customer.addRewardPoints(20);
    expect(customer.rewardPoints).toBe(30);
  });

  it("should notify when costumer is created", () => {
    const eventDispatcher = new EventDispatcher();
    const log1CustomerUpdatedAddressHandler = new Log1CustomerCreatedHandler();
    const log2CustomerUpdatedAddressHandler = new Log2CustomerCreatedHandler();
    eventDispatcher.subscribe(CustomerUpdatedAddress.name, log1CustomerUpdatedAddressHandler);
    eventDispatcher.subscribe(CustomerUpdatedAddress.name, log2CustomerUpdatedAddressHandler);

    const customer = new Customer("123", "John", eventDispatcher);
    const address = new Address("123", 123, "12500020", "São Paulo");
    const handlerSpy1 = jest.spyOn(log1CustomerUpdatedAddressHandler, "handle");
    const handlerSpy2 = jest.spyOn(log2CustomerUpdatedAddressHandler, "handle");

    expect(eventDispatcher.getEventHandlers["CustomerUpdatedAddress"].length).toBe(2);

    customer.updateAddress(address);

    expect(handlerSpy1).toHaveBeenCalledTimes(1);
    expect(handlerSpy2).toHaveBeenCalledTimes(1);
  });

  it("should notify when address is updated", () => {
    const eventDispatcher = new EventDispatcher();
    const logCustomerUpdatedAddressHandler = new LogCustomerUpdatedAddressHandler();
    eventDispatcher.subscribe(CustomerUpdatedAddress.name, logCustomerUpdatedAddressHandler);

    const customer = new Customer("123", "John", eventDispatcher);
    const address = new Address("Rua 123", 321, "12500020", "São Paulo");
    const handlerSpy = jest.spyOn(logCustomerUpdatedAddressHandler, "handle");

    expect(eventDispatcher.getEventHandlers["CustomerUpdatedAddress"].length).toBe(1);

    customer.updateAddress(address);

    expect(handlerSpy).toHaveBeenCalledTimes(1);
  });
});
