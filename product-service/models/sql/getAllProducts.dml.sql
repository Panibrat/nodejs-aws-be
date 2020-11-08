SELECT product_id, title, description, price, count
FROM products
LEFT JOIN stock
ON products.id=stock.product_id;
