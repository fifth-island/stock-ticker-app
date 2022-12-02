c = require("calendar");
var http = require('http');
cal = new c.Calendar();      
var port = process.env.PORT || 3000;
//var port = 8080;
m = cal.monthDates(2022,11, function(d) {
		return (' '+d.getDate()).slice(-2)}, 
		function(w) {
		   s = "";
		   for (j=0; j<w.length; j++)
		   	  s += "<div  class='col'>" + w[j] + "</div>";
		   return s;
		}
);
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write  ("<html><head><title>Welcome to our Stock Ticker</title></head>");
  res.write("<body><br>Select what type of input you want to use in the search<br>");
  res.write("<label>Company</label><input type='radio' name='type_input' id='company_name' value='company'><lable>Ticker</lable><input type='radio' name='type_input' id='company_ticker' value='ticker'>");
 
 res.end("</body></html>");
}).listen(port);
