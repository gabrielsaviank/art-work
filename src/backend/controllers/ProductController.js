import { Response } from "miragejs";

/**
 * All the routes related to Product are present here.
 * These are Publicly accessible routes.
 * */

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/products
 * */

export const getAllProductsHandler = function (schema, request) {
  try {
    let { page = 1, limit = 12, search= ""} = request.queryParams
    page = Number(page);
    limit = Number(limit);

    let filteredProducts = schema.products.all().models;

    if(search) {
      filteredProducts = filteredProducts.filter((product) =>
          product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    const filteredProductsCount = filteredProducts.length;

    const startIndex = (page - 1) * limit;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

    return new Response(200, {}, {
      success: true,
      products: paginatedProducts,
      productsCount: schema.products.all().length,
      filteredProductsCount,
      resultPerPage: limit,
    });
  } catch (error) {
    return new Response(
        500,
        {},
        {
          error,
        }
    );
  }
};

/**
 * This handler handles gets all products in the db.
 * send GET Request at /api/user/products/:productId
 * */

export const getProductHandler = function (schema, request) {
  const productId = request.params.productId;
  try {
    const product = schema.products.findBy({ _id: productId });
    return new Response(200, {}, { product });
  } catch (error) {
    return new Response(
        500,
        {},
        {
          error,
        }
    );
  }
};
