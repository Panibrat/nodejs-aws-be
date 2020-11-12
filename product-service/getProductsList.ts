import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { getClient } from './db/clientDb';

import { getProductsJoinedInfo } from './models/getProductsJoinedInfo';
import { generateApiReponseHeaders } from './utils/generateApiReponseHeaders';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('getProductsListHandler: Event: ', event);

  try {
    const client = await getClient();

    const products = await getProductsJoinedInfo(client);

    client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(products),
      headers: generateApiReponseHeaders(),
    }

  } catch (e) {
    console.log('getProductsListHandler Error: ', e);

    return {
      statusCode: 500,
      body: JSON.stringify(`Can't get products list :(( ${e}`),
      headers: generateApiReponseHeaders(),
    }
  }
}
