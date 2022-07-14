import { EventDispatcherInterface } from "./event-dispatcher.interface";
import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";

export class EventDispatcher implements EventDispatcherInterface {
  private eventHandlers: { [eventName: string]: EventHandlerInterface[] } = {};

  get getEventHandlers(): { [eventName: string]: EventHandlerInterface[] } {
    return this.eventHandlers;
  }

  notify(event: EventInterface): void {
    const eventName = event.constructor.name;

    if (!this.eventHandlers[eventName]) return;

    this.eventHandlers[eventName].forEach((eventHandler) => {
      eventHandler.handle(event);
    });
  }

  subscribe(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {
    if (!this.eventHandlers[eventName]) {
      this.eventHandlers[eventName] = [];
    }
    this.eventHandlers[eventName].push(eventHandler);
  }

  unsubscribe(eventName: string, eventHandler: EventHandlerInterface<EventInterface>): void {
    if (!this.eventHandlers[eventName]) return;

    const idx = this.eventHandlers[eventName].indexOf(eventHandler);
    if (idx !== -1) {
      this.eventHandlers[eventName].splice(idx, 1);
    }
  }

  unsubscribeAll(): void {
    this.eventHandlers = {};
  }
}
