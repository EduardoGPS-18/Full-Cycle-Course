import { ProductCreatedEvent } from "../product/events-types/product-created.event";
import { SendEmailWhenProductIsCreatedHandler } from "../product/handler/send-email-when-product-is-created.handler";
import { EventDispatcher } from "./event-dispatcher";

describe("Domain events tests", () => {
  it("should be able to dispatch an event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.subscribe("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(1);
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toStrictEqual(eventHandler);
  });

  it("should be able to unsubscribe an event handler", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.subscribe("ProductCreatedEvent", eventHandler);
    eventDispatcher.unsubscribe("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(0);
  });

  it("should be able to unsubscribe all event handlers", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    eventDispatcher.subscribe("ProductCreatedEvent", eventHandler);
    eventDispatcher.subscribe("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"].length).toBe(2);

    eventDispatcher.unsubscribeAll();

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"]).toBeUndefined();
  });

  it("should be able to dispatch an event", () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const eventHandleSpy = jest.spyOn(eventHandler, "handle");
    eventDispatcher.subscribe("ProductCreatedEvent", eventHandler);

    expect(eventDispatcher.getEventHandlers["ProductCreatedEvent"][0]).toStrictEqual(eventHandler);

    const event = new ProductCreatedEvent({
      name: "Test product",
      description: "Test description",
      price: 10.0,
      quantity: 1,
    });

    eventDispatcher.notify(event);

    expect(eventHandleSpy).toHaveBeenCalledTimes(1);
  });
});
