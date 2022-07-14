import { Product } from "../entities/product";
import { RepositoryInterface } from "./repository.interface";

export interface ProductRepository extends RepositoryInterface<Product> {}
