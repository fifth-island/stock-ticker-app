const MongoClient = require('mongodb').MongoClient;
var http = require('http');
const url = "mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/?retryWrites=true&w=majority";


client =new MongoClient(url,{ useUnifiedTopology: true });
http.createServer(async function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html'});
res.write('before mongo connect<br />');
	try {
		await client.connect();
		var dbo = client.db("stock");
		var coll = dbo.collection('equities');
		const options = {
		   projection: { _id: 0, name: 1, ticker: 1 },
		};
		const curs = coll.find({},options);
		// print a message if no documents were found
		if ((await curs.count()) === 0) {
		  console.log("No documents found!");
		}
		//await curs.forEach(console.dir);
		  await curs.forEach(function(item){
			  res.write(item.name + "<br />");
			  console.log(item.name);
		  });
	  }  // end try 
	  catch(err) {
		  console.log("Database error: " + err);
	  }
	  finally {
		client.close();
	  }
	  res.end();
  }  // end create server callback
  ).listen(4000);
