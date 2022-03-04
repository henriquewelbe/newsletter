const bodyParser = require('body-parser');
const request = require('request');
const express = require('express');
const https = require('https');
const { response } = require('express');
const secrets = require(__dirname + "/secrets.js")
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

function toTitleCase(str) {
    return str.replace(
      /\w\S*/g,
      function(txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
      }
    );
  }
  
app.get("/", function(req, res){
    res.sendFile(__dirname + '/signup.html');
})

app.post("/", function(req, res){
    const firstName = toTitleCase(req.body.fName);
    const lastName = toTitleCase(req.body.lName)
    const email = req.body.email.toLowerCase();

    var data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    }
    const jsonData = JSON.stringify(data);
    const url =  secrets.url();
    const options = secrets.options();
    const request = https.request(url, options, function(response){
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on('data', function(data){
            const finalData = JSON.parse(data)
        })
    });
    request.write(jsonData);
    request.end();
})

app.post('/failure', function(req, res){
    res.redirect('/');
})

app.listen(process.env.PORT || 3000, function(){
    console.log('Server is running on port 3000');
})