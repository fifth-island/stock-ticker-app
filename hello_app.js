c = require("calendar");
cal = new c.Calendar();               
m = cal.monthDates(2022,11, 
   		function(d) {
			return (' '+d.getDate()).slice(-2)
	}, 
   	function(w) {return w.join(' | ')}
);
console.log ("Calendar for Nov, 2022");
for (i=0; i<m.length; i++) console.log(m[i]);
