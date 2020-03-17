DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;
USE employee_db;

CREATE TABLE department (
id INTEGER(10) AUTO_INCREMENT NOT NULL,
name VARCHAR (30),
PRIMARY KEY (id)
);

CREATE TABLE roles (
id INTEGER (10) AUTO_INCREMENT NOT NULL,
title VARCHAR(30),
salary DECIMAL,
department_id INTEGER(10),
PRIMARY KEY (id),
FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
id INTEGER(10) AUTO_INCREMENT NOT NULL,
first_name VARCHAR(30),
last_name VARCHAR(30),
role_id INTEGER(10),
manager_id INTEGER(10),
PRIMARY KEY (id),
FOREIGN KEY (role_id) REFERENCES roles(id),
FOREIGN KEY (manager_id) REFERENCES roles(id)
);


select  department.name, roles.department_id
from department
inner join roles on department.id = roles.id;

select roles.title, employee.role_id
from roles
inner join employee on roles.id = employee.role_id;



