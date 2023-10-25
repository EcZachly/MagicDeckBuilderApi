var db = require('./database.js')
var cardCollection = db.get('Cards');
var setCollection = db.get('Sets');
var deckCollection = db.get('Decks');
var queryCollection = db.get('Queries');
var recommendations = db.get('Recommendations')
var priceCollection = db.get('Prices')
var fs = require('fs');
var _ = require('lodash')
var keywords = []
var analyticsCollection = db.get("Analytics")

priceCollection.aggregate = function(aggregation){
    var collection = this.col;
    var options = {};
    return function (callback){
        return collection.aggregate(aggregation, options, callback)
    }
}

var cards = {
	getRecommendedCardsFromList : function(req, res){
		var name = req.query.name
		var format = req.query.format
		var limit = req.query.limit
		var query = {}
		query["mainBoard.name"] = {$in: name}
		if(format != undefined)
		query["format"] = format
		console.log(req.query)
		deckCollection.find(query, {limit: limit}, function(err, data){
			var mapping = {}
			if(data != undefined){
			limit = data.length
			data.forEach(function(v){
				var incrementBy = 0

				v.mainBoard.forEach(function(v2){
					if(name.indexOf(v2.name) >=0){
						incrementBy++
					}
				})
				incrementBy = incrementBy*incrementBy
				v.mainBoard.forEach(function(v1){
					if(mapping[v1.name] == undefined){
						mapping[v1.name] = incrementBy
						console.log(v1)
					}
					else{
						mapping[v1.name] += incrementBy
					}
				})
			})
			}
			var ret = []
			Object.keys(mapping).forEach(function(v){
				if(mapping[v]/limit > .1 && name.indexOf(v) < 0){
					var obj = {}
					obj["name"] = v
					obj["weight"] = mapping[v]/limit
					ret.push(obj)
				}
			})
			ret.sort(function(a, b){ return b.weight - a.weight})
			res.json(ret)
		})
	},
	getFromList: function(req, res){
		var query = {}
		console.log(req.query)
		if(req.query.list != undefined){
			query["name"] = {$in: req.query.list}
		}
		cardCollection.find(query, function(err, data){
			var nameMap = {}
			console.log(data)
			_.each(data, function(v){
				nameMap[v.name] = v.editions[0].image_url["en"][0]
			})
			res.json(nameMap)
		})
	},
	getRecommendedCards : function(req, res){
		var name = req.query.name
		var query = {}
		console.log(req.query)
		query["name"] = name
		if(req.query.type != undefined){
			query["recommendation_type"] = req.query.recommendation_type
		}
		// recommendations.find({"name":name},{fields:{"recommendations.name":1, "recommendation_type":1}}, function(err, data){
		// 	res.json(data)
		// })		
	recommendations.find({"name":name}, function(err, data){
			res.json(data)
		})		
	},
	getAllForPriceUpdates : function(req, res){
		cardCollection.find({},{"name":1, "editions":1}, function(err, data){
			console.log(data)
			res.json(data)	
		})
	},
	getAll : function(req, res){
		cardCollection.find({},function(err, data){
			res.json(data)	
		})
	},
	getRandom : function(req, res){
		var limit = req.params.limit
		console.log(limit)
		if(limit == undefined){
			limit = 100;
		}
		var returnArr = []
		var num = Math.floor((Math.random() * 10000) + 1);
		cardCollection.find({},{limit: limit, skip: num},function(err, data){
		data.forEach(function(d){
			console.log(d)
          returnArr.push(d)
          if(returnArr.length == data.length || returnArr.length >= limit ){
            res.send(returnArr)
          }
        })
		})
	},
	getByName : function(req, res){
		if(req.query.page != null){
				var page = req.query.page
				var limit = 100
				console.log(req.query.language)
				var returnArr = []
				var num = page*100 + 1;
				var lang = "versions." + req.query.language

				var name = lang;	
				var value = 1;
				var query = {};
				query[name] = value;
				console.log(lang)
				cardCollection.find(query,{limit: limit, skip: num, fields: {'name':1 ,'editions.image_url':1}},function(err, data){
		         res.send(data)
				})
		}
		else if(req.params.name != null){
		var name  = req.params.name		
		var returnArr = []
		cardCollection.find({"name":name},function(err, data){
				res.send(data)
		})
		}
		else{
			var query  = req.query;
			console.log(query)
			queryCollection.insert(query, function(err, data){				
			})
			var queryObj = {}
			var lang = "versions." + req.query.language
			var value = 1;
			if(query.format != undefined){
				var format = "formats." + query.format
				queryObj[format] = "legal"
			}
			queryObj[lang] = value;
			if(query.text != undefined){
					queryObj["$text"] = {$search : query.text}
				}
			delete query.language
			delete query.text
			delete query._id
			delete query.format
			Object.keys(query).forEach(function(v){
				var store = v
				if(v == 'color'){
					store = 'colors'
				}
				if(query[v].constructor === Array){
					queryObj[store] = {$in : query[v]}
				}
				else{
					var arr = []
					arr.push(query[v])
					queryObj[store] = {$in : arr}
				}

			})
			console.log(queryObj)
			// cardCollection.find(queryObj, {limit:100, fields: {'name':1 ,'editions.image_url.en':1}}, function(err, data){
			// 	res.send(data);
			// });
			cardCollection.find(queryObj, {limit:100}, function(err, data){
				res.send(data);
			});
		}
	},
	getTypeAhead : function(req, res){
		var sub = req.query.q
  		var returnArr = []
		re = new RegExp('^' + sub, 'gi')
		// cardCollection.find({"name": re}, {"limit": 100, fields: {"name":1, "rulings":1}}, function(err, data){
		// 	console.log(err)
		// 	data.forEach(function(d){
		// 		console.log(d)
		//         returnArr.push(d)       
	 //        })
  //           res.send(returnArr)
          
		// })
		cardCollection.find({"name": re}, {"limit": 100}, function(err, data){
			console.log(err)
			data.forEach(function(d){
				console.log(d)
		        returnArr.push(d)       
	        })
            res.send(returnArr)
          
		})

	},
	updateCard :function(req,res){
		var card = req.body
		card.last_voted_date = Date.now()
		cardCollection.update({"_id":card._id}, card, function(err, data){
			res.json(data)
		})
	},
	getSubtypes : function(req, res){
		res.json(JSON.parse(fs.readFileSync('./files/subtypes.json', 'utf-8'))["subtypes"])
	},
	getTypes : function(req, res){
		var arr = ['Enchantment','Land','Creature','Instant','Artifact','Sorcery','Summon','Enchant','Player','Interrupt','Tribal','Planeswalker','Plane','Conspiracy','Scheme','Phenomenon']
		res.send(arr)
	},
	getSets: function(req, res){
		setCollection.find({}, function(err, data){
			res.send(data)
		})	
	},
	getKeywords: function(req, res){  	
  		res.send(fs.readFileSync('./files/keywords.txt', 'utf-8').split("\n"))
	},
	//PARAMETERS type, color, substype, rarity, text, set
	getCardsAdvanced: function(req, res){
		var query  = req.query;
		console.log(query);
		var queryObj = {}
		//TODO ADD AND FUNCTIONALITY
		if(query.colors != undefined){
			if(query.colors.constructor === Array){
				queryObj["colors"] = {$in : query.colors}
			}
			else{
				var arr = []
				arr.push(query.colors)
				queryObj["colors"] = {$in : arr}
			}
		}
		if(query.rarity != undefined){
			if(query.rarity.constructor === Array){
				queryObj["rarity"] = {$in : query.rarity}
			}
			else{
				var arr = []
				arr.push(query.rarity)
				queryObj["rarity"] = {$in : arr}
			}
		}
		if(query.text != undefined){
				queryObj["$text"] = {$search : query.text}
			}
		if(query.types != undefined){
			if(query.types.constructor === Array){
				queryObj["types"] = {$in : query.types}
			}
			else{
				var arr = []
				arr.push(query.types)
				queryObj["types"] = {$in : arr}
			}
		}
		if(query.subtypes != undefined){
			if(query.subtypes.constructor === Array){
				queryObj["subtypes"] = {$in : query.subtypes}
			}
			else{
				var arr = []
				arr.push(query.substypes)
				queryObj["subtypes"] = {$in : arr}
			}
		}
		if(query.set != undefined){			
				queryObj["setName"] = {$eq : query.set}
		}		
		console.log(queryObj)
		cardCollection.find(queryObj, {limit: 100}, function(err, data){
			console.log(data)
			console.log(err)
			res.send(data);
		});
	},
	getCardPrice : function(req, res){
		var query = {}
		if(req.query.name != undefined){
			query["name"] = req.query.name
		}
		var ag = [ {$match : query}, {$group:{ _id: {name: "$name", set: "$set"}, high: {$last: "$high"}, mid: {$last: "$mid"}, low:{ $last: "$low" }}}]
		priceCollection.aggregate(ag)(function(err, data){
			res.json(data)
		})
	}
};

module.exports = cards

 