var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon"
});

connection.connect(function(err){
    if (err) throw err;
    customerNavigate();


});

function customerNavigate(){
     inquirer
          .prompt({
            name: "navigation",
            type: "list",
            message: "What would you like to do?",
            choices: ["Start Shopping", "View Cart", "Checkout"]
          })
          .then(function(answer) {
            // based on their answer, either call the bid or the post functions
            if (answer.navigation === "Start Shopping") {
            showProducts();
            addToCart();
            }
            else if(answer.navigation === "View Cart") {
              showProducts();
        
            } 
            // else if(answer.navigation === "Checkout"){
            //     checkOut();
            // }
            else{
              connection.end();
            }
          });
      }



function showProducts(){
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table(res);
        connection.end();
    })
    
};


function addToCart(){
    let query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if (err) throw err;
    inquirer.prompt(
        {
          name: "choice",
          type: "rawlist",
          choices: function() {
            var choiceArray = [];
            for (var i = 0; i < res.length; i++) {
              choiceArray.push(res[i].product_name);
            }
            return choiceArray;
          },
          message: "What item would you like purchase?"
        }).then(function(answer){
            
        })

})
}

// function checkOrder();



