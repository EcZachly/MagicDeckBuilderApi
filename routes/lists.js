var db = require('./database.js')
var lists = db.get('Lists');
var users = db.get('Users');
var _ = require('lodash');


var list = {
	//types are wishlist, trades, collection
	createList : function(req, res){
		var obj = {}
	 	obj["cards"] = req.body.cards
		obj["username"] = req.body.username
		obj["type"] = req.body.type
		obj["created_at"] = Date.now()
		lists.insert(obj, function(err, data){
			res.json(data)
		})
	},
	updateList: function(req, res){
		lists.update({"_id":req.body._id}, req.body, function(err, data){
			res.json(data)


		})
	},
	getListsByUser: function(req, res){
		var username = req.query.username
		lists.find({"username":username}, function(err,data){
			res.json(data)
		})
	}
};


module.exports = list