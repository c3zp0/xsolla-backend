import {Router} from 'express';
import {productController} from '../controllers/products.controller'

export const productsRouter: Router = Router();

productsRouter.get(
    '/products',
    productController.getList
);
productsRouter.get(
    '/products/:productId',
    productController.getById
);
productsRouter.get(
    '/products/sku/:productSKU',
    productController.getBySKU
)
productsRouter.post(
    '/products',
    productController.create
);
productsRouter.put(
    '/products',
    productController.updateById
);
productsRouter.put(
    'products/sku/:productSKU',
    productController.updateBySKU
)
productsRouter.delete(
    '/products/:productId',
    productController.deleteById
);
productsRouter.delete(
    'products/sku/productSKU',
    productController.deleteBySKU
)