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

const CONST_PRODUCTS_SKU: Array<string> = [
    `hplpa5a24`,
    `vblpa9a54`,
    `mslpi5n68`
]

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
        let product: IProduct = {
            id: undefined,
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

describe(`Get single product`, () => {
    test(`Base test`, async () => {
        let product: IProduct = {
            name: [...Array(Math.floor(Math.random()*200))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(9)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*100))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }
        const response = await productModel.create(product);
        expect(response.responseStatus).toBe(201);

        const getById: IResponse = await productModel.getById(JSON.parse(response.responseData).id);
        expect(getById.responseStatus).toBe(200);

        const getBySKU: IResponse = await productModel.getBySKU(product.sku);
        expect(getBySKU.responseStatus).toBe(200);
    }),
    test(`Get certain product with invalid id or sku`, async () => {
        const getById: IResponse = await productModel.getById(-1);
        expect(getById.responseStatus).toBe(400);

        const getBySKU: IResponse = await productModel.getBySKU(``);
        expect(getBySKU.responseStatus).toBe(400);
    })
})

describe(`Test update`, () => {
    test(`Basic test`, async () => {
        let product: IProduct = {
            name: [...Array(Math.floor(Math.random()*200))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(9)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*100))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }

        let updatedProduct: IProduct = {
            name: [...Array(Math.floor(Math.random()*200))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(9)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*100))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }

        const createResponse: IResponse = await productModel.create(product);
        expect(createResponse.responseStatus).toBe(201);
        updatedProduct.id = JSON.parse(createResponse.responseData).id;

        const updateByIdResponse: IResponse = await productModel.updateById(updatedProduct);
        expect(updateByIdResponse.responseStatus).toBe(200);
        
        const getBySKuResponse: IResponse = await productModel.getBySKU(product.sku);
        expect(getBySKuResponse.responseStatus).toBe(204);
        product.id = Math.ceil(Math.random() * 1000) + 1000;
        product.sku = updatedProduct.sku;

        const updateBySKU: IResponse = await productModel.updateBySKU(product);
        expect(updateBySKU.responseStatus).toBe(200);
        if (updatedProduct.id){
            const getByIdResponse: IResponse = await productModel.getById(updatedProduct.id);
            expect(getByIdResponse.responseStatus).toBe(204);

            const finalGetByIdResponse: IResponse = await productModel.getById(product.id);
            expect(finalGetByIdResponse.responseStatus).toBe(200);
        } else {
            throw new Error(`Нет идентификатора обновленного товара`)
        }
    }),
    test(`Invalid request body`,async () => {
        const product: IProduct = {
            name: [...Array(Math.floor(Math.random()*200))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(9)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*100))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }
        const incorrectProduct: IProduct = {
            name: '',
            sku: '',
            type: '',
            price: -1
        };

        const createResponse: IResponse = await productModel.create(product);
        expect(createResponse.responseStatus).toBe(201);
        incorrectProduct.id = JSON.parse(createResponse.responseData).id;

        const incorrectUpdateResponse: IResponse = await productModel.updateById(incorrectProduct);
        expect(incorrectUpdateResponse.responseStatus).toBe(400);
        const incorrectUpdateBySKUResponse: IResponse = await productModel.updateBySKU(incorrectProduct);
        expect (incorrectUpdateBySKUResponse.responseStatus).toBe(400);
    }),
    test(`Update non existing product`, async () => {
        const proudct: IProduct = {
            id: 999999,
            sku: `incorrect`,
            name: `Name`,
            type: `Type`,
            price: 12
        }

        const updateById: IResponse = await productModel.updateById(proudct);
        expect(updateById.responseStatus).toBe(204);

        const updateBySKU: IResponse = await productModel.updateBySKU(proudct);
        expect(updateBySKU.responseStatus).toBe(204);
    })
});

describe(`Delete products`, () => {
    test(`Basic test`, async () => {

        let firstProduct: IProduct = {
            name: [...Array(Math.floor(Math.random()*200))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(9)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*100))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }
        let secondProduct: IProduct = {
            name: [...Array(Math.floor(Math.random()*200))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            sku:  [...Array(9)].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            type:  [...Array(Math.floor(Math.random()*100))].map(item => (~~(Math.random()*36)).toString(36)).join(''),
            price: Math.random() * 1000
        }
        const fpCreateResponse: IResponse = await productModel.create(firstProduct);
        expect(fpCreateResponse.responseStatus).toBe(201);

        const spCreateResponse: IResponse = await productModel.create(secondProduct);
        expect(spCreateResponse.responseStatus).toBe(201);

        const fpDeleteByIdResponse: IResponse = await productModel.deleteById(JSON.parse(fpCreateResponse.responseData).id);
        expect(fpDeleteByIdResponse.responseStatus).toBe(202);
        
        const spDeleteBySKUResponse: IResponse = await productModel.deleteBySKU(secondProduct.sku);
        expect(spDeleteBySKUResponse.responseStatus).toBe(202);
    }),
    test(`Delete with invalid options`, async () => {
        const incorrectId: number = -1, incorrectSKU: string = ``;

        const deleteById: IResponse= await productModel.deleteById(incorrectId);
        expect(deleteById.responseStatus).toBe(400);
        
        const deleteBySKU: IResponse = await productModel.deleteBySKU(incorrectSKU);
        expect(deleteBySKU.responseStatus).toBe(400);
    }),
    test(`Delete product that don't exists`, async () => {
        const nonExistId: number = 10000, nonExistsSKU: string = `nonexists`;

        const deleteById: IResponse= await productModel.deleteById(nonExistId);
        expect(deleteById.responseStatus).toBe(204);

        const deleteBySKU: IResponse = await productModel.deleteBySKU(nonExistsSKU);
        expect(deleteBySKU.responseStatus).toBe(204);
    })
})

afterAll(async () => {
    const getList: IResponse = await productModel.getList({page: 1, elementsPerPage: 100});

    let productsForDelete: Array<IProduct> = (JSON.parse(getList.responseData).products as Array<IProduct>).filter(product => {
        if (!CONST_PRODUCTS_SKU.includes(product.sku)){
            return product
        }
    })

    Promise.all(productsForDelete.map(product => {
        if (product.id){
            return productModel.deleteById(product.id);
        } else {
            throw new Error(`Что-то с айдишкой`);
        }
    })).then(values => {
        dbClient.end();
    });

});


