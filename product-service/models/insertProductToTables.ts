import { v4 as uuidv4 } from 'uuid';

import { getInsertProductQuery } from './getInsertProductQuery';
import { getInsertStockQuery } from './getInsertStockQuery';

export const insertProductToTables = async(client, product) => {
    const id = uuidv4();

    try {
        const productQuery = getInsertProductQuery(id, product);
        await client.query(productQuery);

        const stockQuery = getInsertStockQuery(id, product);
        await client.query(stockQuery);

        console.log(`Product ${product.title} is added successfully`);
    } catch (e) {
        console.log('insertProductToTables Error: ', e);
    }
};
