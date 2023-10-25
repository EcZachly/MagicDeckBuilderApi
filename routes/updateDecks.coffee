decks = require('./database.js').get("Decks")
_ = require('lodash')






decks.find {}, (err, data)->
	_.each data, (deck)->
		if(deck.upvotes == undefined)
			deck.upvotes = []
		if(deck.downvotes == undefined)
			deck.downvotes = []
		if(deck.score == undefined)
			deck.score = deck.upvotes.length - deck.downvotes.length
		decks.update {"_id":deck._id}, deck, (err, data)->
			console.log("UPDATED")





