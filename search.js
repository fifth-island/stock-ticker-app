const fs = require('fs');
const { mainModule } = require('process');
const readline = require('readline');
var url = "mongodb+srv://fifth_island:comp20@cluster0.wqsv4y9.mongodb.net/?retryWrites=true&w=majority";
const MongoClient = require('mongodb').MongoClient;




async function mongoinsert(c_name, tick) {
    try {
        const client = await MongoClient.connect(url, {useUnifiedTopology: true})
        .catch( err => {console.log(err.stack);
        console.log(err.name); console.log(err.message); });
        if(!client) {
            console.log("no client");
            return;
        }
        const dbo = await client.db('stock');
        const collections =  await dbo.collection('equities');
        options = { projection: { _id: 0, name: 1, ticker: 1 }};//removing the id # from the find() response
        var answer;

        if(c_name !== "" && tick === ""){//want to find company with company name
            findname = { name: c_name };
            answer  = await collections.find(findname, options).toArray();
            //returns the only response from the query 
        }else if(c_name === "" && tick !== ""){//want to find company with ticker
            findtick = {ticker: tick};
            answer = await collections.find(findtick, options).toArray();//getting the response from databse 

        }
        client.close();//closes the connection to the database
        return answer;//returns a promise that contains the response of find query. 

    }
    catch(err){
        console.log('Database error:' + err);
    }

}

module.exports = {mongoinsert};
