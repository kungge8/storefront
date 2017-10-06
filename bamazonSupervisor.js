var mysql = require('mysql');
var inq = require('inquirer');
var basics = require('./bamazonCustomer.js');
require('console.table');

var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 3306,

	user:"root",

	password: "",
	database: "bamazon"
});

function writeTable(n){
	//display table in console of information relevant to supervisor
	connection.query("select departments.department_id, departments.department_name, departments.over_head_costs, sum(products.product_sales) as product_sales, sum(products.product_sales) - departments.over_head_costs AS total_profit from departments left join products on departments.department_name = products.department_name group by department_name order by department_id ASC;", function(err, res, fields){
		if (err) console.log("writeTable ERROR: " + err);
		console.table(res);
		n();
	});
}

function newDept(n){
	//prompt user for name and cost of new department and write it to DB
	inq.prompt([{
		type: "input",
		name: "deptName",
		message: "What is the name of the new department?"
	},{
		type: "input",
		name: "overhead",
		message: "What is the overhead cost of the new department?",
		validate: basics.validNum
	}]).then(
		function(ans){
			connection.query("INSERT INTO departments (department_name, over_head_costs) VALUES ('" + ans.deptName + "','" + ans.overhead + "');", function(err) {
					if (err) console.log("NEWDEPT ERR: " + err);
					n();
			});
		}
	);
}

function superMenu(){
	inq.prompt({
		type: "list",
		name: "choice",
		message: "What would you like to do?",
		choices: ["View product sales by department", "Create new department", "Exit"]
	}).then(
		function (ans){
			switch(ans.choice){
				case "View product sales by department":
					new Promise(function(res,rej){
						writeTable(res);
					}).then(
						function (){
							superMenu();
						}
					)
					break;
				case "Create new department":
					new Promise(function(res,rej){
						newDept(res);
					}).then(
						function (){
							superMenu();
						}
					)
					break;
				case "Exit":
					break;
			}
		}
	);
}

superMenu();
