export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades están incompletas o no son válidas:
    Lista de propiedades:
    * titulo: Necesita ser un string, se recibió ${typeof product.titulo}
    * descripcion: Necesita ser un string, se recibió ${typeof product.descripcion}
    * precio: Necesita ser un número, se recibió ${typeof product.precio}
    * thumbnail: Necesita ser un string, se recibió ${typeof product.thumbnail}
    * categoria: Necesita ser un string, se recibió ${typeof product.categoria}
    * code: Necesita ser un string, se recibió ${typeof product.code}
    * stock: Necesita ser un número, se recibió ${typeof product.stock}
    * disponible: Necesita ser un booleano, se recibió ${typeof product.disponible}`;
};
