import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { getClient } from './db/clientDb';

import { generateApiReponseHeaders } from './utils/generateApiReponseHeaders';

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('getProductByIdHandler: Event: ', event);
  const id = event.pathParameters?.id;
  if (!id) {
    return {
      statusCode: 404,
      body: `Error: Mandatory path parameter is missed :( `,
      headers: generateApiReponseHeaders(),
    };
  }

  try {
    const client = await getClient();

    const query = `
      SELECT * FROM (SELECT id, title, description, price, image_src, count
      FROM products
      LEFT JOIN stock
      ON products.id=stock.product_id) AS derivedTable
      WHERE id='${id}';
    `;

    const { rows } = await client.query(query);

    client.end();

    if (!rows) {
      return {
        statusCode: 400,
        body: `Can't find product with id: ${id} `,
        headers: generateApiReponseHeaders(),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
      headers: generateApiReponseHeaders(),
    }

  } catch (e) {
    console.log('getProductById Error: ', e);

    return {
      statusCode: 500,
      body: JSON.stringify(`Can't get product. Error: ${e}`),
      headers: generateApiReponseHeaders(),
    }
  }
}
