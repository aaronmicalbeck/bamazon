DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;


CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(25) NOT NULL,
  department_name VARCHAR(25) NOT NULL,
  PRICE INT DECIMAL(5,2),
  stock_quantity INT not null,
  PRIMARY KEY (item_id)
);

