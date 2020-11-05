import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from './db/productList.json';
import { generateApiReponseHeaders } from './utils/generateApiReponseHeaders';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('getProductsListHandler: Event: ', event);
  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: generateApiReponseHeaders(),
  }
}
