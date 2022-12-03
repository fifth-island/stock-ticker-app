var http = require('http');
var qs = require('querystring');


const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/?retryWrites=true&w=majority";

const client =new MongoClient(url,{ useUnifiedTopology: true });


var port = process.env.PORT || 3000;

var user_value = "";
var type_value = "";

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
		type_value = pdata['type_input'];
		res.write ("The name is: " + pdata['user_input']);
		user_value = pdata['user_input'];
		
		pro = clicker(req);
		
		pro.then(
		    (value) => {
			hold = value;
			console.log(hold);
			console.log('after pressing submit ......');
			res.write('<p>Results are the following: </p>');
			value.forEach(element => {
			    res.write('<p>Company name: ' + element.name + ' Stock Ticker: ' + element.ticker + '</p>');
			    console.log("Checking foreach");
			    console.log(element.name);
			    console.log(element.ticker);
			});
		    },
		    (error) => {
			console.log(error);
		    }
		)
		hold.forEach(element => {
		    res.write(element.name + ', ' +  element.ticker);
		})
		
		// res.end();

	});

//         await connect_table();
	  

  }
}).listen(port);

async function connect_table() {
 try {
  res.write("Checkpoint 0");
 
  await client.connect();
  var dbo = client.db("stock");
  
  res.write("Checkpoint 1");
  var collection = dbo.collection("equities");
  const options = {
   projection: { _id: 0, name: 1, ticker: 1 },
  };
  
  res.write("Checkpoint 2");

  const curs = await collection.find({}, options);

  if ((curs.count()) === 0 ) {
   res.write("No documents found!");
  }

  await curs.forEach(function(item){
   if(type_value == 'company') {
    res.write("Your type_value is equal company");
   }


  });


 } catch (err) {
	 res.write("Error found");
	}
	finally {
		client.close();
	}



}


//querys database aganist the users input and returns result
async function clicker(req) {
 const module = require('./search');//get functions in module.export from search.js
 const adr = require('url');
 var obj = adr.parse(req.url, true).query;//geting the query string
 // console.log('inside function');
 var promise;

 if (type_value === 'company') {//user puts in a company name
     // console.log('querying company name: ' + obj.search_bar);
     promise = await module.mongoinsert(capitalize(user_value), '');
 } else if (type_value === 'ticker') {//user puts in a stock ticker
     // console.log('querying stock ticker: ' + obj.search_bar);
     var tick = obj.search_bar.toUpperCase();//make the user stock ticker all uppercase
     promise = await module.mongoinsert('', tick);
 }
 return promise;
} 

//capitalizes the first character of the company name before querying database
function capitalize(word){
 return word.charAt(0).toUpperCase() + word.slice(1);

}
