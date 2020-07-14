var mysql = require("mysql");
var inquirer = require("inquirer");
var consTable = require("console.table");
const connection = require("./connection");


function runQ() {
  inquirer
    .prompt({
      name: "choice",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add a Role",
        "Add an Employee",
        "View Department",
        "View Role",
        "View Employee",
        "Update Employee Role",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.choice) {
        case "Add Department":
          // artistSearch();
          break;

        case "Add a Role":
          addRole();
          break;

        case "Add an Employee":
          addEmployee();
          break;

        case "View Department":
          viewDepartment();
          break;

        case "View Role":
          viewRoles();
          break;

        case "View Employee":
          viewEmployee();
          break;

        // case "Update Department":
        //   artistSearch();
        //   break;

        case "Update Employee Role":
          updateRole();
          break;

        // case "Update an Employee":
        //   rangeSearch();
        //   break;
        default:
          quit();
      }
    });
}

function viewEmployee() {
  connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON manager.id = employee.manager_id", function (err, res) {
    if (err) throw err;
    console.table(res);
    runQ();
  })
}

function viewDepartment() {
  connection.query("SELECT d.name From department d", function (err, res) {
    if (err) throw err;
    console.table(res);
    runQ();
  })
}

function viewRoles() {
  connection.query("SELECT role.title From role", function (err, res) {
    if (err) throw err;
    console.table(res);
    runQ();
  })
}

function findAllEmployees() {
  return connection.query("SELECT * FROM employee")
}

function findAllRoles() {
  return connection.query("SELECT * FROM role")
}

function findAllManagers() {
  return connection.query("SELECT * FROM employee WHERE manager_id IS NOT NULL")
}

function findAllDepartments() {
  return connection.query("SELECT * FROM department")
}

async function addRole() {
  const deptList = await findAllDepartments();
  const deptChoices = deptList.map(({id, name}) => ({
    name: name,
    value: id
  }));

  const {title, salary} = await inquirer.prompt([{
    name: "title",
    message: "What is the title of the new role"
  },
  {
    name: "salary",
    message: "What is the salary of the new role"
  },
  ])
  const {department_id} = await inquirer.prompt({
    name: "department_id",
    message: "What department does this role belong to",
    type: "list",
    choices: deptChoices
  })

  var queryStr = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
  connection.query(queryStr, [title, salary, department_id], function (err, res) {
      if (err) throw err;
      console.table(res);
      runQ();
    });
}

async function addEmployee() {
  const roleList = await findAllRoles();
  const roleChoices = roleList.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const managerList = await findAllManagers();
  const managerChoices = managerList.map(({ id, first_name}) => ({
    name: first_name,
    value: id
  }));

  const {first_name, last_name} = await inquirer.prompt([{
    name: "first_name",
    message: "whats the first name"
  },
  {
    name: "last_name",
    message: "what is the last name"
  },
  ])
  const {role_id} = await inquirer.prompt({
    name: "role_id",
    message: "what is the users role",
    type: "list",
    choices: roleChoices
  })
  const {manager_id} = await inquirer.prompt({
    name: "manager_id",
    message: "Who is the employees manager?",
    type: "list",
    choices: managerChoices
  })

  var queryStr = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  connection.query(queryStr, [first_name, last_name, role_id, manager_id], function (err, res) {
      if (err) throw err;
      console.table(res);
      runQ();
    });
}

async function updateRole() {
  const employeeList = await findAllEmployees();
  const employeeChoices = employeeList.map(({ id, first_name}) => ({
    name: first_name,
    value: id
  }));
  
  const {employee} = await inquirer.prompt({
    name: "employee",
    message: "Which employee's role would you like to update?",
    type: "list",
    choices: employeeChoices
  })

  const roleList = await findAllRoles();
  const roleChoices = roleList.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const {role_id} = await inquirer.prompt({
    name: "role_id",
    message: "what is the users role",
    type: "list",
    choices: roleChoices
  })
;
  const queryStr = `UPDATE employee SET role_id = ? WHERE id = ?`
  connection.query(queryStr, [role_id, employee], function (err, res) {
      if (err) throw err;
      console.log("Successfully updated employee's role!");
      runQ();
    });
    
    //look into merge statement

}
runQ();
const quit = () => {process.exit()};