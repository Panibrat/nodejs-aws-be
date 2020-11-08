const dropStockTableQuery = `
    DROP TABLE IF EXISTS stock;
  `;

export const dropStockTable = async (client) => {
    console.log('dropStockTable');

    try {
        await client.query(dropStockTableQuery);

    } catch (e) {
        console.log('dropStockTable Error: ', e);
    }
};
