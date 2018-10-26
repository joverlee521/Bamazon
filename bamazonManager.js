const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    menuOptions();
});

function ConsoleRow(id, name, price, quantity){
    this.Id = id;
    this.Name = name;
    this.Price = price;
    this.Quantity = quantity
}

function menuOptions(){
    inquirer.prompt([
        {
            type: "list",
            name: "command",
            message: "Choose a command: ",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add new Product"]
        }
    ]).then(function(input){
        switch(input.command){
            case "View Products for Sale":
                showAllProducts();
                break;
            case "View Low Inventory":
                showLowInventory();
                break;
        }
    })
}

function printProducts(res){
    var table = [];
    for(var i = 0; i < res.length; i++){
        var newRow = new ConsoleRow(res[i].item_id, res[i].product_name, res[i].price, res[i].stock_quantity);
        table.push(newRow);
    }
    console.table(table);
}

function showAllProducts(){
    connection.query(
        "SELECT * FROM products",
        function(err,res){
            if(err) throw err;
            console.log("Current Products: \n");
            printProducts(res);
            connection.end();
        }
    )
}

function showLowInventory(){
    connection.query(
        "SELECT * FROM products WHERE stock_quantity BETWEEN 0 and 5 ",
        function(err, res){
            if(err) throw err;
            console.log("Products with low inventory: \n")
           printProducts(res);
           connection.end();
        }
    )
}