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

//connect to mysql server and database
connection.connect(function(err){
    //deal with errors if any
    if (err) throw err;
    //run the managerOptions function
    managerOptions();
});