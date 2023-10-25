fs = require('fs')
request = require('request')
_ = require('lodash')
page = 0





requestPage = (page)->
	request "http://magicapp.herokuapp.com/mtg/decks?page=" + page, (err, req, data)->
		_.each JSON.parse(data), (v)->
			fs.appendFileSync("decks.json", JSON.stringify(v) + "\n")
		setTimeout (->
    		requestPage(page + 1)
    		console.log(page)
		), 2000






requestPage(1)
