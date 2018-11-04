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
    
    ManagerOptions();
});

function ManagerOptions() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What do you want to do?",
                choices: ['View Products for Sale', 'View Low Inventory', 'Update products in Inventory', 'Add New Product', 'Nothing'],
                name: "options"
            }
        ]).then(function(data) {

            if(data.options === 'View Products for Sale') {
                console.log('view products for sale!');
                viewProducts();
            }
            else if(data.options === 'View Low Inventory') {
                console.log('view low inventory!');
                viewLowInventory();
            }
            else if(data.options === 'Update products in Inventory') {
                console.log('Update inventory!');
                UpdateInventory()
            }
            else if(data.options === 'Add New Product') {
                console.log('add new product!');
                addInventory();
            }
            else {
                connection.end();
                return;
            }
        });
};

function viewProducts() {
    connection.query('SELECT * FROM products', function(err, data) {
        if(err) throw err;

        console.log('\n------------- Here are the products for sale --------------');
        for(var i = 0; i < data.length; i++) {
            console.log(data[i].item_id + '. ' + data[i].product_name + ' ------ $' + data[i].price + '/per');
        };
        console.log('\n-----------------------------------------------------------');
        continueAction();
    });
};

function viewLowInventory() {
    connection.query('SELECT * FROM products', function(err, data) {
        if(err) throw err;

        console.log('\n------------- Low Inventory Info (stock below 200) --------------');
        for(var i = 0; i < data.length; i++) {
            if(data[i].stock_quantity < 200) {
                console.log(data[i].item_id + '. ' + data[i].product_name + ' ------ ' + data[i].stock_quantity + " remaining.");
            }
        };
        console.log('\n-----------------------------------------------------------');
        continueAction();
    })
};

function UpdateInventory() {
    var list = [];
    connection.query('SELECT * FROM products', function(err, data) {
        if (err) throw err;

        for(var i = 0; i < data.length; i++) {
            var itemName = data[i].product_name;
            list.push(itemName);
        };
        console.log("\nHere is the list of existing items: \n" + list + '\n');
        
        inquirer
        .prompt([
            {
                type: 'list',
                message: 'Which item are you updating?',
                choices: list,
                name: 'itemOptions'
            },
            {
                type: 'input',
                message: 'What is the updated stock quantity of this item?',
                name: 'stockNum'
            }
        ]).then(function(res) {
            console.log('\nUpdating ' + res.itemOptions + ' quantities.');
            
            var quantity = res.stockNum;
            var name = res.itemOptions;
            // THE FOLLOWING DOESNT SEEM WORKING...........................
            addtoInventory(quantity,name);
        });
    })

};

function addtoInventory(quantity,name) {
    connection.query(
        'UPDATE products SET ? WHERE ?',
        [
            {
                stock_quantity: quantity
            },
            {
                product_name: name
            }
        ], 
        function(err, res) {
            if(err) throw err;

            console.log(res.affectedRows + " products updated!\n");
            continueAction();
        }
    )
}


function addInventory() {
    var itemID;
    connection.query('SELECT * FROM products', function(err, data) {
        if(err) throw err;

        itemID = data.length + 1;
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the product?',
                name: 'name'
            },
            {
                type: 'list',
                message: 'What is the name of the department?',
                choices: ['Kitchen','Home & Accesory','Bedroom','Office'],
                name: 'department'
            },
            {
                type: 'input',
                message: 'What is the sale price for this item?',
                name: 'price'
            },
            {
                type: 'input',
                message: 'How many of this item you want to add into the inventory?',
                name: 'stock'
            }
        ]).then(function(data) {
            connection.query(
                'INSERT INTO products SET ?',
                {
                    item_id: itemID,
                    product_name: data.name,
                    department_name: data.department,
                    price: data.price,
                    stock_quantity: data.stock
                },
                function(err, res) {
                    if(err) throw err;
                    console.log(res.affectedRows + " product added!\n");
                    continueAction();
                }
            )
        });
};

function continueAction() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "Would you like to do something else?",
                choices: ['Yes','No'],
                name: "options"
            }
        ]).then(function(res) {
            if(res.options === 'Yes') {
                ManagerOptions();
            }
            else {
                connection.end();
                return;
            }
        })
}