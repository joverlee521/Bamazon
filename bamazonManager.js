const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var numberRegex = /^\d+$/;
var priceRegex = /^(\d*([.,](?=\d{3}))?\d+)+((?!\2)[.,]\d\d)?$/;

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
            case "Add new Product":
                addProductPrompt();
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
            if(res.length > 0){
                console.log("Products with low inventory: \n")
                printProducts(res);
            }
            else{
                console.log("All products are adequately stocked!");
            }
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

function addProductPrompt(){
    inquirer.prompt([
        {
            name: "name",
            message: "What product are you adding?"
        }, 
        {
            type: "list",
            name: "department",
            message: "What department is the product under?",
            choices: ["Books", "Clothing", "Electronics","Furniture", "Grocery", "Kitchen", "Instruments", "Pet Supplies", "Video Games"]
        },
        {
            name: "price",
            message: "What is the price per unit?",
            validate: function(input){
                if(priceRegex.test(input)){
                    return true;
                }
                else{
                    console.log("\n Please enter a valid price");
                    return false;
                }
            }
        },
        {
            name: "quantity",
            message: "How many are you putting in stock?",
            validate: function(input){
                if(numberRegex.test(input)){
                    return true;
                }
                else{
                    console.log("\n Please enter whole numbers");
                    return false;
                }
            }
        }
    ]).then(function(input){
        var {name, department, price, quantity} = input;
        addNewProduct(name, department, price, quantity);
    })
}

function addNewProduct(name, department, price, quantity){
    connection.query(
        "INSERT INTO products SET ?",
        {
            product_name: name,
            department_name: department,
            price: price,
            stock_quantity: quantity
        },
        function(err, res){
            if(err) throw err;
            console.log("The new product has been added!");
            connection.end();
        }
    )
}