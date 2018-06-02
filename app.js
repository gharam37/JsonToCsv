/*
  Aman Kharbanda
  Subscribe my channel for more videos
  https://goo.gl/H91NRo
  Thanks!
*/

const express = require('express');
var app = express();
var upload = require('express-fileupload');
var bodyParser = require('body-parser')
const http = require('http');
http.Server(app).listen(80); // make server listen on port 80
var success='No'

app.use(upload()); // configure middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false })
console.log("Server Started at port 80");

app.get('/',function(req,res){
  res.sendFile(__dirname+'/index.html');

})
app.post('/',urlencodedParser,function(req,res){
   var JsonData = JSON.parse(req.body.Json);
   var jsonexport = require('jsonexport');
  var myObj = { "name":"John", "age":30, "car":null };
   jsonexport(JsonData,function(err, csv){
   if(err) return console.log(err);
    console.log(csv);

  })

})
/*app.post('/upload',function(req,res){
  console.log(req.files);
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
      var jsonexport = require('jsonexport');
    jsonexport(file,function(err, csv){
    if(err) return console.log(err);
    console.log(csv)
    var uploadpath = __dirname + '/uploads/' + name;
    file.mv(uploadpath,function(err){
      if(err){
        console.log("File Upload Failed",name,err);
        res.send("Error Occured!")
      }
      else {
      console.log("File Uploaded",name);
      success='Yes'
      res.send('Done! Uploading files')
      }
    });
    });

  }
  else {
    res.send("No File selected !");
    res.end();
  };
})*/
