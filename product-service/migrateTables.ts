import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Client } from 'pg';
import { v4 as uuidv4 } from 'uuid';

import { generateApiReponseHeaders } from './utils/generateApiReponseHeaders';
import products from './db/productList.json';

const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

const dbOptions = {
  host: PG_HOST,
  port: PG_PORT,
  database: PG_DATABASE,
  user: PG_USERNAME,
  password: PG_PASSWORD,
  ssl: {
    rejectUnauthorized: false,
  },
  connectionTimeoutMillis: 5000,

};

export const handler: APIGatewayProxyHandler = async (event) => {
  console.log('migrateTables: Event: ', event);
  const client = new Client(dbOptions);
  await client.connect();

  const dropProductTable = `
    DROP TABLE IF EXISTS products CASCADE;
  `;

  const createProductTable = `
    CREATE TABLE products(
      id uuid primary key UNIQUE,
      title text,
      description text,
      price integer,
      image_src text
    );
  `;

  const dropStockTable = `
    DROP TABLE IF EXISTS stock;
  `;

  const createStockTable = `
    CREATE TABLE stock (
      id serial,
      product_id uuid UNIQUE,
      count integer NOT NULL,
      CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;

  const getProductsJoinedInfo = `
    SELECT product_id, title, description, price, count
      FROM products
      LEFT JOIN stock
      ON products.id=stock.product_id;
  `;

  const getInsertProductQuery = (id, { price, description, title, image_src='' }) => {
    return `
      INSERT INTO products
        (id, title, description, price, image_src)
        values('${id}', '${title}', '${description}', ${price}, '${image_src}');
    `;
  };

  const getInsertStockQuery = (id, { count }) => {
    return `
      INSERT INTO stock
        (product_id, count)
        VALUES('${id}', ${count});
    `;
  };

  const insertProductToTables = async(product) => {
    const id = uuidv4();
    const productQuery = getInsertProductQuery(id, product);
    await client.query(productQuery);

    const stockQuery = getInsertStockQuery(id, product);
    await client.query(stockQuery);
  };

  try {
    await client.query(dropProductTable);
    console.log('dropProductTable');

    await client.query(dropStockTable);
    console.log('dropStockTable');

    await client.query(createProductTable);
    console.log('createProductTable');

    await client.query(createStockTable);
    console.log('createStockTable');

    for await (let product of products) {
      await insertProductToTables(product);
      console.log(`Product ${product.title} is added successfully`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(`Tables created and ${products.length} products are added successfully`),
      headers: generateApiReponseHeaders(),
    }

  } catch (e) {
    console.log('DB Error: ', e);
  } finally {
    client.end();
  }
}
