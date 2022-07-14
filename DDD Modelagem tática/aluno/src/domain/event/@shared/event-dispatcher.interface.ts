import { EventHandlerInterface } from "./event-handler.interface";
import { EventInterface } from "./event.interface";

export interface EventDispatcherInterface<T extends EventInterface = EventInterface> {
  notify(event: T): void;
  subscribe(eventName: string, eventHandler: EventHandlerInterface<T>): void;
  unsubscribe(eventName: string, eventHandler: EventHandlerInterface<T>): void;
  unsubscribeAll(): void;
}
