USE BamazonDB;

CREATE TABLE departments (
    department_id INT(30) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    over_head_costs DECIMAL(10,2),
    product_sales DECIMAL(10,2),
    total_profit DECIMAL(10,2)
);