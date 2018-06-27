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
//function that generates the table that displays the selection of beans. contains a call for the function that prompts the user selection.
function queryBeans(){
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        resLength = res.length + 1;
        //clear global values
        iDarray = [];
        stockCounter = [];
        productChoices =[];
        priceList = [];
        //display for information gathered through mysql server query
        console.log("================================================================================================================");
        console.log("                      WELCOME TO BEANAZON, THE INTERNET'S PREMIER BEAN RETAILER")
        console.log("================================================================================================================");
        //added code to make sure 1 and 2 digit item id's display uniformly to ease user interface. could be expanded if a sufficient 
        //number of items are added to generate 3 digit id's. these for loops also populate arrays that hold product data for use in the next function.
        if (res.length > 9){
        for (var i = 0; i < 9; i++){
            console.log("beanazon product ID: " + res[i].item_id + "  || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
            iDarray.push(res[i].item_id);
            stockCounter.push(res[i].stock_quantity);
            productChoices.push(res[i].product_name);
            priceList.push(res[i].price);
            }
        for (var i = 9; i < res.length; i++){
            console.log("beanazon product ID: " + res[i].item_id + " || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
            iDarray.push(res[i].item_id);
            stockCounter.push(res[i].stock_quantity);
            productChoices.push(res[i].product_name);
            priceList.push(res[i].price);
            }
        } 
        console.log("================================================================================================================");
        //start function is called
        start();
    })  
}
//start function prompts the user for input and uses that input to update stock (if order is possible)
function start() {
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "Please enter the ID of the bean you'd like to purchase.",
                //make sure entry is a positive integer in the range of possible ids
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
                //make sure entry is a positive integer
                validate: function(value) {
                    if (isNaN(value) === false && value >= 1) {
                      return true;
                    }
                    return false;
                    
                  }
            }
        ])
        .then(function(answer) {
            //clear selectionArray
            selectionArray = [];
            //populate selectionArray with relevant data from the user's choice. these values are used in subsequent code.
            for (i=0; i < iDarray.length; i++) {
                if (parseInt(iDarray[i]) === parseInt(answer.itemID)) {
                    selectionArray.push(parseInt(iDarray[i]));
                    selectionArray.push(productChoices[i]);
                    selectionArray.push(parseInt(stockCounter[i]));
                    //used parseFloat since the price needs to have 2 decimal values
                    selectionArray.push(parseFloat(priceList[i]));
                }
            }
            //ensure there is enough stock on hand to fulfill the order. if there isn't, notify user.
            if (parseInt(answer.quantity) > parseInt(selectionArray[2])) {
                console.log("Sorry, we don't have enough " + selectionArray[1].toLowerCase() + " in stock to fulfill your order");
                //call function that allows user to choose to continue or exit the application.
                endgame();
            }
            
            else{
            //if stock is sufficient, update the relevant stock_quantity from the mysql table.
              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: parseInt(selectionArray[2]) - parseInt(answer.quantity)
                  },
                  {
                    item_id: parseInt(answer.itemID)
                  }
                ],
                function(err) {
                  if (err) throw err;
                  //set variable to hold the total cost of the order
                  var cost = selectionArray[3] * parseInt(answer.quantity);
                  //update the stock in the selectionArray. this prevents the user from being allowed to order more than is actually on hand.
                  selectionArray[2] = parseInt(selectionArray[2]) - parseInt(answer.quantity);
                  //inform user of the success of the order and give them a summary of the relevant order details.
                  console.log("You have purchased " + answer.quantity + " kg of " + selectionArray[1].toLowerCase() + 
                  " & your account has been charged $" + cost.toFixed(2) + 
                  ". Thanks for shopping with beanazon!!");
                  //call function that allows user to choose to continue or exit the application.
                  endgame();
                }
              );
            }
            }    
          
        )};

//function that allows user to either place another order, or exit the app
function endgame() {
    inquirer
      //ask if the user would like to continue via a y or n prompt  
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