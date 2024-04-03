import { Hero } from "./hero.dto"
import { Pagination } from "./pagination.dto";

export interface ItemsPaginated {
  items: Hero[],
  pagination: Pagination, 
}