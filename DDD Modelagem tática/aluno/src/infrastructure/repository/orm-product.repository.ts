import { Repository } from "typeorm";
import { Product } from "../../domain/entities/product";
import { ProductRepository } from "../../domain/repository/product-repository.interface";
import { ProductModel } from "../db/sequelize/model/product.model";

export class OrmProductRepository implements ProductRepository {
  constructor(private typeOrmProductRepository: Repository<ProductModel>) {}

  async create(entity: Product): Promise<void> {
    await this.typeOrmProductRepository.save({
      id: entity.id,
      name: entity.name,
      price: entity.price,
    });
  }

  async update(entity: Product): Promise<void> {
    await this.typeOrmProductRepository.save({
      id: entity.id,
      name: entity.name,
      price: entity.price,
    });
  }

  private toDomainProduct(productModel: ProductModel): Product {
    return new Product(productModel.id, productModel.name, productModel.price);
  }

  async find(id: string): Promise<Product> {
    const productModel = await this.typeOrmProductRepository.findOne({ where: { id } });
    if (!productModel) {
      return null;
    }

    return this.toDomainProduct(productModel);
  }

  async findAll(): Promise<Product[]> {
    const productModels = await this.typeOrmProductRepository.find();
    return productModels.map(this.toDomainProduct);
  }
}
