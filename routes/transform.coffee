fs = require('fs')
_ = require('lodash')
arr = []
startURL = "http://magiccards.info/scans/en/"
edArr = []
# "Rain of Rust","Fifth Dawn","http://magiccards.info/scans/en/5dn/76.jpg","red","5","0.66","0.14","0.05","2015-08-10T03:34:24.620Z"
data = fs.readFileSync("allCards.json", "utf-8").split("\n")
_.each data, (v)->
	_.each JSON.parse(v).editions, (e)->
		obj = {}
		c = JSON.parse(v)
		# console.log(e)
		obj["name"] = c.name
		obj["set"] = e.set
	
		obj["url"] = e.image_url["en"][0]
		if(e.set == "Battle for Zendikar")
			obj["url"] = startURL + "bfz" + "/" + e.number + ".jpg"
		if(e.image_url["en"].length == 0)
			console.log(e)
			obj["url"] = startURL + e.set_id.toLowerCase() + "/" + e.number + ".jpg"

		if(c.colors != undefined)
			obj["colors"] = c.colors.toString()
		else
			obj["colors"] = "colorless"
		obj["cmc"] = c.cmc
		if(e.price != undefined)	
			obj["price_high"] = e.price["high"]
			obj["price_mid"] = e.price["mid"]
			obj["price_low"] = e.price["low"]
			if(e.price["high"] == 0)
				fs.appendFileSync("onlyZeroPrices.json", JSON.stringify(obj) + "\n")
		else
			if(arr.indexOf(e.set) < 0)
				arr.push(e.set)
				# console.log(e.set + " " + c.name)			
		edArr.push(obj)

fs.writeFileSync("fixedCards.json", JSON.stringify(edArr))
		



