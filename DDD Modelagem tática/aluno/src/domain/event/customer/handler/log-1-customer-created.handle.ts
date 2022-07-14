import { EventHandlerInterface } from "../../@shared/event-handler.interface";
import { CustomerCreatedEvent } from "../events-types/customer-created.event";

export class Log1CustomerCreatedHandler implements EventHandlerInterface<CustomerCreatedEvent> {
  handle(event: CustomerCreatedEvent): void {
    console.log(`Esse é o primeiro log do novo usuário criado ${event.eventData.customerName}`);
  }
}
