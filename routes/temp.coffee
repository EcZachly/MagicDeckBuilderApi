fs = require('fs')
cardCollection = require('./database.js').get("Cards")
priceCollection = require('./database.js').get("Prices")
request = require('request')
_ = require('lodash')
query = {}
query["set"] = {$in : ["Magic Origins"]}






cards = fs.readFileSync("allCards.json", "utf-8").split("\n")
# console.log(cards)

getCardsAndUpdate = ()->
  console.log("STARTED")
  arr = []
  index = 0
  _.each cards, (v, i)->
  	if(JSON.parse(v).name == "Alley Grifters")
  		process(cards, i)
 
		

 
 process = (data, index)->
 	setTimeout (->
 		getPrice(data, JSON.parse(data[index]).editions[0].set, JSON.parse(data[index]).name, 0)
 		if(index + 1 < data.length)
 			process(data, index + 1)
	), 1000

            		



getPrice = (data, set, name, index) ->	
	console.log(set)
	request 'http://partner.tcgplayer.com/x3/phl.asmx/p?pk=MAGICVIEW&s=' + set + '&p=' + name, (err, price) ->
	    console.log(set + " " + name)
	    if(price == undefined)
	    	fs.appendFileSync("badPrices.json", JSON.stringify(data[index]) + "\n")
	    	return
	    foil = undefined
	    hi = undefined
	    low = undefined
	    mid = undefined
	    priceObj = undefined
	    if price != undefined
	      if price.body.toString().indexOf('<hiprice>') >= 0
	        hi = price.body.substring(price.body.toString().indexOf('<hiprice>') + 9, price.body.toString().indexOf('</hiprice>'))
	        mid = price.body.substring(price.body.toString().indexOf('<avgprice>') + 10, price.body.toString().indexOf('</avgprice>'))
	        low = price.body.substring(price.body.toString().indexOf('<lowprice>') + 10, price.body.toString().indexOf('</lowprice>'))
	        foil = price.body.substring(price.body.toString().indexOf('<foilavgprice>') + 14, price.body.toString().indexOf('</foilavgprice>'))
	        priceObj = {}
	        priceObj['high'] = hi
	        priceObj['mid'] = mid
	        priceObj['low'] = low
	        priceObj['foil'] = foil
	      else
	        priceObj = {}
	        priceObj['high'] = 0
	        priceObj['mid'] = 0
	        priceObj['low'] = 0
	        priceObj['foil'] = 0
	      priceObj['date'] = new Date
	      priceObj['name'] = name
	      priceObj['set'] = set
	      priceCollection.insert priceObj, (err, doc)->
	        if(doc != null)
	          cardCollection.find {"name":name}, (err, data)->
	            data[0].editions.forEach((v, i)->
	              if(v.set == set)
	                data[0].editions[i].price = priceObj              
	            )
	            cardCollection.findAndModify({query: { "name": name}, update: { $set: { editions: data[0].editions } }}, (err, saved)->
	                console.log("SAVED IN SET ")
	            )
	            
	    return
	  return
getCardsAndUpdate()
