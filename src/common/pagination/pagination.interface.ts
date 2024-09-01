export interface IPagination {
    page: number;
    take: number;
    items: Array<any>,
    itemsCount: number,
    pageCount: number
}