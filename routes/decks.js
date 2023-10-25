var db = require('./database.js')
var deckCollection = db.get('Decks');
var cardCollection = db.get('Cards');
var userCollection = db.get('Users');
var priceCollection = db.get('Prices');
var _ = require('lodash');
var app = require('express')()


var deck = {
	getPriceTimeLime: function(req, res){
		var id = req.params.id
		var startdate = new Date()
		var begindate = new Date()
		begindate.setDate(startdate.getDate() - 7)
		console.log(begindate)
		deckCollection.find({"_id":id}, function(err, data){
			var nameArr = []
			console.log(data)
			var mainMap = {}
			var sideMap = {}
			_.each(data[0].mainBoard, function(v){
				mainMap[v.name] = v.quantity
				if(nameArr.indexOf(v.name) < 0){
					nameArr.push(v.name)
				}
			})
			_.each(data[0].sideBoard, function(v){
				mainMap[v.name] = v.quantity
				if(nameArr.indexOf(v.name) < 0){
					nameArr.push(v.name)
				}
			})
			var query = {}
			query["name"] =  {$in : nameArr}
			query["date"] =  {$gte : begindate}
			console.log(query)
			console.log(nameArr)
			priceCollection.find(query, function(err, data){
				var high_map = {}
				var mid_map = {}
				var low_map = {}
				_.each(Object.keys(mainMap), function(card){
				_.each(data, function(v){
					console.log(card + " " + v.high)
					if(high_map[v.date.getDate()] == undefined){
						console.log(mainMap[v.name])
						console.log(v)
						high_map[v.date.getDate()] = v.high*parseInt(mainMap[v.name])
					}
					else{
						high_map[v.date.getDate()] += v.high*parseInt(mainMap[v.name])
					}
				})
				})
				console.log(high_map)

				res.json(data)

			})


		})



	},
	getStats: function(req, res){
		var id = req.params.id
		deckCollection.find({"_id":id}, function(err, data){
			var nameArr = []
			console.log(data)
			var mainMap = {}
			var sideMap = {}
			_.each(data[0].mainBoard, function(v){
				mainMap[v.name] = v.quantity
				if(nameArr.indexOf(v.name) < 0){
					nameArr.push(v.name)
				}
			})
			_.each(data[0].sideBoard, function(v){
				mainMap[v.name] = v.quantity
				if(nameArr.indexOf(v.name) < 0){
					nameArr.push(v.name)
				}
			})
			var query = {}
			var returnObj = {}		
			var colors = {}
			var cmc = {}
			var landDistro = {}
			var imageMap = []
			console.log(nameArr)
			query["name"] =  {$in : nameArr}
			cardCollection.find(query, function(err, data){
				console.log(data)
				_.each(data, function(v, i){
					var edObj = {}
					edObj["types"] = v.types
					edObj["name"] = v.name
					if(v.editions[0].price.mid == undefined){
						v.editions.forEach(function(ed){
							if(ed.price.mid != 0){
								edObj["price_mid"] = ed.price.mid
								edObj["price_high"] = ed.price.high
								edObj["price_low"] = ed.price.low
							}


						})
					}
					else{

						edObj["price_mid"] = v.editions[0].price.mid
								edObj["price_high"] = v.editions[0].price.high
								edObj["price_low"] = v.editions[0].price.low

					}
					edObj["quantity"] = mainMap[v.name]

					edObj["image"] = v.editions[0].image_url["en"][0]
					imageMap.push(edObj)
					if(mainMap[v.name] != undefined){
					//COMPUTE COLORS and CMC
						if(cmc[v.cmc] == undefined){
							cmc[v.cmc] = parseInt(mainMap[v.name])
						}
						else{
							cmc[v.cmc] += parseInt(mainMap[v.name])
							console.log(cmc)
						}
						if(v.colors != undefined){
						v.colors.forEach(function(color){
							console.log(color)
							if(color != "colorless"){
								if(colors[color] == undefined){
								colors[color] = parseInt(mainMap[v.name])
								}
								else{
								colors[color] += parseInt(mainMap[v.name])
								}
							}
						})
						}
						if(v.types.indexOf("land") >= 0 || v.types.indexOf("basic land") >= 0){
							if(v.text == null){
								v.text = ""
							}
							if(v.name == "Swamp"|| v.text.indexOf("{B}")>=0 ){
								if(landDistro["black"] == undefined){
								landDistro["black"] = parseInt(mainMap[v.name])
								}
								else{
								landDistro["black"] += parseInt(mainMap[v.name])
								}

							}
							if(v.name == "Plains"||v.text.indexOf("{W}")>=0){
								if(landDistro["white"] == undefined){
								landDistro["white"] = parseInt(mainMap[v.name])
								}
								else{
								landDistro["white"] += parseInt(mainMap[v.name])
								}

							}
							if(v.name == "Island"||v.text.indexOf("{U}")>=0){
								if(landDistro["blue"] == undefined){
								landDistro["blue"] = parseInt(mainMap[v.name])
								}
								else{
								landDistro["blue"] += parseInt(mainMap[v.name])
								}

							}
							if( v.name == "Forest"||v.text.indexOf("{G}") >= 0){
								if(landDistro["green"] == undefined){
								landDistro["green"] = parseInt(mainMap[v.name])
								}
								else{
								landDistro["green"] += parseInt(mainMap[v.name])
								}

							}
							if(v.name == "Mountain"||v.text.indexOf("{R}") >= 0){
								if(landDistro["red"] == undefined){
								landDistro["red"] = parseInt(mainMap[v.name])
								}
								else{
								landDistro["red"] += parseInt(mainMap[v.name])
								}
							}
						}
					}
					if(i == data.length - 1){
					returnObj["color_histogram"] = colors
					returnObj["cmc_histogram"] = cmc
					returnObj["land_histogram"] = landDistro
					returnObj["cards"] = imageMap
					console.log(returnObj)
					res.json(returnObj)
					}

				})
		
			})

		})
	},
	getTrendingDecks : function(req, res){
		var q = req.query
		var query = {}
		var page = req.query.page
		if(q.format != undefined){
			query["format"] = q.format
		}
		if(q.color != undefined){
			if(q.color.constructor === Array){
				query["colors"] = {$in : q.color}
			}
			else{
				var arr = []
				arr.push(q.color)
				query["colors"] = {$in : arr}
			}
		}
		query["score"] = {$gte : 0}
		deckCollection.find(query, {limit:15, skip:15*page, sort : {score : -1}},function(err, data){ 
			res.json(data)

		}) 
		
	},
	getDecks : function(req, res){
		var q = req.query;
		var query = {}
		console.log(q)
		if(q.id != undefined){
			query["_id"] = q.id
		}
		if(q.color != undefined){
			if(q.color.constructor === Array){
				query["colors"] = {$in : q.color}
			}
			else{
				var arr = []
				arr.push(q.color)
				query["colors"] = {$in : arr}
			}
		}
		if(q.format != undefined){
			query["format"] = q.format
		}
		var count = 60
		if(q.format == "commander"){
			count = 90
		}

		// query["mainBoardCount"] = {$gte: count}
		var page = 0
		if(q.page != undefined){
			page = q.page
		}
		console.log(query)
		// deckCollection.find(query, {limit :15, skip: 15*page, "sort" : {'score': -1}, fields:{"mainBoard":1, "sideBoard":1,"name":1, "upvotes":1, "downvotes":1}}, function(err, data){
		// 	res.json(data);
		// })
	deckCollection.find(query, {limit :15, skip: 15*page, "sort" : {'score': -1}}, function(err, data){
			res.json(data);
		})
	},
	getAll : function(req, res){
		var query = {}
		query["username"] =  { $ne: null} 
		deckCollection.find(query, function(err, data){
			res.json(data);
		})
	},
	create : function(req, res){		
		var deck = req.body
		var mainBoard = req.body.mainBoard
		var sideBoard = req.body.sideBoard
		var allNames = []
		var mainNames = []
		var sideNames = []
		mainBoard.forEach(function(v){
			mainNames.push(v.name)
			allNames.push(v.name)
		})
		sideBoard.forEach(function(v){
			sideNames.push(v.name)
			allNames.push(v.name)
		})
		var query = {}
		query["name"] = {$in: allNames}
		cardCollection.find(query, function(err, data){
			var newMain = []
			var newSide = []
			data.forEach(function(card, i){
				var obj = {}
				obj["name"] = card.name
				if(mainNames.indexOf(card.name) >= 0){
					obj.quantity = mainBoard[mainNames.indexOf(card.name)].quantity
					newMain.push(obj)
				}
				if(sideNames.indexOf(card.name) >= 0){
					obj.quantity = sideBoard[sideNames.indexOf(card.name)].quantity
					newSide.push(obj)
				}

				var mainCount = newMain.reduce(function(total, val){
					return total += parseInt(val.quantity)
				}, 0)

				if(i == data.length -1){
					deckCollection.insert({name: deck.name, mainBoard :newMain, mainBoardCount: mainCount, sideBoard : newSide, format : deck.format, creator: deck.creator, device_id: deck.device_id, username:deck.username, commander:deck.commander, type:deck.type}, function(err, data){
						console.log(err)
						console.log(data)
						res.json(data)
					})
				}
			})
		})
	},
	getByFormat : function(req, res){
		var format = req.params.format	
		var page = req.params.page
		deckCollection.find({format: format}, {limit: 5, skip: 5*page}, function(err, data){
			res.send(data);
		})
	},
	getByColor : function(req, res){

	},
	getByCost : function(req, res){

	},
	updateDeck : function(req, res){
		var deck = req.body
		console.log(io)
	
		console.log("UPDATING")
		var formats = checkFormats(deck, function(format){
		deck.format = format
		if(deck.created_date == undefined)
		deck.created_date = Date.now()

		deck.mainBoard = deck.mainBoard.map(function(v){
			var obj = {}
			obj.name = v.name
			obj.quantity = v.quantity
			return obj
		})

		deck.sideBoard = deck.sideBoard.map(function(v){
			var obj = {}
			obj.name = v.name
			obj.quantity = v.quantity
			return obj
		})
		deck.last_updated_date = Date.now()
		if(deck.upvotes == undefined){
			deck.upvotes = []
		}
		if(deck.downvotes == undefined){
			deck.downvotes = []
		}
				var mainCount = deck.mainBoard.reduce(function(total, val){
					return total += parseInt(val.quantity)
				}, 0)

		var sideCount = deck.sideBoard.reduce(function(total, val){
					return total += parseInt(val.quantity)
				}, 0)
		if(deck._id != undefined && deck._id != null){
		deckCollection.findAndModify({query :{"_id": deck._id}, update : {$set : {"mainBoard":deck.mainBoard, "mainBoardCount":mainCount, "sideBoardCount":sideCount, "sideBoard":deck.sideBoard, "username":deck.username, "device_id":deck.device_id, "format":deck.format, "upvotes":deck.upvotes, "downvotes":deck.downvotes, "score":deck.score, "last_updated": deck.last_updated_date}}}, function(err, data){
			console.log("UDPDATED" +data)
			res.json(data)
		})	
		}
		else{
			buildNewDeck(req,res)
		}
		})
	},
	updateDeckRating : function(req,res){
		var deck = req.body
		deck.last_voted_date = Date.now()
		deckCollection.update({"_id":deck._id}, deck, function(err, data){
			res.json(data)
		})
	},
	getDecksByUser : function(req, res){
		var obj = {}
		var username = req.params.username	
		console.log(username)		
		deckCollection.find({"username": username}, function(err, result){	
			console.log(err)
			console.log(result)			
			res.send(result)
		})
	}, 
	getDecksByCard : function(req, res){
		var queryObj = {}
		var page = 0;

		if(req.query.card.constructor === Array){
					queryObj["mainBoard.name"] = {$all : req.query.card}
		}
		else{
			var arr = []
			arr.push(req.query.card)
			queryObj["mainBoard.name"] = {$all : arr}
		}
		if(req.query.page != undefined){
			page = req.query.page
		}
		console.log(queryObj)
		deckCollection.find(queryObj, {limit: 5, skip:5*page}, function(err, result){
			res.json(result)	
		})

	}
};

