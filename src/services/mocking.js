import { faker } from '@faker-js/faker';

export const generateMockProducts = (count = 100) => {
    const products = [];
    for (let i = 0; i < count; i++) {
        products.push({
            titulo: faker.commerce.productName(),
            descripcion: faker.commerce.productDescription(),
            precio: faker.commerce.price(),
            thumbnail: faker.image.url(),
            categoria: faker.commerce.department(),
            code: faker.string.uuid(),
            stock: faker.number.int({ min: 0, max: 100 }),
            disponible: faker.datatype.boolean()
        });
    }
    return products;
};