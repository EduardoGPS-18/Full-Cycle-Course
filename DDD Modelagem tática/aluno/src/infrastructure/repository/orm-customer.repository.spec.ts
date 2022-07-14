import { DataSource, Repository } from "typeorm";
import { Address } from "../../domain/entities/address";
import { Customer } from "../../domain/entities/customer";
import { CustomerModel } from "../db/sequelize/model/customer.model";
import { OrmCustomerRepository } from "./orm-customer.repository";

describe("Customer Repository tests", () => {
  let dataSource: DataSource;
  let typeOrmCustomerRepository: Repository<CustomerModel>;
  let customerRepository: OrmCustomerRepository;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      logging: false,
      synchronize: true,
      migrations: [],
      entities: [CustomerModel],
    });
    await dataSource.initialize();

    typeOrmCustomerRepository = dataSource.getRepository(CustomerModel);
    customerRepository = new OrmCustomerRepository(typeOrmCustomerRepository);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it("should create a customer", async () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "12345", "City 1");
    customer.updateAddress(address);
    customer.addRewardPoints(10);

    await customerRepository.create(customer);

    const customerModel = await typeOrmCustomerRepository.findOne({ where: { id: "1" } });

    expect({ ...customerModel }).toStrictEqual({
      id: "1",
      name: "Customer 1",
      active: false,
      rewardPoints: 10,
      street: "Street 1",
      number: 1,
      zip: "12345",
      city: "City 1",
    });
  });

  it("should update a customer", async () => {
    const customer = new Customer("1", "Customer 1");
    const address = new Address("Street 1", 1, "12345", "City 1");
    customer.updateAddress(address);
    customer.addRewardPoints(10);
    await customerRepository.create(customer);

    customer.activate();
    customer.changeName("Customer 2");
    customer.addRewardPoints(20);
    customer.updateAddress(customer.address.copyWith({ city: "City 2" }));
    await customerRepository.update(customer);
    const customerModel = await typeOrmCustomerRepository.findOne({ where: { id: "1" } });

    expect({ ...customerModel }).toStrictEqual({
      id: "1",
      name: "Customer 2",
      active: true,
      rewardPoints: 30,
      street: "Street 1",
      number: 1,
      zip: "12345",
      city: "City 2",
    });
  });

  describe("find", () => {
    it("should find a customer", async () => {
      const customer = new Customer("1", "Customer 1");
      const address = new Address("Street 1", 1, "12345", "City 1");
      customer.updateAddress(address);
      customer.addRewardPoints(10);
      customer.activate();
      await customerRepository.create(customer);

      const foundCustomer = await customerRepository.find("1");

      expect(customer).toStrictEqual(foundCustomer);
    });

    it("should throw an error when customer is not found", async () => {
      const promise = customerRepository.find("1");

      expect(promise).rejects.toThrowError(new Error("Customer not found"));
    });
  });

  it("should find all customers", async () => {
    const customer1 = new Customer("1", "Customer 1");
    const address1 = new Address("Street 1", 1, "12345", "City 1");
    customer1.updateAddress(address1);
    customer1.addRewardPoints(10);
    customer1.activate();
    await customerRepository.create(customer1);

    const customer2 = new Customer("2", "Customer 1");
    const address2 = new Address("Street 1", 1, "12345", "City 1");
    customer2.updateAddress(address2);
    customer2.addRewardPoints(10);
    customer2.activate();
    await customerRepository.create(customer2);

    const customers = await customerRepository.findAll();

    expect(customers.length).toBe(2);
    expect(customers[0]).toStrictEqual(customer1);
    expect(customers[1]).toStrictEqual(customer2);
  });
});
