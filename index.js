var mysql = require("mysql");
var inquirer = require("inquirer");
var cTable = require('console.table');
require('dotenv').config()

var connection = mysql.createConnection({
    port: 3306,
    user: "root",
    password: process.env.DB_PASS,
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
                "Delete Employee",
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

                case "Delete Employee":
                    deleteEmployee();
                    break;

                case "EXIT":
                    connection.end();
                    break;
            }
        });
}

addEmployee = async () => {
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
                type: "list",
                message: "What is the employee's Role/Position?",
                choices: await roleQuery(),
                name: "role"
            }
        ])
        .then(async (answer) => {
            const roleId = await roleIdQuery(answer.role);
            connection.query(
                "INSERT INTO employee SET ?",
                {
                    first_name: answer.firtname,
                    last_name: answer.lastname,
                    role_id: roleId
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
    connection.query('SELECT e.id, CONCAT(e.first_name, " ", e.last_name) AS employee, roles.title, department.name AS department, salary, CONCAT(m.first_name, " ", m.last_name) AS manager FROM employee e INNER JOIN roles ON e.role_id=roles.id INNER JOIN department on roles.department_id=department.id LEFT JOIN employee m ON m.id = e.manager_id', function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });

}

deleteEmployee = async () => {
    inquirer
        .prompt({
            type: "list",
            message: "Please select the employee to delete: ",
            choices: await empQuery(),
            name: "employee"
        }).then(async answer => {
            console.log("Deleting selected employee...\n");
            const employeeId = await empIdQuery(answer.employee);
            const query = connection.query("DELETE FROM employee WHERE id=?", [employeeId], (err, res) => {
                if (err) throw err;
                console.log(res.affectedRows + " employee deleted!\n");
                start();
            });
            console.log(query.sql);
            console.log("-------------------------------------------------------------------------------------");
        });
};

roleQuery = () => {
    return new Promise((resolve, reject) => {
        const roleArr = [];
        connection.query("SELECT * FROM roles", (err, res) => {
            if (err) throw err;
            res.forEach(role => {
                roleArr.push(role.title);
                return err ? reject(err) : resolve(roleArr);
            });
        });
    });
};

roleIdQuery = role => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM roles WHERE title=?", [role], async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
        });
    });
};
empQuery = () => {
    return new Promise((resolve, reject) => {
        const employeeArr = [];
        connection.query("SELECT * FROM employee", (err, res) => {
            if (err) throw err;
            res.forEach(employee => {
                let fullName = employee.first_name + " " + employee.last_name;
                employeeArr.push(fullName);
                return err ? reject(err) : resolve(employeeArr);
            });
        });
    });
};

empIdQuery = (employee) => {
    return new Promise((resolve, reject) => {
        connection.query("SELECT * FROM employee WHERE CONCAT(first_name, ' ', last_name)=?", [employee], async (err, res) => {
            if (err) throw err;
            return err ? reject(err) : resolve(res[0].id);
        });
    });
};
/*[
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
               ]*/