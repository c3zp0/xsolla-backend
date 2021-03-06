import {dbClient} from '../db/connect';
import {IProduct} from '../interfaces/IProduct'
import { IResponse } from '../interfaces/IResponse';
import {SQL, SQLStatement} from 'sql-template-strings';
import {IProductCatalog} from '../interfaces/request/IProductCatalog';

class Model {

    async getList(args: IProductCatalog): Promise<IResponse>{
        let argsErrors = this.listOfProductsRequestValidator(args);
        if (argsErrors.length != 0){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: argsErrors
                })
            }
        }

        let limit: number = args.elementsPerPage;
        let offset: number = args.elementsPerPage * (args.page - 1);

        const queryString: SQLStatement = SQL`
            select 
                count(id) as count,
                p.id,
                p.sku,
                p.name,
                p.type,
                p.price
            from products p
        `;

        if (
            args.type
            || args.minPrice
            || args.maxPrice
        ){
            queryString.append(SQL`where 1=1 `);
            args.type ? queryString.append(SQL` and p.type = ANY(${args.type}) `) : null;
            args.minPrice ? queryString.append(SQL` and p.price >= ${args.minPrice} `) : null;
            args.maxPrice ? queryString.append(SQL` and p.price <= ${args.maxPrice} `) : null;
        }
        queryString.append(SQL` group by p.id limit ${limit} offset ${offset} `);

        try {
            const stmt = await dbClient.query(queryString);

            if (stmt.rowCount){
                return {
                    responseStatus: 200,
                    responseData: JSON.stringify({
                      currentPage: args.page,
                      totalPage: stmt.rows[0].count,
                      products: stmt.rows.map(item => {
                          return {
                            id: item.id,
                            sku: item.sku,
                            name: item.name,
                            type: item.type,
                            price: Number(item.price)
                          };
                      })
                    })
                };
            }
            return {
                responseStatus: 204,
                responseData: JSON.stringify({
                    desciption: `NO CONTENT`
                })
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: JSON.stringify({
                    errod: error.message
                })
            }
        }
    }

    async getById(productId: number): Promise<IResponse>{
        if (
            !productId 
            || productId <= 0
            || Math.ceil(productId) != productId
        ){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: '???????????????????????? ???????????????? ???????????????????????????? ????????????????'
                })
            }
        }
        
        const queryString: string = `
            select 
                p.id,
                p.sku,
                p.name,
                p.type,
                p.price
            from products p
            where p.id = $1;
        `;

        try {
            const stmt = await dbClient.query(queryString, [productId]);
            if (stmt.rowCount){
                return {
                    responseStatus: 200,
                    responseData: JSON.stringify({
                        id: stmt.rows[0].id,
                        sku: stmt.rows[0].sku,
                        name: stmt.rows[0].name,
                        type: stmt.rows[0].type,
                        price: Number(stmt.rows[0].price)
                    })
                }
            }
            return {
                responseStatus: 204,
                responseData: JSON.stringify({
                    description: `NO CONTENT`
                })
            };
        } catch (error) {
            console.log(`${error.message}\r\n`);
            return {
                responseStatus: 500,
                responseData: JSON.stringify({
                    description: `SERVER ERROR`
                })
            }
        }
    }

    async getBySKU(productSKU: string): Promise<IResponse>{
        if(!productSKU || productSKU.length > 10 || productSKU.trim().length === 0){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: `???????????????????????? ???????????????? SKU`
                })
            }
        }

        const queryString: string = `
            select 
                p.id,
                p.sku,
                p.name,
                p.type,
                p.price
            from products p
            where p.sku = $1;
        `;

        try {
            const stmt = await dbClient.query(queryString, [productSKU]);
            if (stmt.rowCount){
                return {
                    responseStatus: 200,
                    responseData: JSON.stringify({
                        id: stmt.rows[0].id,
                        sku: stmt.rows[0].sku,
                        name: stmt.rows[0].name,
                        type: stmt.rows[0].type,
                        price: Number(stmt.rows[0].price)
                    })
                }
            }
            return {
                responseStatus: 204,
                responseData: JSON.stringify({
                    description: `NO CONTENT`
                })
            };
        } catch (error) {
            console.log(`${error.message}\r\n`);
            return {
                responseStatus: 500,
                responseData: JSON.stringify({
                    description: `SERVER ERROR`
                })
            }
        }
    }

    async create(product: IProduct): Promise<IResponse>{
        let requestBodyErrors = this.validateproductBody(product);
        if (requestBodyErrors.length){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: requestBodyErrors
                })
            }
        }

        
        const queryString: string = `
            insert into products(sku, name, type, price)
            values ($1, $2, $3, $4) 
            returning id;
        `;
        const queryValues = [
            product.sku,
            product.name,
            product.type,
            product.price
        ];

        try {
            const stmt = await dbClient.query(queryString, queryValues);
            return {
                responseStatus: 201,
                responseData: JSON.stringify({
                    id: stmt.rows[0].id
                })
            };
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: `SERVER ERROR`
            }
        }

    }

    async updateById(product: IProduct): Promise<IResponse>{
        let requestBodyErrors = this.validateproductBody(product);
        if (requestBodyErrors.length){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: requestBodyErrors
                })
            }
        }

        const queryString: string = `
            update products 
            set
                sku = $1,
                name = $2,
                type = $3,
                price = $4
            where id = $5
            returning id, sku, name, type, price;
        `;
        const queryValues = [
            product.sku,
            product.name,
            product.type,
            product.price,
            product.id
        ];

        try {
            const stmt = await dbClient.query(queryString, queryValues);

            if (stmt.rowCount){
                return {
                    responseStatus: 200,
                    responseData: JSON.stringify({
                        description: `UPDATED`
                    })
                }
            } 
            return {
                responseStatus: 204,
                responseData: JSON.stringify({
                    description: `NO CONTENT`
                })
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: JSON.stringify({
                    description: `SERVER ERROR`
                })
            }
        }
    }

    async updateBySKU(product: IProduct): Promise<IResponse>{
        let requestBodyErrors = this.validateproductBody(product);
        if (requestBodyErrors.length){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: requestBodyErrors
                })
            }
        }

        //?????????????????? ?????????????????? ????????????????
        const queryString:  SQLStatement= SQL`
            update products 
            set
                id = ${product.id},
                name = ${product.name},
                type = ${product.type},
                price = ${product.price}
            where sku = ${product.sku}
            returning id, sku, name, type, price;
        `; 

        try {
            const stmt = await dbClient.query(queryString);

            if (stmt.rowCount){
                return {
                    responseStatus: 200,
                    responseData: JSON.stringify({
                        description: `RESOURSE UPDATED`
                    })
                }
            } 
            return {
                responseStatus: 204,
                responseData: JSON.stringify({
                    description: `NO CONTENT`
                })
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: JSON.stringify({
                    description: `SERVER ERROR`
                })
            }
        }
    }

    async deleteById(productId: number): Promise<IResponse>{
        if (
            !productId 
            || productId <= 0
        ){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: '???????????????????????? ???????????????? ???????????????????????????? ????????????????'
                })
            }
        }

        const queryString: string = `
            delete from products
            where id = $1
            returning id, sku, name, type, price;
        `;

        try {
            const stmt = await dbClient.query(queryString, [productId]);

            if (stmt.rowCount){
                return {
                    responseStatus: 202,
                    responseData: JSON.stringify({
                        description: `RESOURSE DELETED`
                    })
                }
            }
            return {
                responseStatus: 204,
                responseData: JSON.stringify({
                    description: `NO CONTENT`
                })
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: JSON.stringify({
                    description: `SERVER ERROR`
                })
            }
        }
    }

    async deleteBySKU(productSKU: string): Promise<IResponse>{
        if(!productSKU || productSKU.length > 10 || productSKU.trim().length === 0){
            return {
                responseStatus: 400,
                responseData: JSON.stringify({
                    errors: `???????????????????????? ???????????????? SKU`
                })
            }
        }

        const queryString: string = `
            delete from products
            where sku = $1
            returning id, sku, name, type, price;
        `;

        try {
            const stmt = await dbClient.query(queryString, [productSKU]);

            if (stmt.rowCount){
                return {
                    responseStatus: 202,
                    responseData: JSON.stringify({
                        description: `RESOURSE DELETED`
                    })
                }
            }
            return {
                responseStatus: 204,
                responseData: JSON.stringify({
                    description: `NO CONTENT`
                })
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: JSON.stringify({
                    description: `SERVER ERROR`
                })
            }
        }
    }

    private listOfProductsRequestValidator(args: IProductCatalog){
        let requestBodyErrors = [];

        if (
            !args.page 
            || args.page <= 0
        ){
            requestBodyErrors.push(`???????????????????????? ???????????????? ????????????????`);
        }

        if (
            !args.elementsPerPage
            || args.elementsPerPage <= 0
        ){
            requestBodyErrors.push(`???????????????????????? ???????????????? ???????????????????? ?????????????????? ???? ????????????????`);
        }

        if (
            args.hasOwnProperty('minPrice') && (
                !args.minPrice
                || args.minPrice <= 0
                || (
                    args.hasOwnProperty('maxPrice') && (args.maxPrice) && (args.minPrice > args.maxPrice)
                )
            )
        ){
            requestBodyErrors.push(`???????????????????????? ???????????????? ?????????????????????? ????????`)
        }

        if (
            args.hasOwnProperty('maxPrice') && (
                !args.maxPrice
                || args.maxPrice <= 0
            )
        ){
            requestBodyErrors.push(`???????????????????????? ???????????????? ???????????????????????? ????????`)
        }

        if (
            args.hasOwnProperty('type') && (
                args.type?.filter(type => type.trim().length > 0).length === 0
            )
        ){
            requestBodyErrors.push(`???????????????????????? ???????????????? ?????????? ??????????????`)
        }
        
        return requestBodyErrors
    }

    validateproductBody(product: IProduct){
        let errors = [];

        if (
            !product.name
            || product.name.trim().length === 0
        ){
            errors.push(`???????????????????????? ?????? ????????????`);
        }

        if (
            !product.price
            || product.price <= 0
        ){
            errors.push(`???????????????????????? ???????? ????????????????`)
        } 

        if (
            !product.sku
            || product.sku.length > 10
            || product.sku.trim().length === 0
        ){
            errors.push(`??????????????????????e SKU ????????????`);
        }

        if (
            !product.type
            || product.type.trim().length === 0
        ){
            errors.push(`???????????????????????? ???????????????? ???????? ????????????`)
        }

        if(
            product.hasOwnProperty('id') && (
                !product.id
                || product.id <= 0
                || Math.ceil(product.id) != product.id
            )
        ){
            errors.push(`???????????????????????? ???????????????? ???????????????????????????? ????????????`)
        }

        return errors;
    }

}

export const productModel: Model = new Model();