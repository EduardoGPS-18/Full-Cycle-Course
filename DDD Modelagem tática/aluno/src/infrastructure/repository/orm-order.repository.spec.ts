import { DataSource, Repository } from "typeorm";
import { Address } from "../../domain/entities/address";
import { Customer } from "../../domain/entities/customer";
import { Order } from "../../domain/entities/order";
import { OrderItem } from "../../domain/entities/order-item";
import { Product } from "../../domain/entities/product";
import { EventDispatcher } from "../../domain/event/@shared/event-dispatcher";
import { CustomerModel } from "../db/sequelize/model/customer.model";
import { OrderItemModel } from "../db/sequelize/model/order-item.model";
import { OrderModel } from "../db/sequelize/model/order.model";
import { ProductModel } from "../db/sequelize/model/product.model";
import { OrmCustomerRepository } from "./orm-customer.repository";
import { OrmOrderRepository } from "./orm-order.repository";
import { OrmProductRepository } from "./orm-product.repository";

describe("Customer Repository tests", () => {
  let dataSource: DataSource;
  let typeOrmCustomerRepository: Repository<CustomerModel>;
  let customerRepository: OrmCustomerRepository;
  let typeOrmProductRepository: Repository<ProductModel>;
  let productRepository: OrmProductRepository;
  let typeOrmOrderRepository: Repository<OrderModel>;
  let orderRepository: OrmOrderRepository;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      logging: false,
      synchronize: true,
      migrations: [],
      entities: [CustomerModel, OrderModel, OrderItemModel, ProductModel],
    });
    await dataSource.initialize();

    typeOrmCustomerRepository = dataSource.getRepository(CustomerModel);
    customerRepository = new OrmCustomerRepository(typeOrmCustomerRepository);
    typeOrmProductRepository = dataSource.getRepository(ProductModel);
    productRepository = new OrmProductRepository(typeOrmProductRepository);
    typeOrmOrderRepository = dataSource.getRepository(OrderModel);
    orderRepository = new OrmOrderRepository(typeOrmOrderRepository);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it("should create a new order", async () => {
    const customer = new Customer("123", "Customer 1", new EventDispatcher());
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.updateAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 30);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("1234", "123", [orderItem]);
    await orderRepository.create(order);

    const orderModel = await typeOrmOrderRepository.findOne({
      where: { id: order.id },
      relations: ["items"],
    });

    expect(orderModel).toEqual({
      id: "1234",
      customerId: "123",
      total: 60,
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          product: {
            id: product.id,
            name: product.name,
            price: product.price,
          },
          productId: orderItem.productId,
        },
      ],
    });
  });

  it("should update an existing order", async () => {
    const customer = new Customer("123", "Customer 1", new EventDispatcher());
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.updateAddress(address);
    await customerRepository.create(customer);

    const product = new Product("123", "Product 1", 10);
    const product2 = new Product("231", "Product 2", 20);
    await productRepository.create(product);
    await productRepository.create(product2);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
    const order = new Order("1234", "123", [orderItem, orderItem2]);
    await orderRepository.create(order);

    order.removeOrderItem(orderItem.id);
    await orderRepository.update(order);

    const orderModel = await typeOrmOrderRepository.findOne({
      where: { id: order.id },
      relations: ["items"],
    });

    expect(orderModel).toMatchObject({
      id: "1234",
      customerId: "123",
      total: 20,
      items: [
        {
          id: orderItem2.id,
          name: orderItem2.name,
          price: orderItem2.price,
          quantity: orderItem2.quantity,
          productId: orderItem2.productId,
          product: {
            id: product2.id,
            name: product2.name,
            price: product2.price,
          },
        },
      ],
    });
  });

  it("should find a order", async () => {
    const customer = new Customer("123", "Customer 1", new EventDispatcher());
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.updateAddress(address);
    await customerRepository.create(customer);

    const product = new Product("321", "Product 1", 15);
    await productRepository.create(product);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const order = new Order("1234", customer.id, [orderItem]);
    await orderRepository.create(order);

    const orderModel = await orderRepository.find(order.id);

    expect(orderModel).toMatchObject({
      _id: "1234",
      _customerId: "123",
      _total: 30,
      _items: [
        {
          _price: product.price,

          _id: orderItem.id,
          _name: orderItem.name,
          _quantity: orderItem.quantity,
          _productId: orderItem.productId,
        },
      ],
    });
  });

  it("should find all orders", async () => {
    const customer = new Customer("123", "Customer 1", new EventDispatcher());
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.updateAddress(address);
    await customerRepository.create(customer);

    const product = new Product("1", "Product 1", 10);
    const product2 = new Product("2", "Product 2", 20);
    await productRepository.create(product);
    await productRepository.create(product2);

    const orderItem = new OrderItem("1", product.name, product.price, product.id, 2);
    const orderItem2 = new OrderItem("2", product2.name, product2.price, product2.id, 1);
    const orderItem3 = new OrderItem("3", product2.name, product2.price, product2.id, 1);

    const order = new Order("1234", "123", [orderItem, orderItem2]);
    const order2 = new Order("5432", "123", [orderItem3]);

    await orderRepository.create(order);
    await orderRepository.create(order2);

    const savedOrder = await orderRepository.findAll();

    expect(savedOrder).toMatchObject([
      {
        _id: "1234",
        _customerId: "123",
        _total: 40,
        _items: [
          {
            _id: orderItem.id,
            _name: orderItem.name,
            _price: product.price,
            _quantity: orderItem.quantity,
            _productId: orderItem.productId,
          },
          {
            _id: orderItem2.id,
            _name: orderItem2.name,
            _price: product2.price,
            _quantity: orderItem2.quantity,
            _productId: orderItem2.productId,
          },
        ],
      },
      {
        _id: "5432",
        _customerId: "123",
        _total: 20,
        _items: [
          {
            _id: orderItem3.id,
            _name: orderItem3.name,
            _price: orderItem3.price,
            _quantity: orderItem3.quantity,
          },
        ],
      },
    ]);
  });
});
