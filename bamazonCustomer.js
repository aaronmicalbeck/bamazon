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
// Global Variables
// //////////////////////////////////////////////////////////////////////////////////////////////

// Array of items in customer's cart (objects)
let cartArr = [];

// //////////////////////////////////////////////////////////////////////////////////////////////
// Upon connecting to the database, prompt user
// //////////////////////////////////////////////////////////////////////////////////////////////

connection.connect(function (err) {
  if (err) throw err;
  customerNavigate();
});

// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to prompt user with a list of commands from which to choose
// //////////////////////////////////////////////////////////////////////////////////////////////

function customerNavigate() {
  console.log
(`-------------------------------------------`)
  inquirer
    .prompt({
      name: "navigation",
      type: "list",
      message: "What would you like to do?",
      choices: ["Start Shopping", "View Cart", "Checkout", "Quit"]
    })
    .then(function (answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.navigation === "Start Shopping") {
        showProducts();
        addToCart();
      } else if (answer.navigation === "View Cart") {
        viewCart();
      } else if (answer.navigation === "Checkout") {
        checkOut();
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
  let query = "SELECT * FROM products";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
  });
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to update quantity of product chosen in database
// //////////////////////////////////////////////////////////////////////////////////////////////

function addToCart() {
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
        message: "What item would you like purchase?"
      })
      .then(function (answer) {
        let chosenItem;
        for (var i = 0; i < res.length; i++) {
          if (res[i].product_name === answer.choice) {
            chosenItem = res[i];
          }
        }

        if (chosenItem.stock_quantity >= 1) {
          connection.query(
            "UPDATE products SET stock_quantity = stock_quantity -1 WHERE item_id='" +
            chosenItem.item_id +
            "'",
            function (error) {
              if (error) console.log(error);

              console.log(`${chosenItem.product_name} added to cart!
-----------------------------------------------------`);
              cartArr.push({
                product: chosenItem.product_name,
                price: chosenItem.PRICE,
                quantity: 1
              });
              customerNavigate();
            }
          );
        } else {
          console.log(`Sorry we are out of that product.
          ----------------------------------------------`);
          customerNavigate();
        }
      });
  });
}
// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to display items in cart for user
// //////////////////////////////////////////////////////////////////////////////////////////////

function viewCart() {
  if (cartArr.length < 1){
    console.log(`Your cart is empty.
------------------------------------`);
    customerNavigate();
  } 
  
  else {
  console.table(cartArr);
  let totalPrice = cartArr.reduce(function (prev, cur) {
    return prev + cur.price;
  }, 0);
  console.log(`Your total is $${Math.round(totalPrice * 100) / 100}
--------------------------------------------------------------`);
  customerNavigate();
} 
}

// //////////////////////////////////////////////////////////////////////////////////////////////
// Function to prompt user to complete order
// //////////////////////////////////////////////////////////////////////////////////////////////

function checkOut() {
  let totalPrice = cartArr.reduce(function (prev, cur) {
    return prev + cur.price;
  }, 0);
  console.log(`Your total is $${Math.round(totalPrice * 100) / 100}
----------------------------------------------------------------`);
  inquirer
    .prompt({
      name: "confirm",
      type: "confirm",
      default: true,
      message: "Would you like to complete your order?"
    })
    .then(function (answer) {
      if (answer.confirm) {
        console.log(`Thank you for shopping with us!
-----------------------------------------------------`);
        cartArr = [];
        customerNavigate();
      } else {
        customerNavigate();
      }
    });
}
