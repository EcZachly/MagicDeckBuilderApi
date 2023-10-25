deckCollection = require('./routes/database.js').get("Decks")
userCollection = require('./routes/database.js').get("Users")
cardCollection = require('./routes/database.js').get("Cards")


userCollection.find({}, (err, data)->
	data.forEach((v)->
		console.log(v.username)
		id = v.device_id
		deckCollection.find({"device_id": id}, (err, data)->
			console.log
			data.forEach((v1)->
				console.log(v.username)
				console.log(v1.username)
				v1.username = v.username
				checkFormats(v1, (d)->
					v1.format = d
					deckCollection.update({"_id":v1._id}, v1, (err, data)->
						console.log("UPDATED A DECK!")
					)

				)
				
			)
		)
	)
)


# deckCollection.remove({"device_id":"9b76d55325cc0769"})


# deckCollection.remove({device_id:"515e2d17a0d60368"})checkFormats = (deck, callback) ->
checkFormats = (deck, callback) ->
  nameArr = []
  if deck.mainBoard != undefined
    deck.mainBoard.forEach (v) ->
      nameArr.push v.name
      return
  if deck.sideBoard != undefined
    deck.sideBoard.forEach (v) ->
      nameArr.push v.name
      return
  query = {}
  standardFlag = true
  modernFlag = true
  vintageFlag = true
  commanderFlag = true
  legacyFlag = true
  query['name'] = $in: nameArr
  cardCollection.find query, {
    'formats': 1
    'name': 1
  }, (err, cards) ->
    cards.forEach (v, i) ->
      if v.formats.standard != 'legal'
        standardFlag = false
      if v.formats.modern != 'legal'
        modernFlag = false
      if v.formats.vintage != 'legal'
        vintageFlag = false
      if v.formats.legacy != 'legal'
        legacyFlag = false
      if v.formats.commander != 'legal'
        commanderFlag = false
      if i == cards.length - 1
        if standardFlag
          callback 'standard'
        else if modernFlag
          callback 'modern'
        else if commanderFlag
          callback 'commander'
        else if legacyFlag
          callback 'legacy'
        else if vintageFlag
          callback 'vintage'
        else
          callback null
      return
    return
  return