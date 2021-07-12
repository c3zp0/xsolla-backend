export interface IProductCatalog{
    page: number,
    elementsPerPage: number,
    type?: Array<string> | null,
    minPrice?: number | null,
    maxPrice?: number | null
}