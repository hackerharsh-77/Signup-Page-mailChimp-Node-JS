const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { response } = require("express");
const { redirect } = require("express/lib/response");
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.send("hello world");
});

app.get('/signup',function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post('/signup',function(req,res){
    var firstName = req.body.fname;
    var lastName = req.body.lname;
    var email = req.body.email;

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }    
            }
        ]
    };

    var jsonData = JSON.stringify(data);

    var options = {
        url:"https://us14.api.mailchimp.com/3.0/lists/#listid",
        method:"POST",
        headers: {
            "Authorization": "harsh api_key"
        },
        body: jsonData,
        

    };
    request(options, function(error,response,body){
        if(response.statusCode === 200)
        {
            res.sendFile(__dirname + '/success.html');
            console.log(response.statusCode);
        }
        else{
            res.sendFile(__dirname + '/failure.html');
        }
        // if(error) {
        //     console.log(error);
        // }
        // else{
        //     console.log(response.statusCode);
        // }
    });
});

app.post('/failure',function(req,res){
    res.redirect("/");
});

app.listen(process.env.PORT || 3000,console.log("listening on port 3000"));

