import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { getClient } from './db/clientDb';
import { insertProductToTables } from './models/insertProductToTables';

import { generateApiReponseHeaders } from './utils/generateApiReponseHeaders';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('postProductHandler: Event: ', event);

  const { body } = event;

  const { title, description, price, count } = JSON.parse(body);

  if (!title || !description || !price || !count) {
    return {
      statusCode: 400,
      body: `Error: Mandatory product data is missed :( `,
      headers: generateApiReponseHeaders(),
    }
  }

  const product = {
    title,
    description,
    price,
    count,
  };

  try {
    const client = await getClient();

    await insertProductToTables(client, product);

    client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(product),
      headers: generateApiReponseHeaders(),
    }

  } catch (e) {
    console.log('getProductsListHandler Error: ', e);

    return {
      statusCode: 500,
      body: JSON.stringify(`Can't create new product :(( ${e}`),
      headers: generateApiReponseHeaders(),
    }
  }
}
