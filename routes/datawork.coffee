db = require('./database.js')
deckCollection = db.get('Decks');
cardCollection = db.get('Cards');
userCollection = db.get('Users');
_ = require('lodash')
request = require('request')
cheerio = require('cheerio')

fs = require('fs')

# newData = JSON.parse fs.readFileSync("BFZ.json", "UTF-8")
oldData =  fs.readFileSync("cards.csv", "UTF-8").split("\n")


# console.log(newData.cards[1])
# "Rain of Rust","Fifth Dawn","http://magiccards.info/scans/en/5dn/76.jpg","red","5","0.66","0.14","0.05","2015-08-10T03:34:24.620Z"

request("http://magicapp.herokuapp.com/mtg/cards?language=en&set=Battle for Zendikar", (err, data, body)->
	_.each JSON.parse(body), (card)->
		console.log(card.colors)
		color = ""
		_.each card.colors, (c)->
			color += c.toLowerCase()
		_.each card.editions, (edition)->
			if(edition.set == "Battle for Zendikar")
				buildString = "\"" + card.name + "\",\""+ edition.set + "\",\"" + edition.image_url["en"][0] + "\",\"" + color + "\",\"" + card.cmc + "\",\"" + edition.price.high
				buildString += "\",\"" + edition.price.mid + "\",\"" + edition.price.low + "\",\"" + edition.price.date + "\""
				console.log(buildString)
				fs.appendFileSync("cards.csv", buildString + "\n")
)	

# request("http://magic.wizards.com/en/content/battle-zendikar-cards", (err, req, data)->
# 	$ = cheerio.load(data)

# 	$('img').attr("style", "max-width:100%;").each((v, elem)->
# 		console.log(elem.attribs.alt)
# 		console.log(elem.attribs.src)

		
# 	)

# )


# download = (uri, filename, callback) ->
#   request.head uri, (err, res, body) ->
#     console.log 'content-type:', res.headers['content-type']
#     console.log 'content-length:', res.headers['content-length']
#     request(uri).pipe(fs.createWriteStream(filename)).on 'close', callback
#     return
#   return




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