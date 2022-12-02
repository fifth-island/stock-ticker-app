var http = require('http');
var qs = require('querystring');

// var {MongoClient} = require("mongodb");
// var url = 'mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/test';
// var client = new MongoClient(url);

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/?retryWrites=true&w=majority";

client = new MongoClient(url,{ useUnifiedTopology: true });


var port = process.env.PORT || 3000;

http.createServer(async function (req, res) {
  res.writeHead(200, {'Content-Type':'text/html'});
  if (req.url == "/") {
	res.write(`
		<h1>Hi! This is the home page</h1>
		<form action="/result" target="_blank" method="POST">
		<h2> Welcome to our Stock Ticker. </h2>

		<p> Select what type of input you want to use in the search </p>

		<label>Company</label>
		<input type='radio' name='type_input' id="company_name" value="company">

		<label>Ticker</label>
		<input type='radio' name='type_input' id="company_ticker" value="ticker">

		<p> Now, provide a word to check in our database </p>

		<label> Search for keyword: </label>
		<input type='text' name='user_input'>


		<input type='submit' name='form_ticker' value='Submit'>
	`);
	res.end();			
   
  } else if (req.url == '/result') {
	res.write ("Process the form<br>");
	

	pdata = "";
	req.on('data', data => {
		pdata += data.toString();
	});

	// when complete POST data is received
	req.on('end', () => {
		pdata = qs.parse(pdata);
		res.write ("The type chosen is: " + pdata['type_input'] + "<br>");
		res.write ("The name is: " + pdata['user_input']);
		res.end();
	});
	  
	try {
// 	 client.connect();
		await client.connect();
		var database = client.db("stock");
    		var equities = database.collection("equities");
		
		const options = {
			_id = 0;
			name: 1;
			ticker: 1;
		};
		
// 		const curs = equities.find({}, options);
		
// 		if ((curs.count()) === 0) {
// 			console.log("No documents found!");
// 			res.write("No documents found!");
// 		}
		
// 		await curs.forEach(function(item) {
// 			if(pdata['type_input'] == 'company') {
// 			if(item.Company == pdata['user_input']) {
// 				let str = JSON.stringfy(item);
// 				let string1 = str.replace(/["]+/g, '');
// 				let string2 = string1.replace(/[{}]/g, "");
// 				let string3 = string2.replace(/,/g, '  ');
// 				res.write(string3 + "<br>");
// 				console.log(item);
// 			}
// 			}
// 		});
		
// 	 var dbo = client.db("stock");
//          var coll = dbo.collection('equities');
		res.write("checkpoint 0");
	}
	catch (err) {
	 res.write("Error found");
	}
	finally {
		client.close();
	}
  }
}).listen(port);

// async function connect() {
//     await client.connect();
//     await client.db("stock").command({ping: 1});
//     console.log("Server Connected Successfully");
// }
