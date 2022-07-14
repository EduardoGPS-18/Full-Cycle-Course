import { EventInterface } from "../../@shared/event.interface";

export type CustomerCreatedEventData = {
  customerName: string;
};

export class CustomerCreatedEvent implements EventInterface {
  dateTimeOccured: Date;
  eventData: CustomerCreatedEventData;

  constructor(eventData: CustomerCreatedEventData) {
    this.dateTimeOccured = new Date();
    this.eventData = eventData;
  }
}
