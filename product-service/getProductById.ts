import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from './db/productList.json';
import { generateApiReponseHeaders } from './utils/generateApiReponseHeaders';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('getProductByIdHandler: Event: ', event);
  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 404,
      body: 'Error: Mandatory path parameter is missed',
      headers: generateApiReponseHeaders(),
    };
  }

  const product = products.find((item) => item.id === id);

  if (!product) {
    return {
      statusCode: 400,
      body: `Can't find product with id: ${id} `,
      headers: generateApiReponseHeaders(),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(product),
    headers: generateApiReponseHeaders(),
  }
}
