var db = require('./database.js')
var comments = db.get('Comments');


var comment = {
	createComment : function(req, res){
		var obj = {}
		obj.comment = req.body.comment
		obj.card = req.body.card
		obj.date = Date.now()
		obj.username = req.body.username
		console.log(obj)
		comments.insert(obj, function(err, data){
			res.json(data)
		})
	},
	getComments : function(req, res){
		comments.find({"card": req.params.name}, {limit: 50}, function(err, data){
			res.json(data)
		})
	}

}

module.exports = comment