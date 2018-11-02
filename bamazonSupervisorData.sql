USE BamazonDB;

INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(1, 'Kitchen', 40000, null, null);
INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(2, 'Home & Accesory', 60000, null, null);
INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(3, 'Bedroom', 70000, null, null);
INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(4, 'Office', 100000, null, null);
INSERT INTO departments(department_id, department_name, 
    over_head_costs, product_sales, total_profit)
VALUES(4, 'Bathroom', 300000, null, null);

SELECT * FROM departments;