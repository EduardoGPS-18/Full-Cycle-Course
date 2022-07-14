import { Repository } from "typeorm";
import { Address } from "../../domain/entities/address";
import { Customer } from "../../domain/entities/customer";
import { CustomerRepository } from "../../domain/repository/customer-repository.interface";
import { CustomerModel } from "../db/sequelize/model/customer.model";

export class OrmCustomerRepository implements CustomerRepository {
  constructor(private ormCustomerRepository: Repository<CustomerModel>) {}

  async create(entity: Customer): Promise<void> {
    await this.ormCustomerRepository.save({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zip: entity.address.zip,
      city: entity.address.city,
      active: entity.active,
      rewardPoints: entity.rewardPoints,
    });
  }

  async update(entity: Customer): Promise<void> {
    await this.ormCustomerRepository.save({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zip: entity.address.zip,
      city: entity.address.city,
      active: entity.active,
      rewardPoints: entity.rewardPoints,
    });
  }

  private toDomainCustomer(customerModel: CustomerModel): Customer {
    const { id, name, active, rewardPoints } = customerModel;
    const customer = new Customer(id, name);

    const { street, number, zip, city } = customerModel;
    const address = new Address(street, number, zip, city);

    customer.updateAddress(address);
    customer.addRewardPoints(rewardPoints);
    if (active) {
      customer.activate();
    } else {
      customer.deactivate();
    }

    return customer;
  }

  async find(id: string): Promise<Customer> {
    const customerModel = await this.ormCustomerRepository.findOne({ where: { id } });
    if (!customerModel) throw new Error("Customer not found");
    return this.toDomainCustomer(customerModel);
  }

  async findAll(): Promise<Customer[]> {
    const customerModel = await this.ormCustomerRepository.find();

    return customerModel.map(this.toDomainCustomer);
  }
}
