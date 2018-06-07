const express = require('express');
var app = express();
var upload = require('express-fileupload');
var bodyParser = require('body-parser')
const http = require('http');
var port = Number(process.env.PORT || 3000)
http.Server(app).listen(port); // make server listen on port 3000
var fs = require('fs');
var util = require('util')
var csv=null
app.use(upload()); 
var urlencodedParser = bodyParser.urlencoded({ extended: false })
console.log("Server Started at port 3000");

app.set("view engine","ejs")


app.get('/',function(req,res){
  res.render('view.ejs',{ Output: 'Your output Shows here'  ,warn:'' });
})

app.get('/download',function(req,res){
if (fs.existsSync(__dirname + '/views/output.csv')) {

  res.download(__dirname + '/views/output.csv', 'csvfile.csv', function(err){
  if (err) {
    console.log(err);
  }
});
}
else{
  res.render('view.ejs',{ Output: 'Your output shows here'  ,warn:'Upload the file first' });
}

})
//Remove file in server if any ..Convert the String and Make it downloadable
app.post('/',urlencodedParser,function(req,res){

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
     fs.writeFileSync('views/output.csv', csv, 'utf-8')
     res.render('view.ejs',{ Output: csv ,warn:''});

   })
    } catch(e) {
      res.render('view.ejs',{ Output: 'Wrong Json Format' ,warn:''});

        alert(e); // error in the above string (in this case, yes)!
    }


})

//Redirect to Download .. Remove File in Server then Add a new one And
app.post('/download',urlencodedParser,function(req,res){


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
    var file = req.files.upfile;
    var data = file.data;
      try {
      var JsonData = JSON.parse('['+data+']');
      var jsonexport = require('jsonexport');

      jsonexport(JsonData,function(err, csv){
      if(err) return console.log(err);
       console.log(csv);
       fs.writeFileSync('views/output.csv', csv, 'utf-8')

       res.render('view.ejs',{ Output: csv,warn:'Uploaded' });

     })
   }

   catch(e) {
     res.render('view.ejs',{ Output:'Your output shows here', warn:'File is not in Json format'});

       alert(e); // error in the above string (in this case, yes)!
   }



  }
  else if(req.body.hasOwnProperty('download')) {
    res.render('view.ejs', {Output:'Your output Shows here ',warn:'Downloaded latest converted file' });



    res.end();
  }
  else if(req.body.hasOwnProperty('upload')) {
    res.render('view.ejs', {Output:'Your output Shows here ',warn:'Upload the file first' });
    console.log('Here');

    res.end();
  }


})
