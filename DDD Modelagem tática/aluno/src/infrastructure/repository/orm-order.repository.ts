import { Repository } from "typeorm";
import { Order } from "../../domain/entities/order";
import { OrderItem } from "../../domain/entities/order-item";
import { OrderRepository } from "../../domain/repository/order-repository.interface";
import { OrderModel } from "../db/sequelize/model/order.model";

export class OrmOrderRepository implements OrderRepository {
  constructor(private typeOrmOrderRepository: Repository<OrderModel>) {}

  async create(entity: Order): Promise<any> {
    return await this.typeOrmOrderRepository.save({
      id: entity.id,
      customer: { id: entity.customerId },
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        product: {
          id: item.productId,
        },
      })),
      total: entity.total(),
    });
  }

  async update(entity: Order): Promise<void> {
    await this.typeOrmOrderRepository.save({
      id: entity.id,
      customer: { id: entity.customerId },
      items: entity.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        order: { id: entity.id },
        product: {
          id: item.productId,
        },
      })),
      total: entity.total(),
    });
  }

  async find(id: string): Promise<Order> {
    const order = await this.typeOrmOrderRepository.findOne({ where: { id }, relations: ["items"] });
    const items = order.items.map((item) => {
      return new OrderItem(item.id, item.name, item.product.price, item.productId, item.quantity);
    });
    return new Order(order.id, order.customerId, items);
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.typeOrmOrderRepository.find({ relations: ["items"] });

    return orders.map((order) => {
      const items = order.items.map((item) => {
        return new OrderItem(item.id, item.name, item.product.price, item.productId, item.quantity);
      });
      return new Order(order.id, order.customerId, items);
    });
  }
}
