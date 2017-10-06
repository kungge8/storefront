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

function lowInv(n){
	connection.query("SELECT product_name from products WHERE stock_quantity < 5", function (err, res, fields){
		if (err) console.log(+"lowInv query ERROR: " + err);
		console.log(res.reduce(function(a,n){
			return a + n.product_name + "\n";
		},""));
		n();
	});
}

function addInv(n){
	connection.query("SELECT product_name, stock_quantity FROM products", function(err, res){
		let z = res.map(function(n){
			return n.product_name;
		});

		inq.prompt([{type: "list", message: "What item would you like to add more of?", choices: z, name: "c"},{type: "input", message: "How many are you adding?", name: "quant", validate: basics.validNum}]).then(
			function(ans){
				connection.query("UPDATE products SET stock_quantity = " + (res.filter((n)=>{if (n.product_name === ans.c) return n;})[0].stock_quantity + parseInt(ans.quant)) + " WHERE product_name = '" + ans.c + "';", (err)=>{
					if (err) console.log("Add INV UPDATE err: " + err);
					n();
				});
			}
		);
	});
}

function newProd(n){
	inq.prompt([{
		type: "input",
		name: "name",
		message: "What is the product name?"
	},{
		type: "input",
		name: "dept",
		message: "What department is it in?"
	},{
		type: "input",
		name: "quant",
		message:"How many are you adding to stock?",
		validate: basics.validNum
	},{
		type: "input",
		name: "price",
		message:"What is the price per unit?",
		validate: basics.validNum
	}]).then(
		function (ans){
			connection.query("INSERT INTO products (product_name, department_name, stock_quantity, price) VALUES ('" + ans.name + "','" + ans.dept + "','" + ans.quant + "','" + ans.price + "');", (err) => {
					if (err) console.log("newProd Query ERROR: " +  err);
					console.log("New product added!");
					n();
				}
			);
		}
	);		
}

function mngMenu (){
	inq.prompt({type: "list", choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add new product", "Exit"], name: "menu", message: "What would you like to do?"}).then(
			function(ans){
				switch (ans.menu){
					case "View Products":
						new Promise (function(res, rej){
							basics.disp(res);
						}).then(
							function (r){
								mngMenu();
							}
						);
						break;
					case "View Low Inventory":
						new Promise(function(res, rej){
							lowInv(res);
						}).then(
							function(){
								mngMenu();
							}
						);
						break;
					case "Add to Inventory":
						new Promise(function(res, rej){
							addInv(res);
						}).then(
							function(){
								mngMenu();
							}
						);
						break;
					case "Add new product":
						new Promise(function(res, rej){
							newProd(res);
						}).then(
							function(){
								mngMenu();
							}
						);
						break;
					case "Exit":
						break;
				}
			}
		);
}

mngMenu();