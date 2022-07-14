import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryColumn, RelationId } from "typeorm";
import { CustomerModel } from "./customer.model";
import { OrderItemModel } from "./order-item.model";

@Entity({ name: "order" })
export class OrderModel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @RelationId((order: OrderModel) => order.customer)
  customerId: string;

  @ManyToOne(() => CustomerModel)
  customer: CustomerModel;

  @Column({ nullable: false })
  total: number;

  @OneToMany(() => OrderItemModel, (orderItem) => orderItem.order, { cascade: ["insert"] })
  items: OrderItemModel[];
}
