var http = require('http');
var qs = require('querystring');

var port = process.env.PORT || 3000;

http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type':'text/html'});
  if (req.url == "/")
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
  
//     res.setHeader('Content-Type', 'text/html');
//   res.write("<h1>Fill this out</h1>");
//   res.write("<form action='/username' method='post'><label> Enter user name: </label>");
//   res.write("<input type='text' name'username'/>");
//   res.write("<input type='submit' value='send' />");
//   res.write("</form>");
  
  
//   res.write(`
//   <!doctype html><html><head><title> Stock Ticker </title></head><body><form action="/username" method="post"><div><labelEnter user name:</label>
//   <input type="text" name="username"/>
//   </div>
//   <input type="submit" value="send" />
//   </div>
//   </form>
//   </body>
//   </html>
//   `);
//    return setHomePage(req, res);
  else if (req.url == '/result' && req.method.toLowerCase() == 'post')
  res.write ("Process the form<br>");
		 pdata = "";
		 req.on('data', data => {
           pdata += data.toString();
			 
			 console.log(pdata);
         });

		// when complete POST data is received
// 		req.on('end', () => {
// 			pdata = qs.parse(pdata);
// 			res.write ("The name is: "+ pdata['type_input']);
// 			res.end();
}).listen(port);


// const http = require('http');

// var port = process.env.PORT || 3000;


// const server = http.createServer((req, res) => {
//  if (req.url == '/') {
//    return setHomePage(req, res);
//  }

//  if (req.url == '/username' && req.method.toLowerCase() == 'post') {
//   return submitUserName(req, res);
//  }
// }).listen(port);

// function submitUserName(req, res) {
//   res.setHeader('Content-Type', 'text/html');
//   res.statusCode = 302;
//   res.setHeader('Location', '/');
//   return res.end();
// }

// function setHomePage(req, res) {
//   res.setHeader('Content-Type', 'text/html');
//   return res.end(`
//   <!doctype html>
//   <html>
//   <head>
//   <title> Stock Ticker </title>
//   </head>
//   <body>
//   <form action="/username" method="post">
//   <div>
//   <labelEnter user name:</label>
//   <input type="text" name="username"/>
//   </div>
//   <input type="submit" value="send" />
//   </div>
//   </form>
//   </body>
//   </html>
//   `);
// }


// var http = require('http');
// var port = process.env.PORT || 3000;
// //var port = 8080;
// http.createServer(function (req, res) {
//   res.writeHead(200, {'Content-Type': 'text/html'});
//   res.write  ("<html><head><title>Welcome to our Stock Ticker</title></head>");
//   res.write("<body><br>Select what type of input you want to use in the search<br>");
//   res.write("<label>Company</label><input type='radio' name='type_input' id='company_name' value='company'><lable>Ticker</lable><input type='radio' name='type_input' id='company_ticker' value='ticker'>");
 
//  res.end("</body></html>");
// }).listen(port);
