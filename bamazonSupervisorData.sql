USE BamazonDB;

INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(1, 'Kitchen', 40000, 300000, 260000);
INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(2, 'Home & Accesory', 60000, 200000, 140000);
INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(3, 'Bedroom', 70000, 500000, 430000);
INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(4, 'Office', 100000, 500000, 400000);

SELECT * FROM departments;