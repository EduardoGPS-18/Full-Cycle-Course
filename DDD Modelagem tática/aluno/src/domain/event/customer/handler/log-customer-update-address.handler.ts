import { EventHandlerInterface } from "../../@shared/event-handler.interface";
import { CustomerUpdatedAddress } from "../events-types/customer-updated-address.event";

export class LogCustomerUpdatedAddressHandler implements EventHandlerInterface<CustomerUpdatedAddress> {
  handle(event: CustomerUpdatedAddress): void {
    console.log(`Cliente ${event.eventData.customerName} alterou o endereço ${event.eventData.newAddress}`);
  }
}
