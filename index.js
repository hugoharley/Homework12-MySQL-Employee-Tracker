var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');

var connection = mysql.createConnection({
    port: 3306,
    user: "root",
    password: "Aynil42188",
    database: "employee_db"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});

function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Add an employee",
                "View all employees",
                "Update Employee",
                "EXIT"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Add an employee":
                    addEmployee();
                    break;

                case "View all employees":
                    viewEmployees();
                    break;

                case "Update Employee":
                    updateEmployee();
                    break;

                case "EXIT":
                    connection.end();
                    break;
            }
        });
}

function addEmployee() {
    inquirer
        .prompt([
            {
                name: "firtname",
                type: "input",
                message: "What is the employee's First Name?"
            },
            {
                name: "lastname",
                type: "input",
                message: "What is the employee's Last Name?"
            },
            {
                name: "role",
                type: "list",
                message: "What is the employee's Role/Position?",
                choices: [
                    "Accounts Recievable",
                    "Accounts Payable",
                    "Junior Sales Associate",
                    "Senior Sales Associate",
                    "Bookeeper",
                    "Human Resources Associate",
                    "Warehouse Manager",
                    "Warehouse Packer",
                    "Front End Developer",
                    "Database Developer",
                    "Full Stack Developer"
                ]
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firtname,
                    last_name: answer.lastname,
                    role_id: answer.role
                },
                function (err) {
                    if (err) throw (err);
                    console.log("Employee was successfully added!");
                    start();
                }
            );
        });

}

function viewEmployees() {
    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });

}

function updateEmployee() {

}

