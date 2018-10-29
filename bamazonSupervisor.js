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
    supervisorMenu();
});

function ConsoleRow(id, name, cost, sales){
    this.department_id = id;
    this.department_name = name;
    this.over_head_costs = cost;
    this.product_sales = sales;
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
            connection.end();
        }
    )
}