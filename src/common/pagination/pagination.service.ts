import { Injectable } from '@nestjs/common';
import { IPagination } from './pagination.interface';

@Injectable()
export class PaginationService {

    toPagedList<Type>(page: number, take: number, itemsCount: number, items: Array<Type>) : IPagination {
        return {
            page: page,
            take: take,
            items: items,
            itemsCount: itemsCount,
            pageCount: Math.ceil(itemsCount / take)
        }
    }
}
