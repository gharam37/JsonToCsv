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
var port = Number(process.env.PORT || 3000)
http.Server(app).listen(port); // make server listen on port 80
var success='No'
var csv=null

app.use(upload()); // configure middleware
var urlencodedParser = bodyParser.urlencoded({ extended: false })
console.log("Server Started at port 3000");

app.set("view engine","ejs")


app.get('/',function(req,res){
  res.render('view.ejs',{ title: 'Your output Shows here'  ,warn:'' });




})

app.get('/download',function(req,res){
  var fs = require('fs');
if (fs.existsSync(__dirname + '/views/output.csv')) {

  res.download(__dirname + '/views/output.csv', 'csvfile.csv', function(err){
  if (err) {
    console.log(err);
  } else {
  }
});
}
else{

  res.render('view.ejs',{ title: 'Your output shows here'  ,warn:'Upload the file first' });


}








})

app.post('/',urlencodedParser,function(req,res){
  var fs = require('fs')


  fs.stat('./views/output.csv', function (err, stats) {
console.log(stats);//here we got all information of file in stats variable

if (err) {
    return console.error(err);
}

fs.unlink('./views/output.csv',function(err){
     if(err) return console.log(err);
     console.log('file deleted successfully');
});
});
  try {
    var JsonData = JSON.parse('['+req.body.Json+']');
    var jsonexport = require('jsonexport');
    jsonexport(JsonData,function(err, csv){
    if(err) return console.log(err);
     console.log(csv);
     var fs = require('fs')
     var util = require('util')
     fs.writeFileSync('views/output.csv', csv, 'utf-8')
     res.render('view.ejs',{ title: csv ,warn:''});

   })
    } catch(e) {
      res.render('view.ejs',{ title: 'Wrong Json Format' ,warn:''});

        alert(e); // error in the above string (in this case, yes)!
    }


})


app.post('/download',urlencodedParser,function(req,res){
  var fs = require('fs')


  fs.stat('./views/output.csv', function (err, stats) {
console.log(stats);//here we got all information of file in stats variable

if (err) {
    return console.error(err);
}

fs.unlink('./views/output.csv',function(err){
     if(err) return console.log(err);
     console.log('file deleted successfully');
});
});

  if(req.files.upfile){
    var file = req.files.upfile,
      name = file.name,
      type = file.mimetype;
      data = file.data;
      try {
      var JsonData = JSON.parse('['+data+']');
      var jsonexport = require('jsonexport');

      jsonexport(JsonData,function(err, csv){
      if(err) return console.log(err);
       console.log(csv);
       var fs = require('fs')
       var util = require('util')
       fs.writeFileSync('views/output.csv', csv, 'utf-8')

       res.render('view.ejs',{ title: csv,warn:'Uploaded' });

     })
   }

   catch(e) {
     res.render('view.ejs',{ title:'Your output shows here', warn:'File is not in Json format'});

       alert(e); // error in the above string (in this case, yes)!
   }



  }
  else if(req.body.hasOwnProperty('download')) {
    res.render('view.ejs', {title:'Your output Shows here ',warn:'Downloaded latest converted file' });



    res.end();
  }
  else if(req.body.hasOwnProperty('upload')) {
    res.render('view.ejs', {title:'Your output Shows here ',warn:'Upload the file first' });
    console.log('Here');

    res.end();
  }


})
