const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var numberRegex = /^\d+$/;

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
            case "Add to Inventory":
                inventoryPrompt();
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

function inventoryPrompt(){
    inquirer.prompt([
        {
            name: "product",
            message: "To which product are you adding inventory(Id)?",
            validate: function(input){
                if(!numberRegex.test(input)){
                    console.log("\n Please enter a valid Id".error);
                    return false;
                }
                else{
                    return true;
                }
            }
        },
        {
            name: "quantity",
            message: "How many are you adding?",
            validate: function(input){
                if(numberRegex.test(input)){
                    return true;
                }
                else{
                    console.log("Please enter whole numbers".error);
                    return false;
                }
            }
        }
    ]).then(function(input){
        var id = input.product;
        var quantity = input.quantity;
        addInventory(id, quantity);
    })
}

function addInventory(id, quantity){
    connection.query(
        "SELECT stock_quantity FROM products WHERE item_id = ?", 
        [id],
        function(err, res){
            if(err) throw err;
            var currentStock = res[0].stock_quantity;
            var newStock = parseInt(currentStock) + parseInt(quantity);
            connection.query(
                "UPDATE products SET ? WHERE ?", 
                [
                    {
                        stock_quantity: newStock
                    },
                    {
                        item_id: id
                    }
                ],
                function(err, res){
                    if(err) throw err;
                    console.log("Updated inventory of Item Id: " + id);
                    console.log("New stock quantity: " + newStock);
                    connection.end();
                }
            )
        }
    )
}