var fs = require('fs'),
    request = require('request');

var newData = JSON.parse fs.readFileSync("BFZ.json", "UTF-8")
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};



newData.cards.forEach(function(v){

download('https://www.google.com/images/srpr/logo3w.png', 'google.png', function(){
  console.log('done');
});

	
})



