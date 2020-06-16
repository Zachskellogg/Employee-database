var mysql = require("mysql");
var inquirer = require("inquirer");
var consTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  runQ();
});

function runQ() {
  inquirer
    .prompt({
      name: "anything",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "Add Department",
        "Add a Role",
        "Add an Employee",
        "View Department",
        "View Role",
        "View Employee",
        "Update Employee Role"
      ]
    })
    .then(function(answer) {
      console.log(answer);
      switch (answer.anything) {
      case "Add Department":
        // artistSearch();
        break;

      case "Add a Role":
        // multiSearch();
        break;

      case "Add an Employee":
        addEmployee();
        break;

      case "View Department":
        // artistSeasrch();
        break;

      case "View a Role":
        // multiSearch();
        break;

      case "View Employee":
        viewEmployee();
        break;

      // case "Update Department":
      //   artistSearch();
      //   break;

      case "Update a Role":
        // multiSearch();
        break;

      // case "Update an Employee":
      //   rangeSearch();
      //   break;
      }
    });
}

function viewEmployee() {
  connection.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err;
    console.table(res);
    runQ();
  })
}

async function addEmployee() {
  // await Add questions
  var queryStr = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;
  connection.query(queryStr, ["Zach", "Kellogg", 3, 4], function (err, res) {
      if (err) throw err;
      console.table(res);
    });
}