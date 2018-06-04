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
var ejs = require('ejs');

http.Server(app).listen(80); // make server listen on port 80
var success='No'
var csv=null

app.use(upload()); // configure middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false })
console.log("Server Started at port 80");

app.set("view engine","ejs")


app.get('/',function(req,res){
  //res.sendFile(__dirname+'/index.html');
  res.render('view.ejs',{ title: 'Your output Shows here'  ,warn:'' });




})

app.get('/download',function(req,res){
  // res.download(__dirname + '/uploads/output.csv', 'csvfile.csv');

  res.download(__dirname + '/uploads/output.csv', 'csvfile.csv', function(err){
  if (err) {
    // Handle error, but keep in mind the response may be partially-sent
    // so check res.headersSent
  } else {
    // decrement a download credit, etc.
  }
});






})

app.post('/',urlencodedParser,function(req,res){
   var JsonData = JSON.parse('['+req.body.Json+']');
   var jsonexport = require('jsonexport');
   jsonexport(JsonData,function(err, csv){
   if(err) return console.log(err);
    console.log(csv);
    var fs = require('fs')
    var util = require('util')
    fs.writeFileSync('uploads/output.csv', csv, 'utf-8')
    res.render('view.ejs',{ title: csv ,warn:''});








  })

})


app.post('/download',urlencodedParser,function(req,res){
  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
      data = file.data;
      var JsonData = JSON.parse('['+data+']');
      var jsonexport = require('jsonexport');

      jsonexport(JsonData,function(err, csv){
      if(err) return console.log(err);
       console.log(csv);
       var fs = require('fs')
       var util = require('util')
       fs.writeFileSync('uploads/output.csv', csv, 'utf-8')

       res.render('view.ejs',{ title: csv,warn:'Uploaded' });

     })


  }
  else {
    res.render('view.ejs', {title:' ',warn:'Downloaded latest converted file' });

    res.end();
  }

})
