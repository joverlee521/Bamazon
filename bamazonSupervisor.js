const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

var priceRegex = /^[\d\.,]+$/;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function(err){
    if(err) throw err;
    supervisorMenu();
});

function ConsoleRow(id, name, cost, sales){
    this.department_id = id;
    this.department_name = name;
    this.over_head_costs = cost;
    this.product_sales = sales;
    this.total_profit = sales - cost;
}

function supervisorMenu(){
    inquirer.prompt([
        {
            type: "list",
            name: "command",
            message: "Please choose a command: ",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(input){
        if(input.command == "View Product Sales by Department"){
            viewSales();
        }
        else{
            createPrompt();
        }
    })
}

function viewSales(){
    var table = [];
    connection.query(
        "SELECT departments.department_id, departments.department_name, departments.over_head_costs, COALESCE(SUM(products.product_sales), 0) FROM departments LEFT JOIN products ON products.department_name = departments.department_name GROUP BY department_id ORDER BY department_id ASC",
        function(err, res){
            if(err) throw err;
            for(var i = 0; i < res.length; i++){
                var newRow = new ConsoleRow(res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i]["COALESCE(SUM(products.product_sales), 0)"]);
                table.push(newRow);
            }
            console.table(table);
            restartPrompt();
        }
    )
}

function createPrompt(){
    inquirer.prompt([
        {
            name: "name",
            message: "What's the new department name?"
        },
        {
            name: "cost",
            message: "How much is the over head cost?",
            validate: function(input){
                if(priceRegex.test(input)){
                    return true;
                }
                else{
                    console.log("\n Please enter a valid cost!");
                    return false;
                }
            }
        }
    ]).then(function(input){
        var {name, cost} = input;
        createDepartment(name, cost);
    })
}

function createDepartment(name, cost){
    connection.query(
        "INSERT INTO departments SET ?",
        {
            department_name: name,
            over_head_costs: cost
        },
        function(err, res){
            if(err) throw err;
            console.log("New department has been created!");
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
            supervisorMenu();
        }
        else{
            console.log("Have a nice day!")
            connection.end();
        }
    })
}