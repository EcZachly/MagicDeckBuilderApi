# db = require('../routes/database.js')
# deckCollection = db.get('Decks');
# cardCollection = db.get('Cards');
# userCollection = db.get('Users');
_ = require('lodash')
request = require('request')
cheerio = require('cheerio')

fs = require('fs')
# newData = JSON.parse fs.readFileSync("BFZ.json", "UTF-8")
# oldData =  fs.readFileSync("cards.csv", "UTF-8").split("\n")


# console.log(newData.cards[1])
request("http://magic.wizards.com/en/content/battle-zendikar-cards", (err, req, data)->
	$ = cheerio.load(data)
	$('img').attr("style", "max-width:100%;").each((v, elem)->
		console.log(elem.attribs)
		console.log(elem.attribs.src)
		# if(v < 50)
		# 	download(elem.attribs.src,"../images/" +  elem.attribs.alt + ".jpg", (err, data)->

		# 		console.log "done"

		# 	)
	)

)



download = (uri, filename, callback) ->
  request.head uri, (err, res, body) ->
    console.log 'content-type:', res.headers['content-type']
    console.log 'content-length:', res.headers['content-length']
    request(uri).pipe(fs.createWriteStream(filename)).on 'close', callback
    return
  return



# console.log(oldData[1])
# console.log(newData)




# query = {}
# query["format"] = {$ne: null}
# deckCollection.find({"format":"standard"}, {limit: 50}, {skip: 50}, (err, data)->
# 	_.each data, (deck) ->
# 		array = []
# 		colors = []
# 		subtypes = []
# 		_.each deck.mainBoard, (card)->
# 			array.push(card.name)
# 		_.each deck.sideBoard, (card)->
# 			array.push(card.name)
# 		# console.log array
# 		query = {}
# 		query["name"] = {$in: array}
# 		cardCollection.find(query, (er, cards)->
# 			_.each cards, (c)->
# 				_.each c.colors, (color)->
# 					if(colors.indexOf(color) < 0)
# 						colors.push(color.toLowerCase())
# 				_.each c.subtypes, (type)->
# 					if(colors.indexOf(color) < 0)
# 						subtypes.push(type)
				
# 			deck.cardSubtypes = subtypes
# 			deck.colors = colors
# 			deckCollection.update({"_id":deck._id}, deck, (err, d)->
# 				console.log("UPDATED!")
# 			)

# 		)
# )