import { Customer } from "../entities/customer";
import { RepositoryInterface } from "./repository.interface";

export interface CustomerRepository extends RepositoryInterface<Customer> {}
