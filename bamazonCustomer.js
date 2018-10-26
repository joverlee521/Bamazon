const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");

var numberRegex = /^\d+$/;
var greatestId = 0;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

function ConsoleRow(id, name, price) {
    this.Id = id;
    this.Name = name;
    this.Price = price;
}

connection.connect(function(err){
    if(err) throw err;
    console.log("connected as id " + connection.threadId);
    showProducts();
});

function showProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log("Current Products: \n");
        greatestId = res[res.length - 1].item_id;
        var table = [];
        for(var i = 0; i < res.length; i++){
            var row = new ConsoleRow(res[i].item_id,res[i].product_name, res[i].price);
            table.push(row);
        }
        console.table(table);
        orderPrompt(greatestId);
    })
}

function orderPrompt(greatestId){
    inquirer.prompt([
        {
            name: "id",
            message: "Which item would you like to purchase? (Please enter the Id of the product)",
            validate: function(input){
                if(input > greatestId || input < 1 || !numberRegex.test(input)){
                    console.log("\n Please enter a valid Id");
                    return false;
                }
                else{
                    return true;
                }
            }
        },
        {
            name: "quantity",
            message: "How many would you like to purchase?",
            validate: function(input){
                if(numberRegex.test(input)){
                    return true;
                }
                else{
                    console.log("Please enter whole numbers");
                    return false;
                }
            }
        }
    ]).then(function(input){
        var id = input.id;
        var quantity = input.quantity;
        console.log("\n Checking out...");
        checkStorage(id, quantity);
    })
}

function checkStorage(id, quantity){
    connection.query(
        "SELECT * FROM products WHERE item_id = ?",
        [id],
        function(err,res){
            if(err) throw err;
            var currentStock = res[0].stock_quantity;
            var price = res[0].price;
            if(quantity > currentStock){
                console.log("\n Order Failed! Insufficient storage to complete the order!");
                orderPrompt(greatestId);
            }
            else{
                var newStock = currentStock - quantity;
                updateStorage(newStock, id, quantity, price);
            }
        }
    )
}

function updateStorage(newStock, id, quantity, price){
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
            var totalCost = quantity * price;
            console.log("The total cost of your order is $" + totalCost);
            restartPrompt();
        }
    )
}

function restartPrompt(){
    inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Would you like to continue shopping?",
            default: true
        }
    ]).then(function(input){
        if(input.confirm){
            showProducts();
        }
        else{
            console.log("Thank you for shopping with Bamazon!");
            connection.end();
        }
    })
}