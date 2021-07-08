export interface IProductCatalog{
    page: number,
    elementsPerPage: number,
    type?: Array<string>,
    minPrice?: number,
    maxPrice?: number
}