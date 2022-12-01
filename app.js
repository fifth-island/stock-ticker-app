

/*
 * StockTickerExecute.js
 * (Part 2.3)
 * 
 * Display's user's requested information.
 * 
 * Author: Amy Bui
 * Comp20
 * Spring 2021
 */

var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');
var qs = require('querystring');
const MongoClient = require('mongodb').MongoClient;

// connection string
const mongoUrl = 'mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/test';


const server = http.createServer((req, res) => {
    // create filepath for any page
    var filePath = path.join(
        __dirname,
        'public',
        req.url === '/' ? 'index.html' : req.url
    );
    // console.log(filePath);

    // Ensure correct content type is picked
    var contentType = getContType(filePath);
    // console.log(contentType);

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

            var type = pdata['type_imput'];
            var target = pdata['user_input'];
            console.log(`User put in ${target} for ${type}.`);

            connectAndDisplay(target, type, res);
        });
    } 
    else { 
        fs.readFile(filePath, function(err, content) {
            if (err) { 
                display404Page(err, res);
            }
            else { displayCurrentContent(content, contentType, res); }
        });
    }
});

// the port in a variable using environment variable;
const port = process.env.PORT || 8080;
server.listen(port, () => console.log(`Server running on port ${port}`));

/* getContType
 * Returns the string for Content-Type given a files path.
 * Limited to the cases shown below. Default will be html.
 */
function getContType(filePath) {
    var ext = path.extname(filePath);
    switch(ext) {
        case '.html':
            return 'text/html';
        case '.js':
            return 'text/javascript';
        case '.css':
            return 'text/css';
        default:
            return 'text/html';
    }
}

/* display404Page
 * displays error page when user attempts to view non page on server
 */
function display404Page(err, res) {
    if (err.code == 'ENOENT') { 
        // Display 404 page
        fs.readFile(path.join(__dirname, 'public', '404.html'), 
                (err, content) => {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                });
    }
}

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

    MongoClient.connect(mongoUrl, {useUnifiedTopology: true}, async (err, database) => {
        if (err) {
            console.log("Connection to Mongo err: " + err);
            return;
        }

        // get database and collection object
        var dbo = database.db("stock");
        var collection = dbo.collection('equities');

        try {
            theQuery = "";
            queryOptions = "";
            if (type == "company") {
                theQuery = {name: target};
                queryOptions = {sort:{name:1}, projection:{_id:0, name:1, ticker:1}};
                t += `<h2>Company: ${target} has ticker: </h2><br>`;
            } else if (type == "ticker") {
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
