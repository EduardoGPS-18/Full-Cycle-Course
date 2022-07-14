import { Order } from "../entities/order";
import { RepositoryInterface } from "./repository.interface";

export interface OrderRepository extends RepositoryInterface<Order> {}
