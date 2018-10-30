DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(45) NOT NULL,
    department_name VARCHAR(45) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT(30) NOT NULL,
    product_sales DECIMAL(10,2) NULL,
    PRIMARY KEY(item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(45) NOT NULL,
    over_head_costs DECIMAL(10,2) NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Red Dead Redemption II", "Video games", 60, 100, 3000), ("Curved Ultrawide Monitor", "Electronics", 500, 20, 2500), ("Wireless Headphones", "Electronics", 150, 50, 1500), ("Standing Desk", "Furniture", 150, 25, 750), ("Raincoat", "Clothing", 50, 150, 1500), ("Crazy Rich Asians Trilogy", "Books", 40, 300, 800), ("Instant Pot", "Kitchen", 80, 100, 1600), ("KONG Classic Dog Toy", "Pet Supplies", 15, 300, 900), ("Ukulele", "Instruments", 40, 80, 1200), ("Erythritol", "Grocery", 12, 250, 600);

INSERT INTO departments (department_name, over_head_costs)
VALUES("Books", 1000),("Clothing", 2500),("Electronics", 7000),("Furniture", 4000),("Grocery", 2000),("Kitchen", 4500),("Instruments", 3000), ("Pet Supplies", 2000),("Video Games", 3500);