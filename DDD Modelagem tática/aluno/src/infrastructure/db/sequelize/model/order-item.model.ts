import { BaseEntity, Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, RelationId } from "typeorm";
import { OrderModel } from "./order.model";
import { ProductModel } from "./product.model";

@Entity({ name: "order-item" })
export class OrderItemModel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @RelationId((orderItem: OrderItemModel) => orderItem.product)
  productId: string;

  @ManyToOne(() => ProductModel, { eager: true })
  @JoinColumn({ name: "productId" })
  product: ProductModel;

  @ManyToOne(() => OrderModel, (order) => order.items)
  order: OrderModel;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  price: number;
}
