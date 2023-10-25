var fs = require('fs');
var db = require('./database.js')
var analyticsCollection = db.get("Analytics")
var keywords = []
var analytics = {
	createEntry : function(req, res){
		var entry = req.body
		analyticsCollection.insert(entry, function(err, data){
		})
	},
	getEntries : function(req, res){
		var query = req.query
		var page = req.query.page
		delete query.page
		console.log(req.query)
		analyticsCollection.find(query, {limit:500, skip:500*page}, function(err, data){
			res.json(data)
		})
	}
}

module.exports = analytics;