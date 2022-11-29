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
  res.write ("<h1>My Calendar</h1>");
  res.write  ("<html><head><style type='text/css'>.col {display: inline-block; width:40px; border: 1px solid #333;} </style></head>");
  res.write("<body>Calendar for Nov 2022<br />");

  for (i=0; i<m.length; i++) 
	res.write(m[i] + "<br />")
 
 res.end("</body></html>");
}).listen(port);
