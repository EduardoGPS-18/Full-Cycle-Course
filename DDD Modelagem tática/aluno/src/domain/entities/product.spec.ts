import { Product } from "./product";

describe("Product unit tests", () => {
  it("should throw error when id is empty", () => {
    expect(() => new Product("", "123", 100)).toThrowError("Id is required");
  });

  it("should throw error when name is empty", () => {
    expect(() => new Product("123", "", 100)).toThrowError("Name is required");
  });

  it("should throw error when price is less than zero", () => {
    expect(() => new Product("123", "Produto 1", -1)).toThrowError("Price must be greater than zero");
  });

  it("should change name", () => {
    const product = new Product("123", "Produto 1", 5);
    product.changeName("Produto 2");
    expect(product.name).toBe("Produto 2");
  });

  it("should change price", () => {
    const product = new Product("123", "Produto 1", 100);
    product.changePrice(150);
    expect(product.price).toBe(150);
  });
});
