import { Product } from "../entities/product";
import { ProductService } from "./product.service";

describe("Product service unit tests", () => {
  it("should change the prices of all products", () => {
    const product1 = new Product("123", "Product 1", 10);
    const product2 = new Product("321", "Product 2", 20);
    const products = [product1, product2];

    ProductService.increasePricePercentageOnProducts(products, 10);

    expect(product1.price).toBe(11);
    expect(product2.price).toBe(22);
  });
});
