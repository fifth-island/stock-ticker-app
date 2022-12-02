var http = require('http');
var qs = require('querystring');


const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/?retryWrites=true&w=majority";



var port = process.env.PORT || 3000;

var user_value = "";
var type_value = "";

http.createServer(function (req, res) {
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
		type_value = pdata['type_input'];
		res.write ("The name is: " + pdata['user_input']);
		user_value = pdata['user_input'];

  connectAndDisplay(user_value, type_value, res);
		
	});
	  
	res.end();

  }
}).listen(port);


/* connectAndDisplay
* Query the database and display information requested
*/
async function connectAndDisplay(target, type, res) {
 var t = "";

 MongoClient.connect(url, {useUnifiedTopology: true}, async (err, database) => {
     if (err) {
         console.log("Connection to Mongo err: " + err);
         return;
     }

     // get database and collection object
     var dbo = database.db("stock");
     var collection = dbo.collection('equities');

     try {
         theQuery = "";
         queryOptions = "";
         if (type == "company") {
             theQuery = {name: target};
             queryOptions = {sort:{name:1}, projection:{_id:0, name:1, ticker:1}};
             t += `<h2>Company: ${target} has ticker: </h2><br>`;
         } else if (type == "ticker") {
             theQuery = {ticker: target};
             queryOptions = {sort:{name:1}, projection:{_id:0, name:1, ticker:1}};
             t += `<h2>Companies with ticker code ${target} are: </h2><br>`;
         }

         var result = await collection.find(theQuery, queryOptions).toArray();
         // console.log(result);

         if (result.length === 0) {
             console.log(`No results found`);
             t += `No results found.`;
         } else {
             result.forEach(function (curr) {
                 console.log(`${curr.name} has ticker ${curr.ticker}`);
                 t += `${curr.name} (${curr.ticker})<br>`;
             });
         }
     }

     finally {
         // console.log(`Writing Result and Closing DB`);
         res.end(t);
         database.close();
     }
 });
}
