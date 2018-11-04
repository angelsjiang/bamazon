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
    connection.query('SELECT * FROM departments', function(err, data) {
        if(err) throw err;

        console.log('\n----------------- Departments information -----------------\n');
        console.log('department_id ------ department_name ------ over_head_costs ------ product_sales ------- total_profit');
        for(var i = 0; i < data.length; i++ ){
            console.log(data[i].department_id + ' ------ ' + data[i].department_name + ' ------ ' 
                + data[i].over_head_costs + ' ------ ' + data[i].product_sales + ' ------ ' + data[i].total_profit);
        }
        continueInquire();
    })
};

function continueInquire() {
    inquirer
        .prompt([
            {
                type: 'list',
                message: 'What else do you want to do?',
                choices: ['Create New Department', "That's it"],
                name: 'options'
            }
        ]).then(function(res) {
            console.log(res);
            if(res.options === "Create New Department") {
                createDepartment();
            }
            else {
                connection.end();
            }
        })
}


// Don't think I need this here
function createDepartment() {
    var departID= 0;
    connection.query('SELECT * FROM departments', function(err, data) {
        if(err) throw err;

        departID = data.length + 1;
    });
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'What is the name of the department?',
                name: 'name'
            },
            {
                type: 'input',
                message: 'What is the over_head_costs of this department?',
                name: 'cost'
            }
        ]).then(function(res) {
            connection.query(
                'INSERT INTO departments SET ?',
                {
                    department_id: departID,
                    department_name: res.name,
                    over_head_costs: res.cost
                },
                function(err, res2) {
                    if(err) throw err;

                    console.log(res2.affectedRows + " department added!");
                    continueInquire();
                }
            )
        })
};