function buildNewDeck(req, res){
		var deck = req.body
		var mainBoard = req.body.mainBoard
		var sideBoard = req.body.sideBoard
		var allNames = []
		var mainNames = []
		var sideNames = []
		mainBoard.forEach(function(v){
			mainNames.push(v.name)
			allNames.push(v.name)
		})
		sideBoard.forEach(function(v){
			sideNames.push(v.name)
			allNames.push(v.name)
		})
		var query = {}
		query["name"] = {$in: allNames}
		cardCollection.find(query, function(err, data){
			var newMain = []
			var newSide = []
			data.forEach(function(card, i){
				if(mainNames.indexOf(card.name) >= 0){
					card.quantity = mainBoard[mainNames.indexOf(card.name)].quantity
					var obj = {}
					obj["name"] = card.name
					obj["quantity"] = card.quantity
					newMain.push(obj)
				}
				if(sideNames.indexOf(card.name) >= 0){
					card.quantity = sideBoard[sideNames.indexOf(card.name)].quantity
					var obj = {}
					obj["name"] = card.name
					obj["quantity"] = card.quantity
					newSide.push(obj)
				}
				
					
				
			})


				var mainCount = newMain.reduce(function(total, val){
					return total += parseInt(val.quantity)
				}, 0)
			deckCollection.insert({name: deck.name, mainBoard :newMain, "mainBoardCount":mainCount, sideBoard : newSide, format : deck.format, creator: deck.creator, device_id: deck.device_id, username:deck.username, "upvotes":deck.upvotes, "downvotes":deck.downvotes, "score":deck.score}, function(err, data){
						console.log("INSERTED DATA" +JSON.stringify(data))
						res.json(data)
			})
		})
}


