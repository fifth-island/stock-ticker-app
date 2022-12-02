var http = require('http');
var qs = require('querystring');

// var {MongoClient} = require("mongodb");
// var url = 'mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/test';
// var client = new MongoClient(url);

// const MongoClient = require('mongodb').MongoClient;
// const url = "mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/?retryWrites=true&w=majority";

// client = new MongoClient(url,{ useUnifiedTopology: true });

 const MongoClient = require('mongodb').MongoClient;
 var MongoUrl = 'mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/?retryWrites=true&w=majority';

 


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
	
//         try {
// 	 client.connect();
// 	 var dbo = client.db("stock");
//          var coll = dbo.collection('equities');
// 		res.write("checkpoint 0");
// 	}
// 	catch (err) {
// 	 res.write("Error found");
// 	}
// 	finally {
// 		client.close();
// 	}
	  
	MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, (err, database) => {
	    if (err) {
		console.log("Unsuccessful connection to Mongo err: " + err);
		return;
	    }
	    
            var dbs_stock = database.db('stock');
   	    var mongo_collection = dbs_stock.collection('equities');
		
        });
	 


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
  }
}).listen(port);

// function connect() {
//     client.connect();
//     client.db("stock").command({ping: 1});
//     console.log("Server Connected Successfully");
// }
