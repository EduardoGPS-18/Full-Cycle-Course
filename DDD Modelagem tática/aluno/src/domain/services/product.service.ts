import { Product } from "../entities/product";

export class ProductService {
  static increasePricePercentageOnProducts(products: Product[], percentage: number): Product[] {
    products.forEach((product) => product.changePrice(product.price + product.price * (percentage / 100)));
    return products;
  }
}
