import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

import products from './db/productList.json';

export const handler: APIGatewayProxyHandler = async () => {
  return {
    statusCode: 200,
    body: JSON.stringify(products),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    }
  }
}
