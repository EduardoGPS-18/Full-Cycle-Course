import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class ProductModel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  price: number;
}
