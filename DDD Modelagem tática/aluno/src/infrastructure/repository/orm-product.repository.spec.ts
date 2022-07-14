import { DataSource, Repository } from "typeorm";
import { Product } from "../../domain/entities/product";
import { ProductModel } from "../db/sequelize/model/product.model";
import { OrmProductRepository } from "./orm-product.repository";

describe("Product Repository test", () => {
  let dataSource: DataSource;
  let typeOrmProductRepository: Repository<ProductModel>;
  let ormProductRepository: OrmProductRepository;

  beforeEach(async () => {
    dataSource = new DataSource({
      type: "sqlite",
      database: ":memory:",
      dropSchema: true,
      logging: false,
      synchronize: true,
      migrations: [],
      entities: [ProductModel],
    });
    await dataSource.initialize();

    typeOrmProductRepository = dataSource.getRepository(ProductModel);
    ormProductRepository = new OrmProductRepository(typeOrmProductRepository);
  });

  afterEach(async () => {
    await dataSource.destroy();
  });

  it("should create a product", async () => {
    const product = new Product("1", "Product 1", 100);

    await ormProductRepository.create(product);

    const productModel = await typeOrmProductRepository.findOne({ where: { id: "1" } });

    expect({ ...productModel }).toStrictEqual({ id: "1", name: "Product 1", price: 100 });
  });

  it("should update a product", async () => {
    const product = new Product("1", "Product 1", 100);
    await ormProductRepository.create(product);

    product.changeName("Product 2");
    product.changePrice(150);

    await ormProductRepository.update(product);

    const updatedProduct = await typeOrmProductRepository.findOne({ where: { id: "1" } });
    expect({ ...updatedProduct }).toStrictEqual({ id: "1", name: "Product 2", price: 150 });
  });

  describe("find", () => {
    it("should find a product", async () => {
      const product = new Product("1", "Product 1", 100);
      await ormProductRepository.create(product);

      const foundProduct = await ormProductRepository.find("1");

      expect({ ...foundProduct }).toEqual(product);
    });

    it("should return null when an inexitent product was found", async () => {
      const foundProduct = await ormProductRepository.find("1");

      expect(foundProduct).toEqual(null);
    });
  });

  describe("findAll", () => {
    it("should find all products", async () => {
      const product1 = new Product("1", "Product 1", 100);
      const product2 = new Product("2", "Product 2", 200);
      await ormProductRepository.create(product1);
      await ormProductRepository.create(product2);

      const foundProducts = await ormProductRepository.findAll();

      expect(foundProducts).toEqual([product1, product2]);
    });

    it("should return empty list when products list is empty", async () => {
      const foundProducts = await ormProductRepository.findAll();

      expect(foundProducts).toEqual([]);
    });
  });
});
