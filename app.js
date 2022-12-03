const MongoClient = require('mongodb').MongoClient;
var http = require('http');
const url = "mongodb+srv://dbUser1:mypw;@cluster0.rjmq5.mongodb.net/?retryWrites=true&w=majority";


client =new MongoClient(url,{ useUnifiedTopology: true });
http.createServer(async function (req, res) {
res.writeHead(200, {'Content-Type': 'text/html'});
res.write('before mongo connect<br />');
	try {
		await client.connect();
		var dbo = client.db("library");
		var coll = dbo.collection('books');
		const options = {
		   sort: { author: 1 },
		   projection: { _id: 0, title: 1, author: 1 },
		};
		const curs = coll.find({},options);
		// print a message if no documents were found
		if ((await curs.count()) === 0) {
		  console.log("No documents found!");
		}
		//await curs.forEach(console.dir);
		  await curs.forEach(function(item){
			  res.write(item.title + "<br />");
			  console.log(item.title);
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
  ).listen(8080);
