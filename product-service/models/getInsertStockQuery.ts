export const getInsertStockQuery = (id, { count }) => {
    return `
      INSERT INTO stock
        (product_id, count)
        VALUES('${id}', ${count});
    `;
};
