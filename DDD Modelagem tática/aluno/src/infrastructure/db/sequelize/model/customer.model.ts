import { BaseEntity, Column, Entity, PrimaryColumn } from "typeorm";

@Entity({ name: "customer" })
export class CustomerModel extends BaseEntity {
  @PrimaryColumn()
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  street: string;

  @Column({ nullable: false })
  number: number;

  @Column({ nullable: false })
  zip: string;

  @Column({ nullable: false })
  city: string;

  @Column({ nullable: false })
  active: boolean;

  @Column({ nullable: false })
  rewardPoints: number;
}
