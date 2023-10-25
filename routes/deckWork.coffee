request = require('request')
_ = require('lodash')



f = (num)->
	request("http://magicapp.herokuapp.com/mtg/decks?page=" + num, (err, data)->
		_.each JSON.parse(data.body), (v)->
			request.post({url:"http://magicapp.herokuapp.com/mtg/update/deck",  json:true,body: v}, (err, data)->
				console.log(data)
			)
		f(num + 1)
	)

f(0)