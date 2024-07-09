import productModel from '../dao/models/product.model.js';

class ProductRepository {
    async getProducts(filter, options) {
        return await productModel.paginate(filter, options);
    }

    async getProductById(productId) {
        return await productModel.findById(productId).lean();
    }

    async createProduct(productData) {
        return await productModel.create(productData);
    }

    async updateProduct(productId, productData) {
        return await productModel.findByIdAndUpdate(productId, productData, { new: true }).lean();
    }

    async deleteProduct(productId) {
        return await productModel.findByIdAndDelete(productId).lean();
    }
}

export default new ProductRepository();