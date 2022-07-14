import { EventInterface } from "../../@shared/event.interface";

export type CustomerUpdatedAddressEventData = {
  customerId: string;
  customerName: string;
  newAddress: string;
};

export class CustomerUpdatedAddress implements EventInterface {
  dateTimeOccured: Date;
  eventData: CustomerUpdatedAddressEventData;

  constructor(eventData: CustomerUpdatedAddressEventData) {
    this.dateTimeOccured = new Date();
    this.eventData = eventData;
  }
}