function checkFormats(deck, callback){
	var nameArr = []
	if(deck.mainBoard != undefined)
	deck.mainBoard.forEach(function(v){
		nameArr.push(v.name)
	})
	if(deck.sideBoard != undefined)
	deck.sideBoard.forEach(function(v){
		nameArr.push(v.name)
	})
	var query = {}
	var standardFlag = true;
	var modernFlag = true;
	var vintageFlag = true;
	var commanderFlag = true;
	var legacyFlag = true;
	query["name"] = {$in: nameArr}
	cardCollection.find(query, {"formats":1, "name":1}, function(err, cards){
		cards.forEach(function(v, i){
			if(v.formats.standard != "legal"){
				standardFlag =false
			}
			if(v.formats.modern != "legal"){
				modernFlag =false
			}
			if(v.formats.vintage != "legal"){
				vintageFlag =false
			}
			if(v.formats.legacy != "legal"){
				legacyFlag =false
			}
			if(v.formats.commander != "legal"){
				commanderFlag =false
			}

			if(i == cards.length - 1){
				if(standardFlag){
					callback("standard")
				}
				else if(modernFlag){
				 	callback("modern")
				}
				else if(commanderFlag){
					callback("commander")
				}
				else if(legacyFlag){
					callback("legacy")
				}
				else if(vintageFlag){
					callback("vintage")
				}
				else{
					callback(null)
				}
			}
		})
	})

	

}
function checkLegality(deck, format){
	if(format == "standard" || format == "modern" || format == "legacy" || format == "vintage"){
		if(deck.mainBoard.length >= 60 && deck.sideBoard.length <= 15){
			return true;
		}
	}
	else if(format == "commander"){
		var onlyCommander = deck.sideBoard.length == 1;
		var flag = true
		deck.mainBoard.forEach(function(v){
			if(!isBasicLand(v)){
				if(v.quantity > 1){
					flag = false
				}
			}
		})
		
	}

}
function isBasicLand(card){
	if(card.name == "Mountain" || card.name == "Forest" || card.name == "Plains" || card.name == "Island" || card.name == "Swamp"){
		return true;
	}
	return false;
}

function getMap(deck){
	var map = {}
	deck.mainBoard.forEach(function(v){
		map[v.multiverseid] = v.quantity	
	})
	deck.sideBoard.forEach(function(v){
		map[v.multiverseid] = v.quantity
	})
	return map
}

function getCards(map, callback){
	 var query = {}
	 var arr = Object.keys(map)


	 arr.forEach(function(v, i){
	 	arr[i] = parseInt(v)

	 })

	 query["multiverseid"] = {$in: arr}
	 console.log(query)

	 cardCollection.find(query, function(err, data){
	 	callback(data)
	 })
}







module.exports = deck;