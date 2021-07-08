import {Request, Response} from 'express';
import {productModel} from '../models/products.model';
import {apiReponse} from '../view/response';
import { IProduct } from '../interfaces/IProduct';

class Controller {

    async getList(request: Request, response: Response){
        apiReponse.send(
            request,
            response,
            await productModel.getList({
                page: Number(request.query.page),
                elementsPerPage: Number(request.query.elementsPerPage)
            })
        );
    }

    async getById(request: Request, response: Response){
        apiReponse.send(
            request, 
            response,
            await productModel.getById(Number(request.params.productId))
        );
    }

    async getBySKU(request: Request, response: Response){
        apiReponse.send(
            request, 
            response,
            await productModel.getById(Number(request.params.productSKU))
        );
    }

    async create(request: Request, response: Response){
        let product: IProduct = {
            sku: request.body.SKU,
            name: request.body.name,
            type: request.body.type,
            price: request.body.price
        };
        apiReponse.send(request, response, await productModel.create(product));
    }

    async updateById(request: Request, response: Response){
        let product: IProduct = {
            id: request.body.productId,
            sku: request.body.SKU,
            name: request.body.name,
            type: request.body.type,
            price: request.body.price
        };
        apiReponse.send(
            request,
            response,
            await productModel.updateById(product)
        );
    }

    async updateBySKU(request: Request, response: Response){
        let product: IProduct = {
            id: request.body.productId,
            sku: request.body.SKU,
            name: request.body.name,
            type: request.body.type,
            price: request.body.price
        };
        apiReponse.send(
            request,
            response,
            await productModel.updateById(product)
        );
    }

    async deleteById(request: Request, response: Response){
        apiReponse.send(
            request,
            response,
            await productModel.deleteById(Number(request.params.productId))
        );
    }

    async deleteBySKU(request: Request, response: Response){
        apiReponse.send(
            request,
            response,
            await productModel.deleteById(Number(request.params.productId))
        );
    }

}

export const productController: Controller = new Controller();