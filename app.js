/* modules to the CVS importation */
const MongoClient = require('mongodb').MongoClient;
const cvsParser = require('csv-parser');
const ReadLine = require('readLine');
const fs = require('fs');
const qs = require('querystring');
const path = require('path');
const http = require('http');

/* MongoDB connection string */
var MongoUrl = 'mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/test';

const server = http.createServer((req, res) => {
 // create filepath for any page
 var filePath = path.join(
     __dirname,
     'public',
     req.url === '/' ? 'index.html' : req.url
 );

 // Ensure correct content type is picked
 var contentType = getContType(filePath);

 if (req.url == '/result') {
     res.writeHead(200, {'Content-Type': 'text/html'}); 
     // res.write ("Process the POST request<br>"); 
     pdata = ""; 
     req.on('data', data => {
         pdata += data.toString();
         // res.write(pdata);
     })
     .on('end', () => {
         pdata = qs.parse(pdata);

         var type = pdata['type_input'];
         var target = pdata['user_input'];
         console.log(`User put in ${target} for ${type}.`);

         connectAndDisplay(target, type, res);
     });
 } 
 else { 
     fs.readFile(filePath, function(err, content) {
         if (err) { 
             // display404Page(err, res);
         }
         else { displayCurrentContent(content, contentType, res); }
     });
 }
});

/* displayCurrentContent
 * Takes the response from server and displays content.
 */
function displayCurrentContent(content, contentType, res) {
 res.writeHead(200, { 'Content-Type': contentType });
 res.end(content, 'utf8');
}


/* connectAndDisplay
 * Query the database and display information requested
 */
async function connectAndDisplay(target, type, res) {
 var t = "";

 MongoClient.connect(MongoUrl, {useUnifiedTopology: true}, async (err, database) => {
     if (err) {
         console.log("Connection to Mongo err: " + err);
         return;
     }

     // get database and collection object
     var dbo = database.db('stock');
     var collection = dbo.collection('equities');

     try {
         theQuery = "";
         queryOptions = "";
         if (type == 'company') {
             theQuery = {name: target};
             queryOptions = {sort:{name:1}, projection:{_id:0, name:1, ticker:1}};
             t += `<h2>Company: ${target} has ticker: </h2><br>`;
         } else if (type == 'ticker') {
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
