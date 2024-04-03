import { Hero } from "./hero.dto"
import { Pagination } from "./pagination.dto";

export interface HeroPaginated {
  heroes: Hero[],
  pagination: Pagination, 
}