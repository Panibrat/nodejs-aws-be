import { Client } from 'pg';

const createProductTableQuery = `
    CREATE TABLE products(
      id uuid primary key UNIQUE,
      title text,
      description text,
      price integer,
      image_src text
    );
  `;

export const createProductTable = async (client: Client) => {
    console.log('createProductTable');

    try {
        await client.query(createProductTableQuery);

    } catch (e) {
        console.log('createProductTable Error: ', e);
    }
};
