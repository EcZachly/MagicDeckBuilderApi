var request = require('request')


var obj = {}
obj.email = "wbraithwaite@me.com"


request.post({url:'http://localhost:3001/password/recover',form: {email:'zachwilson130@gmail.com'}}, function(err, data){
	console.log(data)
})