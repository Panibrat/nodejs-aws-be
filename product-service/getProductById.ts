import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from './db/productList.json';

export const handler: APIGatewayProxyHandler = async (event) => {
  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 404,
      body: 'Error: No id',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }
    };
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    return {
      statusCode: 400,
      body: `No any product with this id: ${id} `,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      }
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }
}
