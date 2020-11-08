export const getInsertProductQuery = (id, { price, description, title, image_src='' }) => {
    return `
      INSERT INTO products
        (id, title, description, price, image_src)
        values('${id}', '${title}', '${description}', ${price}, '${image_src}');
    `;
};
