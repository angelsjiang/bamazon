var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: "BamazonDB"
});

connection.connect(function(err) {
    if(err) throw err;

    console.log("connected as id " + connection.threadId);
    
    afterConnection();
});

function afterConnection() {
    connection.query("SELECT * FROM products", function(err, data) {
        if(err) throw err;

        console.log("\n-------------------\n");
        console.log("DONE.");

        readSaleData();
         // PROBLEM!! ASYNCHRONOUS CALL
        // NEED TO CORRECT IT
    });
};

function readSaleData() {
    connection.query("SELECT * FROM products", function(err, data) {
        if(err) throw err;

        console.log("\n----------- Here are the items for sale -----------\n");
        for(var i = 0; i < data.length; i++) {
            console.log("\n" + data[i].item_id + ". " + data[i].product_name + "--- $" + data[i].price);
        };
        console.log("\n---------------------------------------------------\n");
        inquireCustomer();
    });
};

function inquireCustomer() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "Please enter the ID of the product you would like to purchase.",
                name: "product_ID"
            },
            {
                type: "input",
                message: "How many of it would you like to purchase?",
                name: "purchase_num"
            }
        ]).then(function(input) {
            connection.query("SELECT * FROM products", function(err, data) {
                if (err) throw err;

                for(var i = 0; i < data.length; i++) {
                    if(parseInt(input.product_ID) === data[i].item_id) {
                        if(input.purchase_num > data[i].stock_quantity) {
                            console.log("Insufficient stock quantity!");
                        }
                        else {
                            var newQuantity = data[i].stock_quantity - input.purchase_num;

                            var itemPurchased = input.purchase_num;
                            var itemName = data[i].product_name;

                            // update product_sales
                            var itemPrice = data[i].price;
                            var productSales = itemPurchased * itemPrice;
                            var productNewSales = productSales + data[i].product_sales;
                            var departmentName = data[i].department_name;

                            updateDepTable(departmentName, productNewSales);
                            caculateProfit(departmentName, productNewSales);
                            
                            // update the products table
                            connection.query(
                                "UPDATE products SET ? WHERE?",
                                [
                                    {
                                        stock_quantity: newQuantity,
                                        product_sales: productNewSales
                                    },
                                    {
                                        item_id: input.product_ID
                                    }
                                ],
                                function(err, res) {
                                    if (err) throw err;

                                    console.log("Purchase success! You have purchased " + 
                                        itemPurchased + " of " + itemName + "!");
                                    console.log("Thank you for shopping!");
                                    continueAction();
                                }
                            )
                        }
                    }
                }
            })
        })
};

function continueAction() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'Would you like to purchase another item?',
                choices: ['Yes', 'No'],
                name: 'options'
            }
        ]).then(function(res) {
            if(res.options === 'Yes') {
                readSaleData();
            }
            else {
                connection.end();
                return;
            }
        })
}

// update the departments table
function updateDepTable(department, newSales) {
    connection.query(
        'UPDATE departments SET ? WHERE ?',
        [
            {
                product_sales: newSales
            },
            {
                department_name: department
            }
        ],
        function(err, res) {
            if(err) throw err;

            // console.log(res.affectedRows + " departments got updated!");
        }
    )
};

function caculateProfit(department, newSales) {
    var overHeadCosts;
    connection.query('SELECT * FROM departments', function(err, data) {
        if(err) throw err;

        for(var i = 0; i < data.length; i++) {
            if(department === data[i].department_name) {
                overHeadCosts = data[i].over_head_costs;
            };
        };

        var newTotalProfit = newSales - overHeadCosts;

        connection.query(
            'UPDATE departments SET ? WHERE ?',
            [
                {
                    total_profit: newTotalProfit
                },
                {
                    department_name: department
                }
            ],
            function(err, res) {
                if(err) throw err;
                // console.log(res.affectedRows);
            }
        )
    })
};