import {dbClient} from '../db/connect';
import {IProduct} from '../interfaces/IProduct'
import { IResponse } from '../interfaces/IResponse';
import {SQL, SQLStatement} from 'sql-template-strings';
import {IProductCatalog} from '../interfaces/request/IProductCatalog';

class Model {

    async getList(args: IProductCatalog): Promise<IResponse>{
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
                            price: item.price
                          };
                      })
                    })
                };
            }
            return {
                responseStatus: 404,
                responseData: JSON.stringify({
                    error: `Nothing has been found`
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
                        price: stmt.rows[0].price
                    })
                }
            }
            return {
                responseStatus: 404,
                responseData: `null`
            };
        } catch (error) {
            console.log(`${error.message}\r\n`);
            return {
                responseStatus: 500,
                responseData: `null`
            }
        }
    }

    async getBySKU(productSKU: string){
        //Валидация ску?
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
                        price: stmt.rows[0].price
                    })
                }
            }
            return {
                responseStatus: 404,
                responseData: null
            };
        } catch (error) {
            console.log(`${error.message}\r\n`);
            return {
                responseStatus: 500,
                responseData: null
            }
        }
    }

    async create(product: IProduct): Promise<IResponse>{
        //Валидация продукта
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
            if (stmt.rowCount){
                return {
                    responseStatus: 201,
                    responseData: JSON.stringify({
                        id: stmt.rows[0].id
                    })
                };
            }
            return {
                responseStatus: 404,
                responseData: `null`
            };
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: `null`
            }
        }

    }

    async updateById(product: IProduct): Promise<IResponse>{
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
                if (Object.keys(product).filter((key: string) => {
                    product[key as keyof IProduct] != stmt.rows[0][key]
                }).length){
                    return {
                        responseStatus: 201,
                        responseData: `null`
                    }
                } 
                return {
                    responseStatus: 500,
                    responseData: `null`
                }
            } 
            return {
                responseStatus: 500,
                responseData: `null`
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: `null`
            }
        }
    }

    async updateBySKU(product: IProduct): Promise<IResponse>{
        //Валидация входящего продукта
        const queryString: string = `
            update products 
            set
                name = $1,
                type = $2,
                price = $3
            where sku = $4
            returning id, sku, name, type, price;
        `;
        const queryValues = [
            product.sku,
            product.name,
            product.type,
            product.price
        ];

        try {
            const stmt = await dbClient.query(queryString, queryValues);

            if (stmt.rowCount){
                if (Object.keys(product).filter((key: string) => {
                    product[key as keyof IProduct] != stmt.rows[0][key]
                }).length){
                    return {
                        responseStatus: 201,
                        responseData: `null`
                    }
                } 
                return {
                    responseStatus: 500,
                    responseData: `null`
                }
            } 
            return {
                responseStatus: 500,
                responseData: `null`
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: `null`
            }
        }
    }

    async deleteById(productId: number): Promise<IResponse>{
        const queryString: string = `
            delete from products
            where id = $1
            returning id, sku, name, type, price;
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
                        price: stmt.rows[0].price
                    })
                }
            }
            return {
                responseStatus: 404,
                responseData: `null`
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: `null`
            }
        }
    }

    async deleteBySKU(productSKU: string): Promise<IResponse>{
        const queryString: string = `
            delete from products
            where sku = $1
            returning id, sku, name, type, price;
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
                        price: stmt.rows[0].price
                    })
                }
            }
            return {
                responseStatus: 404,
                responseData: `null`
            }
        } catch (error) {
            console.log(error.message);
            return {
                responseStatus: 500,
                responseData: `null`
            }
        }
    }

}

export const productModel: Model = new Model();