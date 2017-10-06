var mysql = require('mysql');
var inq = require('inquirer');
require('console.table');

var connection = mysql.createConnection({
	host: "127.0.0.1",
	port: 3306,

	user:"root",

	password: "",
	database: "bamazon"
});

function validNum(n){
	//simple number input validation function
  if (isNaN(n) === false && Number.isInteger(parseInt(n))) {
    return true;
  }
  return false;           
}

function productDisp(n){
	//displays table of product information for consumer
	connection.query('select product_name, department_name, price, stock_quantity from products', function(err, res, fields){
		console.table(res);
		n();
	});
}

function initMenu(){
	//display products and then prompt user for purchase
	new Promise ((resolve, reject) =>{
		productDisp(resolve);
	}).then(
		function(resolve){
			inq.prompt([{name:"prod", message: "What do you want to buy?"}, {type: "input", name:"quant", message:"How many would you like to buy?", validate: validNum}]).then(
				function (answers) {
					// console.log(answers);
					connection.query('select * from products where product_name = "' + answers.prod + '"', function (err, res, fields){
						if (err) console.log("query err" + err);
						if (parseInt(answers.quant) > res[0].stock_quantity){
							console.log("Not enough in stock to satisfy order!");
							initMenu();
						} else { 
							connection.query('UPDATE products SET stock_quantity = ' + parseInt(res[0].stock_quantity - answers.quant) + ', product_sales = ' + (answers.quant * res[0].price) + ' WHERE product_name = "' + answers.prod + '"', function (err){
								if (err){
								console.log("UPDATE error: " + err);
								}
								initMenu();
							});
						}
					});
			});
		});
}


initMenu();

module.exports = {
	disp: productDisp,
	validNum: validNum
}
