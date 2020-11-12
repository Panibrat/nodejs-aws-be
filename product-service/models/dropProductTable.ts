const dropProductTableQuery = `
    DROP TABLE IF EXISTS products CASCADE;
  `;

export const dropProductTable = async (client) => {
    console.log('dropProductTable');

    try {
        await client.query(dropProductTableQuery);

    } catch (e) {
        console.log('dropProductTable Error: ', e);
    }
};
