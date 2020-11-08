const createStockTableQuery = `
    CREATE TABLE stock (
      id serial,
      product_id uuid UNIQUE,
      count integer NOT NULL,
      CONSTRAINT product_id FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `;

export const createStockTable = async (client) => {
    console.log('createStockTable');

    try {
        await client.query(createStockTableQuery);

    } catch (e) {
        console.log('createStockTable Error: ', e);
    }
};
