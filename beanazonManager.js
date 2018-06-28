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
var stockQuantityArray = [];
var counterLI = 0;
var resLength = 0;
var iDarray = [];
var stockCounter = [];
var productChoices =[];
var selectionArray = [];

//connect to mysql server and database
connection.connect(function(err){
    //deal with errors if any
    if (err) throw err;
    //run the managerOptions function
    setGlobalVars();
    managerOptions();
});

function setGlobalVars() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //clear and set resLength
        resLength = 0;
        resLength = res.length + 1;
        //clear global values
        iDarray = [];
        stockCounter = [];
        productChoices =[];
        for (var i = 0; i < res.length; i++){
            iDarray.push(res[i].item_id);
            stockCounter.push(res[i].stock_quantity);
            productChoices.push(res[i].product_name);
            }
        }) 
    }

function managerOptions() {
    inquirer
      .prompt({
        name: "optionsList",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Inventory", "View Low Inventory Items", "Add to Inventory", "Add a New Product"]
      })
      .then(function(answer) {
        // based on their answer, either call the appropriate function
        if (answer.optionsList === "View Inventory") {
          viewProducts();
        }
        else if (answer.optionsList === "View Low Inventory Items") {
            viewLowInventory();
        }
        else if (answer.optionsList === "Add to Inventory") {
            viewProducts2();
            setTimeout(addToInventory, 300);
        }
        else {
            addNewProduct();
        }
      });
  }

  function viewProducts() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            //display for information gathered through mysql server query
            console.log("================================================================================================================");
            console.log("                                             CURRENT INVENTORY")
            console.log("================================================================================================================");
            //added code to make sure 1 and 2 digit item id's display uniformly to ease user interface. could be expanded if a sufficient 
            //number of items are added to generate 3 digit id's. these for loops also populate arrays that hold product data for use in the next function.
            if (res.length > 9){
                for (var i = 0; i < 9; i++){
                    console.log("beanazon product ID: " + res[i].item_id + "  || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
                    }
                for (var i = 9; i < res.length; i++){
                    console.log("beanazon product ID: " + res[i].item_id + " || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
                    }
            } 
            else {
                for (var i = 0; i < res.length; i++){
                    console.log("beanazon product ID: " + res[i].item_id + " || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
                    }
            }
            console.log("================================================================================================================");
            //start function is called
            managerOptions();
        })  
    }

    function viewProducts2() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            //display for information gathered through mysql server query
            console.log("================================================================================================================");
            console.log("                                             CURRENT INVENTORY")
            console.log("================================================================================================================");
            //added code to make sure 1 and 2 digit item id's display uniformly to ease user interface. could be expanded if a sufficient 
            //number of items are added to generate 3 digit id's. these for loops also populate arrays that hold product data for use in the next function.
            if (res.length > 9){
                for (var i = 0; i < 9; i++){
                    console.log("beanazon product ID: " + res[i].item_id + "  || " + res[i].product_name + " | amount in stock: " + res[i].stock_quantity + " kg");
                    }
                for (var i = 9; i < res.length; i++){
                    console.log("beanazon product ID: " + res[i].item_id + " || " + res[i].product_name + " | amount in stock: " + res[i].stock_quantity + " kg");
                    }
            } 
            else {
                for (var i = 0; i < res.length; i++){
                    console.log("beanazon product ID: " + res[i].item_id + " || " + res[i].product_name + " | amount in stock: " + res[i].stock_quantity + " kg");
                    }
            }
            console.log("================================================================================================================");
        })
    }

    function viewLowInventory() {
        connection.query("SELECT * FROM products", function (err, res) {
            if (err) throw err;
            stockQuantityArray = [];
            for (var j = 0; j <res.length; j++) {
                stockQuantityArray.push(parseInt(res[j].stock_quantity));
            }
            //reset counter variable
            counterLI = 0;
            for (var k = 0; k < stockQuantityArray.length; k++){
                if (stockQuantityArray[k] > 5) {
                    counterLI++;
            }
        }
            if (counterLI === stockQuantityArray.length) {
                console.log("There are currently no low inventory items. Please choose another option.");
                managerOptions();
                return;
            }

            //display for information gathered through mysql server query
            console.log("================================================================================================================");
            console.log("                                             LOW INVENTORY ITEMS")
            console.log("================================================================================================================");
            //added code to make sure 1 and 2 digit item id's display uniformly to ease user interface. could be expanded if a sufficient 
            //number of items are added to generate 3 digit id's. these for loops also populate arrays that hold product data for use in the next function.
            if (res.length > 9){
                for (var i = 0; i < 9; i++){
                    if (res[i].stock_quantity <= 5){
                    console.log("beanazon product ID: " + res[i].item_id + "  || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
                        }
                    }
                for (var i = 9; i < res.length; i++){
                    if (res[i].stock_quantity <= 5){
                        console.log("beanazon product ID: " + res[i].item_id + "  || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
                        }
                    }
                }
            else {
                for (var i = 0; i < res.length; i++){
                    console.log("beanazon product ID: " + res[i].item_id + " || " + res[i].product_name + " | " + res[i].department_name + " | $" + res[i].price + " per kg | quantity available: " + res[i].stock_quantity + " kg");
                    }
                } 
            
            console.log("================================================================================================================");
            //start function is called
            managerOptions();
            })
    }

//start function prompts the user for input and uses that input to update stock (if order is possible)
function addToInventory() {
    inquirer
        .prompt([
            {
                name: "itemID",
                type: "input",
                message: "Please enter the ID of the bean you would like to restock.",
                //make sure entry is a positive integer in the range of possible ids
                validate: function(value) {
                    if (isNaN(value) === false && value > 0 && Number.isInteger(parseInt(value)) === true && value < resLength) {
                      return true;
                    }
                    return false;
                    
                  }
            },
            {
                name: "quantity",
                type: "input",
                message: "Please enter the quanity (in kg) by which you'd like to increase the inventory.",
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
                }
            }
        
            //if stock is sufficient, update the relevant stock_quantity from the mysql table.
              connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                  {
                    stock_quantity: parseInt(selectionArray[2]) + parseInt(answer.quantity)
                  },
                  {
                    item_id: parseInt(answer.itemID)
                  }
                ],
                function(err) {
                  if (err) throw err;
                  //update the stock in the selectionArray.
                  selectionArray[2] = parseInt(selectionArray[2]) + parseInt(answer.quantity);
                  //inform user of the success of the order and give them a summary of the relevant order details.
                  console.log("You have added " + answer.quantity + " kg of " + selectionArray[1].toLowerCase() + 
                  " to the inventory.  There are currently " + selectionArray[2] + " kg of " + selectionArray[1].toLowerCase() + " in stock.");
                  //call function that allows user to choose to continue or exit the application.
                  managerOptions();
                }
              );
            
            }    
          
        )};

  //function that allows user to either place another order, or exit the app
function endgame() {
    inquirer
      //ask if the user would like to continue via a y or n prompt  
      .prompt({
        name: "continue",
        type: "confirm",
        message: "Would you like to continue?",
        })
        .then(function(answer) {
        // based on their answer, either run queryBeans function (i.e. start over) or end the connection and exit the app
        if (answer.continue === true) {
            managerOptions();
        }
        else{
            connection.end();
            return;
        }
        });
    }