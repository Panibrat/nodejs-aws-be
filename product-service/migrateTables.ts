import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { getClient } from './db/clientDb';

import products from './db/productList.json';
import { generateApiReponseHeaders } from './utils/generateApiReponseHeaders';
import { dropProductTable } from './models/dropProductTable';
import { dropStockTable } from './models/dropStockTable';
import { createProductTable } from './models/createProductTable';
import { createStockTable } from './models/createStockTable';
import { insertProductToTables } from './models/insertProductToTables';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('migrateTables: Event: ', event);

  try {
    const client = await getClient();

    await dropProductTable(client);

    await dropStockTable(client);

    await createProductTable(client);

    await createStockTable(client);

    for await (let product of products) {
      await insertProductToTables(client, product);
    }

    client.end();

    return {
      statusCode: 200,
      body: JSON.stringify(`Tables created and ${products.length} products are added successfully`),
      headers: generateApiReponseHeaders(),
    }

  } catch (e) {
    console.log('DB Error: ', e);

    return {
      statusCode: 500,
      body: JSON.stringify(`DB Error: ${e}`),
      headers: generateApiReponseHeaders(),
    }
  }
}
