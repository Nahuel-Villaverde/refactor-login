// product.model.js
import mongoose from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = "Productos";

const productSchema = new mongoose.Schema({
    titulo: { type: String, required: true, max: 50 },
    descripcion: { type: String, required: true, max: 100 },
    precio: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    categoria: { type: String, required: true },
    code: { type: String, required: true },
    stock: { type: Number, required: true },
    disponible: { type: Boolean, required: true },
    owner: { type: String, required: true }, 
});

productSchema.plugin(mongoosePaginate);
const productModel = mongoose.model(productCollection, productSchema);

export default productModel;
