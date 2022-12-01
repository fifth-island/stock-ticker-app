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

            var type = pdata['type_input'];
            var target = pdata['user_input'];
            console.log(`User put in ${target} for ${type}.`);

           
            // connectAndDisplay(target, type, res);
        });
    } 
    else { 
        fs.readFile(filePath, function(err, content) {
            if (err) { 
                // display404Page(err, res);
            }
            else { 
             // displayCurrentContent(content, contentType, res); 
            }
        });
    }
});
