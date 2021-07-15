import { IProduct } from '../interfaces/IProduct';
import { productModel } from '../models/products.model';
import { dbClient } from '../db/connect'
import dotenv from 'dotenv';
import { IResponse } from '../interfaces/IResponse';
import { isEqual } from 'lodash'

dotenv.config();

//Существуют только если вставить данные
const exitingProduct: IProduct = {
    sku: 'hplpa5a24',
    name: 'HP Pavilion',
    type: 'laptop',
    price: 567.0074
}

describe(`Create product`, () => {
    test(`Base test`, async () => {
        let product: IProduct = {
            name: [...Array(Math.floor(Math.random()*200))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(9)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*100))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }
        const response = await productModel.create(product);
        expect(response.responseStatus).toBe(201);
        expect(typeof response.responseData).toEqual('string');
        expect(typeof JSON.parse(response.responseData).id).toEqual('number');
    }),
    test(`Create product with invalid SKU`, async () => {
        let product: IProduct = {
            name: [...Array(Math.floor(Math.random()*1))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(18)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*1))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }
        expect((await productModel.create(product)).responseStatus).toBe(400);
    }),
    test(`Create product with existing SKU`, async () => {
        expect((await productModel.create(exitingProduct)).responseStatus).toBe(500);
    }),
    test(`Create product with invalid product body`, async () => {
        let product = {
            name: '',
            sku: '',
            type: '',
            price: -1
        }
        expect((await productModel.create(product)).responseStatus).toBe(400);
    })
});


describe(`Get list of products`, () => {
    test(`Base test`, async () => {
        let response = await productModel.getList({
            page: 1,
            elementsPerPage: 5
        });
        expect(response.responseStatus).toBe(200);
        expect(JSON.parse(response.responseData).currentPage).toEqual(1);
        expect(typeof JSON.parse(response.responseData).products[0].id).toEqual('number');
    }),
    test(`Get list with optional parameters`, async () => {
        let response = await productModel.getList({
            page: 1,
            elementsPerPage: 5,
            type: ['laptop', 'another type', 'qq'],
            minPrice: 12,
            maxPrice: 1000
        });

        expect(response.responseStatus).toBe(200);
        expect(JSON.parse(response.responseData).currentPage).toEqual(1);
        expect(typeof JSON.parse(response.responseData).products[0].id).toEqual('number');
    }),
    test(`Get list with invalid page and elements per page`, async () => {
        let response = await productModel.getList({
            page: -1,
            elementsPerPage: 0
        });

        expect(response.responseStatus).toBe(400);
        expect(JSON.parse(response.responseData).hasOwnProperty('errors')).toBeTruthy();
    }),
    test(`Get list with invalid optional parameters`, async () => {
        let response = await productModel.getList({
            page: 1,
            elementsPerPage: 5,
            type: [''],
            minPrice: 100,
            maxPrice: -1
        });

        expect(response.responseStatus).toBe(400);
        expect(JSON.parse(response.responseData).hasOwnProperty('errors')).toBeTruthy();
    }),
    test('Get list of products with page more than items in database', async () => {
        let response = await productModel.getList({
            page: 999,
            elementsPerPage: 10000
        });
        expect(response.responseStatus).toBe(204);
    })
});


afterAll(() => {
    dbClient.end();
});


