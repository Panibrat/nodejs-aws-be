CREATE TABLE products(
	id uuid primary key UNIQUE,
	title text,
	description text,
	price numeric NOT NULL,
	image_src text
);
