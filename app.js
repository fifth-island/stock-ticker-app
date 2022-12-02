const http = require('http');

var port = process.env.PORT || 3000;


const server = http.createServer((req, res) => {
 if (req.url == '/') {
   return setHomePage(req, res);
 }

 if (req.url == '/username' && req.method.toLowerCase() == 'post') {
  return submitUserName(req, res);
 }
}).listen(port);

function submitUserName(req, res) {
  res.setHeader('Content-Type', 'text/html');
  res.statusCode = 302;
  res.setHeader('Location', '/');
  return res.end();
}

function setHomePage(req, res) {
  res.setHeader('Content-Type', 'text/html');
  return res.end(`
  <!doctype html>
  <html>
  <head>
  <title> Stock Ticker </title>
  </head>
  <body>
  <form action="/username" method="post">
  <div>
  <labelEnter user name:</label>
  <input type="text" name="username"/>
  </div>
  <input type="submit" value="send" />
  </div>
  </form>
  </body>
  </html>
  `);
}


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
