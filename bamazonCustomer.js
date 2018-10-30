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
        inquireCustomer(); // PROBLEM!! ASYNCHRONOUS CALL
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
            // console.log(input.product_ID);
            // console.log(input.purchase_num);
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
                            
                            // NEED TO PUT IN AN UPDATE FUNCTION
                            var query = connection.query(
                                "UPDATE products SET ? WHERE?",
                                [
                                    {
                                        stock_quantity: newQuantity
                                    },
                                    {
                                        item_id: input.product_ID
                                    }
                                ],
                                function(err, res) {
                                    if (err) throw err;

                                    console.log("Purchase success! You have purchased " + 
                                        itemPurchased + " of " + itemName + "!");
                                }
                            )
                        }
                    }
                }
                connection.end();
            })
        })
};
