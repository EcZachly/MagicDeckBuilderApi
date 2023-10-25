var db = require('./database.js')
var ratings = db.get('Ratings');


ratings.aggregate = function(aggregation){
    var collection = this.col;
    var options = {};
    return function (callback){
        return collection.aggregate(aggregation, options, callback)
    }
}
//object_Type, object_id, rating (+1, -1 or 1-5 scale)
//Type (deck or card),  (card or deck id), (rating)
var rating = {
	createRating : function(req, res){
		var obj  = req.body
		//NEEDS object_id, object_type, and rating, user_id
		ratings.insert(obj, function(err, data){
			res.json(data)
		})
	},
	getCardRating : function(req, res){
		var id = req.query.id
		var ag = [ {$match : {"object_id" : id}}, {$group:{ _id: "$object_id", avgRating: { $avg: "$rating" }} }]
		ratings.aggregate(ag)(function(err, data){
			res.json(data)
		})	
	},
	getAllCardRatings : function(req, res){
		var id = req.query.id
		ratings.find({"object_id":id}, function(err, data){
			res.json(data)
		})
	},
	getDeckRating : function(req, res){
		var id = req.query.id
		var ag = [ {$match : {"object_id" : id}}, {$group:{"_id": { "object": "$object_id", "votes": "$rating"},  upvotes: { $sum: "$rating" }} }]
		ratings.aggregate(ag)(function(err, data){
			res.json(data)
		})	
	},
	getAllDeckRatings : function(req, res){
		var id = req.query.id
		ratings.find({"object_id":id}, function(err, data){
			res.json(data)
		})
	}
}

module.exports = rating