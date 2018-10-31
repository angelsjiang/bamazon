var mysql = require('mysql');
var inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'BamazonDB'
});

connection.connect(function(err) {
    if(err) throw err;

    console.log("connected as id " + connection.threadId);
    inquiring();
});

function inquiring() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What do you want to do?',
                choices: ['View Product Sales by Department', 'Create New Department'],
                name: 'options'
            },
        ]).then(function(data) {
            if(data.options === "View Product Sales by Department") {
                viewProductSales();
            }
            else if(data.options === "Create New Department") {
                createDepartment();
            }
        });
};

function viewProductSales() {
    console.log('View departments!');
};

function createDepartment() {
    console.log('Create new department!');
};
