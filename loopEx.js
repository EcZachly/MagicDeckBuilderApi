var _ = require('lodash')

var request = require('request')





request("http://www.google.com", function(err, data){
	console.log(data)


})



function someFunction(a, callback){
	console.log(a)
	callback(a+1)
}



someFunction(1, function(someVar){
	console.log(someVar)


})


// var array = [1,2,3,4]


// array.forEach(function(v){
	
// })

// _.each(array, function(v){
// 	console.log(v)
// })


// function User(){
// 	var user = {}
// 	function someFunction2(){
// 		console.log(user)

// 	}
// }



