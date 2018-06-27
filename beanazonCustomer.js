var mysql = require("mysql");
var inquirer = require("inquirer");

//establish connection information for sql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "beanazon_db"

});
//set variables to help keep track of items/data accross functions
var resLength = 0;
var iDarray = [];
var stockCounter = [];
var productChoices =[];
var priceList = [];
var selectionArray = [];

//connect to mysql server and database
connection.connect(function(err){
    //deal with errors if any
    if (err) throw err;
    //run the queryBeans function
    queryBeans();
});

function queryBeans(){
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        resLength = res.length + 1;
        console.log("=============================================================================================");
        for (var i = 0; i<res.length; i++){
            console.log("beanazon product ID: " + res[i].item_id + " || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
            iDarray.push(res[i].item_id);
            stockCounter.push(res[i].stock_quantity);
            productChoices.push(res[i].product_name);
            priceList.push(res[i].price);

        }
        console.log("=============================================================================================");
        start();
    })  
}

function start() {
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "Please enter the ID of the bean you'd like to purchase.",
                validate: function(value) {
                    if (isNaN(value) === false && value > 0 && value < resLength) {
                      return true;
                    }
                    return false;
                    
                  }
            },
            {
                name: "quantity",
                type: "input",
                message: "Please enter the quanity you'd like to purchase.",
                validate: function(value) {
                    if (isNaN(value) === false && value > 0) {
                      return true;
                    }
                    return false;
                    
                  }
            }
        ])
        .then(function(answer) {
           
            for (i=0; i < iDarray.length; i++) {
                if (parseInt(iDarray[i]) === parseInt(answer.itemID)) {
                    selectionArray.push(parseInt(iDarray[i]));
                    selectionArray.push(productChoices[i]);
                    selectionArray.push(parseInt(stockCounter[i]));
                    selectionArray.push(parseFloat(priceList[i]));
                }
            }

            if (parseInt(answer.quantity) > parseInt(selectionArray[2])) {
                console.log("Sorry, we don't have enough " + selectionArray[1] + " in stock to fulfill your order");
                endgame();
            }
            
            else{

              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: parseInt(stockCounter[parseInt(answer.itemID - 1)]) - parseInt(answer.quantity)
                  },
                  {
                    item_id: parseInt(answer.itemID)
                  }
                ],
                function(err) {
                  if (err) throw err;
                  console.log(selectionArray[3] * parseInt(answer.quantity));
                  console.log("You have purchased " + answer.quantity + " kg of " + selectionArray[1] + 
                  " & your account has been charged $" + selectionArray[3] * parseInt(answer.quantity) + 
                  ". Thanks for shopping with beanazon!!");
                  endgame();
                }
              );
            }
            }    
          
        )};


function endgame() {
    inquirer
        .prompt({
        name: "continue",
        type: "confirm",
        message: "Would you like to order more beans?",
        })
        .then(function(answer) {
        // based on their answer, either run queryBeans function (i.e. start over) or end the connection and exit the app
        if (answer.continue === true) {
            queryBeans();
        }
        else{
            connection.end();
            return;
        }
        });
    }