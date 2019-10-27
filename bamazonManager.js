// //////////////////////////////////////////////////////////////////////////////////////////////
// MySql Connection & Inquirer import
// //////////////////////////////////////////////////////////////////////////////////////////////

const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "root",
    database: "bamazon"
});


// //////////////////////////////////////////////////////////////////////////////////////////////
// Upon connecting to the database, prompt user
// //////////////////////////////////////////////////////////////////////////////////////////////

connection.connect(function (err) {
    if (err) throw err;
    managerNavigate();
});


// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to prompt user with a list of commands from which to choose
// //////////////////////////////////////////////////////////////////////////////////////////////

function managerNavigate() {

    inquirer
        .prompt({
            name: "navigation",
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"]
        })
        .then(function (answer) {
            
            if (answer.navigation === "View Products") {
                showProducts();
            } else if (answer.navigation === "View Low Inventory") {
                viewLowInv();
            } else if (answer.navigation === "Add to Inventory") {
                addInv();
            } else if (answer.navigation === "Add New Product") {
                addProduct();
            } else if (answer.navigation === "Quit") {
                process.exit();
            } else {
                connection.end();
            }
        });
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the products in a table for the user
// //////////////////////////////////////////////////////////////////////////////////////////////

function showProducts() {
    console.log(`--------------------------------------------`);
    let query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log(`---------------------------------------------`);
        managerNavigate();
    });
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to display the products with low inventory (less than 5) in a table for the user
// //////////////////////////////////////////////////////////////////////////////////////////////

function viewLowInv() {

    let query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        managerNavigate();
    });
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to add inventory item
// //////////////////////////////////////////////////////////////////////////////////////////////

function addInv() {
    let query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        inquirer
            .prompt({
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].product_name);
                    }
                    return choiceArray;
                },
                message: "Which inventory do you want to add to?"
            })
            .then(function (answer) {
                let chosenItem;
                for (var i = 0; i < res.length; i++) {
                    if (res[i].product_name === answer.choice) {
                        chosenItem = res[i];
                    }
                
                }
                inquirer.prompt({
                    name: "add",
                    type: "input",
                    message: "How many would you like to add?"
                }).then(function (answer) {
                    connection.query("UPDATE products SET stock_quantity = stock_quantity + " + answer.add + " WHERE item_id= " +
                        chosenItem.item_id + "", function (err, res) {
                            if (err) console.log(err);
                        })
                        showProducts();
                        console.log(`Inventory has been updated
----------------------------------------`);
                        
                })



            });
    });
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to add a new product to the inventory list
// //////////////////////////////////////////////////////////////////////////////////////////////

function addProduct() {
    inquirer
        .prompt([
            {
                name: "item",
                type: "input",
                message: "What is the product you would like to add?"
            },
            {
                name: "department",
                type: "input",
                message: "What department would you like to file this product?"
            },
            {
                name: "price",
                type: "input",
                message: "What is the price of this product?",
            
            },
            {
                name: "quantity",
                type: "input",
                message: "How many are you adding to inventory?",
            
            }
        ])
        .then(function (answer) {

            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.item,
                    department_name: answer.department,
                    price: answer.price,
                    stock_quantity: answer.quantity
                },
                function (err) {
                    if (err) console.log(err);
                    

                }
                
            );
            console.log("This item has been added to the inventory.");
                    showProducts();
        });
}






