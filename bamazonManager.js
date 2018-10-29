const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var numberRegex = /^\d+$/;
var priceRegex = /^[\d\.,]+$/;
var departmentNames = [];
var array = ["1","2","3","4","5","6","7","8","9","10","11"];

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
                listDepartments();
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
            restartPrompt();
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
            restartPrompt();
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
                    restartPrompt();
                }
            )
        }
    )
}

function listDepartments(){
    departmentNames = [];
    connection.query(
        "SELECT department_name FROM departments",
        function(err, res){
            if(err) throw err;
            for(var i = 0; i < res.length; i ++){
                var department = res[i].department_name;
                departmentNames.push(department);
            }
            addProductPrompt();
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
            choices: departmentNames
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
            restartPrompt();
        }
    )
}

function restartPrompt(){
    inquirer.prompt([
        {
            type: "confirm",
            name: "confirm",
            message: "Would you like to use another command?",
            default: true
        }
    ]).then(function(input){
        if(input.confirm){
            menuOptions();
        }
        else{
            console.log("Goodbye!");
            connection.end();
        }
    })
}