fs = require('fs')
_ = require('lodash')
<<<<<<< HEAD
=======
request = require('request')

# c = JSON.parse fs.readFileSync('BFZ.json', 'utf-8')

# request "http://magicapp.herokuapp.com/mtg/cards?language=en&set=Battle%20for%20Zendikar", (req, data)->
# 	d = _.filter c.cards, (v)->
# 		flag = _.reduce JSON.parse(data.body), (total, card)->
# 			return total || card.name == v.name
# 		return !flag
# 	console.log d
# console.log(c.cards.length)


>>>>>>> 29469fe0b8827eb082c2c7b7534867ead626c7c2
cardCollection = require('./database.js').get("Cards")
url = "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid="
endUrl = "&type=card"
set = "Battle for Zendikar"
set_id = "BFZ"
arr = ["en", "de","ko","pt", "cn", "ru", "es", "jp", "fr","it"]
apiURL = "http://partner.tcgplayer.com/x3/phl.asmx/p?pk=MAGICVIEW&s="
productPiece = "&p="


oldCards = JSON.parse(fs.readFileSync("cards.json", "utf-8"))
names = []
cards =[]
_.each oldCards, (v)->
	cards.push(v)
	names.push(v.name)


<<<<<<< HEAD
data = JSON.parse fs.readFileSync('BFZ.json', 'utf-8')

_.each data.cards, (v, i)->
	cardCollection.find {"name":v.name}, (err, data)->
		if(data.length >= 1)
=======
query = {}
query["set"] = {$in : ["Battle for Zendikar"]}

arr = ["Masters Edition II", "Masters Edition I", "Masters Edition III", "Masters Edition IV", "Vintage Masters"]



func = (page)->
	if(page < 170)
		cardCollection.find {}, {limit: 100, skip: 100*page}, (err, data)->
			# _.each data, (v)->
			# 	v.editions = v.editions.filter((ed)-> arr.indexOf(ed.set) < 0)
			# 	console.log(v.editions)
			# 	cardCollection.update {"_id":v._id}, v, (err, data)->
			# 		console.log(data)
			# func(page + 1)
			_.each data, (v)->
				fs.appendFileSync("allCards.json", JSON.stringify(v) + "\n")
			func(page + 1)
			console.log(page)
			


func(0)

# cardCollection.find query, (err, data)->
# 	_.each data, (v)->
# 		_.each c.cards, (card)->
# 			if(v.name == card.name)
# 				if(card.subtypes != undefined)
# 					v.subtypes = card.subtypes.map((type)-> type.toLowerCase())
# 				cardCollection.update {"_id":v._id}, v, (err, data)->
# 					console.log("UPDATED")

			# console.log(card)




# _.each data.cards, (v, i)->
# 	cardCollection.find {"name":v.name}, (err, data)->
# 		if(data == null)
# 			console.log v.name
		# console.log(data.length + " " + v.name)
		# if(data.length >= 1)
>>>>>>> 29469fe0b8827eb082c2c7b7534867ead626c7c2
			# card = {}
			# card["name"] = v.name	
			# card["types"] = v.types
			# card["colors"] = v.colors
			# if(card["colors"] == undefined)
			# 	card["colors"] = ["colorless"]
			# card["cmc"] = v.cmc
			# if(card["cmc"] == undefined)
			# 	card["cmc"] = 0

			# card["cost"] = v.manaCost
			# if(card["cost"] == undefined)
			# 	card["cost"] = "{0}"
			# card["text"] = v.text
			# formats = {}
			# formats["standard"] = "legal"
			# formats["modern"] = "legal"
			# formats["vintage"] = "legal"
			# formats["commander"] = "legal"
			# formats["legacy"] = "legal"
			# card["formats"] = formats
			# newEdition = {}
			# newEdition["set"] = set
			# newEdition["set_id"] = set_id
			# newEdition["rarity"] = v.rarity
			# newEdition["multiverse_id"] = v.multiverseid
			# newEdition["artist"] = v.artist
			# newEdition["number"] = v.number
			# newEdition["layout"] = v.layout
<<<<<<< HEAD
			image_url = {}
			price = {}
			price["high"] = 0
			price["mid"] = 0
			price["low"] = 0
			price["foil"] = 0
			versions = {}
=======
			# image_url = {}
			# price = {}
			# price["high"] = 0
			# price["mid"] = 0
			# price["low"] = 0
			# price["foil"] = 0
			# versions = {}
>>>>>>> 29469fe0b8827eb082c2c7b7534867ead626c7c2
			# _.each arr, (lang)->
			# 	arr2 = []
			# 	versions[lang] = 1
			# 	arr2.push  url + v.multiverseid + endUrl
			# 	image_url[lang] = arr2
			# console.log(image_url)
<<<<<<< HEAD
			if(cards[names.indexOf(v.name)] != undefined)
				oldEdition = data[0].editions
				cards[names.indexOf(v.name)].editions.forEach((ed)->
					if(data[0].set.indexOf(ed.set) < 0)
						set2 = data[0].set
						set2.push(ed.set)
						data[0].set = set2
				
				)
=======
			# if(cards[names.indexOf(v.name)] != undefined)
			# 	oldEdition = data[0].editions
			# 	cards[names.indexOf(v.name)].editions.forEach((ed)->
			# 		if(data[0].set.indexOf(ed.set) < 0)
			# 			set2 = data[0].set
			# 			set2.push(ed.set)
			# 			data[0].set = set2
				
			# 	)
>>>>>>> 29469fe0b8827eb082c2c7b7534867ead626c7c2
				# console.log(data[0].name)
				# console.log(data[0].editions)
				# newEdition["image_url"] = image_url
				# newEdition["price"] = price
<<<<<<< HEAD
				data[0].formats["standard"] = "legal"
				data[0].formats["modern"] = "legal"
=======
				# data[0].formats["standard"] = "legal"
				# data[0].formats["modern"] = "legal"
>>>>>>> 29469fe0b8827eb082c2c7b7534867ead626c7c2
				# console.log(typeof data[0].set)
				
				
			
				# console.log(card)
				# cardCollection.insert(card, (err, data2)->
				# 	console.log(data2.name)
				# )
				# if(card.rarity[0] == "Mythic Rare")
				# 	card.rarity = "mythic"
				# else if(card.rarity[0] =="Rare")
				# 	card.rarity = "rare"
				# else
				# 	card.rarity = card.rarity[0].toLowerCase()
				# card.types = card.types.map((s)-> return s.toLowerCase())	
				# card.rarity = card.rarity.map((s)-> return s.toLowerCase())	
			
<<<<<<< HEAD
				cardCollection.update({"_id":data[0]._id}, data[0], (err, data)->
					console.log("UPDATED")
				)
=======
>>>>>>> 29469fe0b8827eb082c2c7b7534867ead626c7c2
			
		# else
		# console.log(v)
