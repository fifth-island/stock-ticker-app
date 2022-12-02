var http = require('http');
var qs = require('querystring');

var port = process.env.PORT || 3000;

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
   
  } else if (req.url == '/result') {
	  res.write ("Process the form<br>");
			 res.write ("Process the form<br>");
			 pdata = "";
			 req.on('data', data => {
		   pdata += data.toString();
		 });

			// when complete POST data is received
			req.on('end', () => {
				pdata = qs.parse(pdata);
				res.write ("The name is: "+ pdata['user_input']);
// 				res.end();
			});
  }
	res.end();
}).listen(port);


