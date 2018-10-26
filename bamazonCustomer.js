// Required npm packages
const mysql = require("mysql");
const cTable = require("console.table");
const inquirer = require("inquirer");
const colors = require("colors");

// Variable declarations
var numberRegex = /^\d+$/;
var greatestId = 0;

// Custom color themes
colors.setTheme({
    title: ["cyan", "bold"],
    error: ["red", "bold"],
    question: ["yellow", "underline"]
})

// Create connection to mysql database
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

// Constructor for rows of console.table
function ConsoleRow(id, name, price) {
    this.Id = id;
    this.Name = name;
    this.Price = price;
}

// Connecting to database
connection.connect(function(err){
    if(err) throw err;
    showProducts();
});

// Prints available products to console as a table
function showProducts(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        console.log("\nCurrent Products: ".title);
        // Stores the item_id of the last product in database
        greatestId = res[res.length - 1].item_id;
        var table = [];
        // Loops through data and creates new row for each product 
        for(var i = 0; i < res.length; i++){
            var row = new ConsoleRow(res[i].item_id,res[i].product_name, res[i].price);
            table.push(row);
        }
        console.table(table);
        orderPrompt(greatestId);
    })
}

// Asks customer product and quantity they would like to buy
function orderPrompt(greatestId){
    inquirer.prompt([
        {
            name: "id",
            message: "Which item would you like to purchase(id)?".question,
            validate: function(input){
                // Input must be a positive number that cannot be greater than the id of the last product in database
                if(input > greatestId || !numberRegex.test(input)){
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
            message: "How many would you like to purchase?".question,
            validate: function(input){
                // Input must be a whole number
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
        var id = input.id;
        var quantity = input.quantity;
        console.log("\n Checking out...".cyan);
        checkStorage(id, quantity);
    })
}

// Checks database for product quantity
function checkStorage(id, quantity){
    connection.query(
        "SELECT * FROM products WHERE item_id = ?",
        [id],
        function(err,res){
            if(err) throw err;
            var currentStock = res[0].stock_quantity;
            var price = res[0].price;
            // If not enough product in stock, alert customer and restart order prompt
            if(quantity > currentStock){
                console.log("\n Order Failed! Insufficient storage to complete the order!".error);
                orderPrompt(greatestId);
            }
            else{
                var newStock = currentStock - quantity;
                updateStorage(newStock, id, quantity, price);
            }
        }
    )
}

// Update database with new product quantity after customer's purchase and gives customer total cost of purchase
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
            console.log(colors.magenta("The total cost of your order is $",totalCost + "\n"));
            restartPrompt();
        }
    )
}

// Gives customer the option to continue shopping
function restartPrompt(){
    inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Would you like to continue shopping?".question,
            default: true
        }
    ]).then(function(input){
        // If customer wants to continue show products again
        if(input.confirm){
            showProducts();
        }
        else{
            console.log("Thank you for shopping with Bamazon!".magenta);
            connection.end();
        }
    })
}