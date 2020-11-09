const getProductsJoinedInfoQuery = `
    SELECT id, title, description, price, image_src, count
      FROM products
      LEFT JOIN stock
      ON products.id=stock.product_id;
  `;

export const getProductsJoinedInfo = async (client) => {
    console.log('getProductsJoinedInfo');

    try {
        const { rows } = await client.query(getProductsJoinedInfoQuery);
        return rows;

    } catch (e) {
        console.log('getProductsJoinedInfo Error: ', e);
    }
};
