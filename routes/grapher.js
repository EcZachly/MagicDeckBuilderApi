var db = require('./database.js')
var deckCollection = db.get('Decks');
var cardCollection = db.get('Cards');
var userCollection = db.get('Users');
var Promise  = require('promise')
var mongoose = require('mongoose');
var _ = require('lodash');
var d3 = require('d3');
//var jsdom = require('jsdom');
var htmlStub = '<html><head><script src="http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script></head><body><svg id="dataviz-container"></svg><script src="http://d3js.org/d3.v3.min.js"></script></body></html>' // html file skull with a container div for the d3 dataviz
var height = 500;
var width = 500;
var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var grapher = {
	getColorGraph : function(req, res){
		var id = req.params.deckid
jsdom.env({ features : { QuerySelector : true }, html : htmlStub, scripts: ["https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js","https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.7.0/nv.d3.min.js"]
	, done : function(errors, window) {
		console.log(errors)
		var nv = window.nv
		var el = window.document.querySelector('#dataviz-container')
		var body = window.document.querySelector('body')
		deckCollection.find({"_id": id}, function(err, d){
			var map = getMap(d[0])		
		getCards(map, function(cards){
		getHistogram(map, cards, "colors", function(data){
			console.log(data)
		buildPieChart(data, el)
		
        res.send(window.document.querySelector('html').innerHTML)
      
  	})

})  
})
}
})


	},
	getManaCurve : function(req, res){
		var id = req.params.deckid
jsdom.env({ features : { QuerySelector : true }, html : htmlStub, scripts: ["https://cdnjs.cloudflare.com/ajax/libs/d3/3.5.2/d3.min.js","https://cdnjs.cloudflare.com/ajax/libs/nvd3/1.7.0/nv.d3.min.js", "http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"]
	, done : function(errors, window) {
		console.log(errors)
		
		var nv = window.nv
		var el = window.document.querySelector('#dataviz-container')
		var body = window.document.querySelector('body')
		deckCollection.find({"_id": id}, function(err, d){
			var map = getMap(d[0])		
		getCards(map, function(cards){
		getHistogram(map, cards, "cmc", function(data){
				var arr=  []	
	delete data["other"]
	Object.keys(data).forEach(function(v){
	var obj = {}
	obj["label"] = v
	obj["value"] = data[v]
	arr.push(obj)
	


})

	generateManaCurve(arr, el)
	res.send(window.document.querySelector('html').innerHTML)


})
	})
	})
	}
})
},
	generateGraph: function(req, res){
		var deckid = req.params.deckid
		var type = req.params.type
		console.log(req.params)
		deckCollection.find({ "_id": deckid }, function(err, dec){
			
    dec.forEach(function(deck){  
    var countArr = []
	var idArr = []
	var map = {}
	var query = {}
	_.each(deck.mainBoard, function(v){
		countArr.push(v.quantity)
		map[v.multiverseid] = v.quantity
		idArr.push(v.multiverseid)

	})
	_.each(deck.sideBoard, function(v){
		console.log(v)
		countArr.push(v.quantity)
		map[v.multiverseid] = v.quantity
		idArr.push(v.multiverseid)

	})
	console.log(idArr)
	query["multiverseid"] = {$in: idArr}
		cardCollection.find(query, function(err, data){

			var stats = {}
			var arr = ["types", "colors", "rarity","setName", "cmc"]
			var arr2 = {}
			arr.forEach(function(v, i){
 				getHistogram(map, data, v, function(histo){
					arr2[v] = histo
				})
				if(i == arr.length -1 ){
					res.json(arr2)
				}
			})
			
				
			})
			})

})
}
};
function buildPieChart(data, el){

	var arr=  []	
	delete data["other"]
	Object.keys(data).forEach(function(v){
	var obj = {}
	obj["key"] = v
	obj["y"] = data[v]
	arr.push(obj)



})
var width = 500,
    height = 500,
    radius = Math.min(width, height) / 2;
var arc = d3.svg.arc()
    .outerRadius(radius - 10)
    .innerRadius(0);

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d) { return d.y; });
  var color = d3.scale.ordinal()
    .range(Object.keys(data));


var svg = d3.select(el)
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
      arr.forEach(function(v){
      	v.y = +v.y
      })


var g = svg.selectAll(".arc")
      .data(pie(arr))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
      .attr("d", arc)
      .style("fill", function(d) { return color(d.data.key); });

  g.append("text")
      .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
      .attr("dy", ".35em")
      .style("text-anchor", "middle")
      .style("color", "yellow")
      .text(function(d){ return d.data.key})
}

function generateManaCurve(arr, el){
var valMax = 0
var cmcMax = 0
arr.forEach(function(v){
	if(v.value > valMax){
		valMax = v.value
	}
	if(parseInt(v.label) > cmcMax){
		cmcMax = parseInt(v.label)
	}
})



var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)


var svg = d3.select(el)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var count = 1;
var arr2 = []
while(count <= cmcMax){
	arr2.push(count)
	count++;
}

  x.domain(arr2);
  y.domain([0, valMax]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
  svg.selectAll(".bar")
      .data(arr)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.label); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); })
   //     .on('mouseover', tip.show)
  	// .on('mouseout', tip.hide)


	
       




	}

function getGraph(map, deck, type){
	getHistogram(map, deck, type, function(histogram){
		console.log(histogram)
	})
}

//MAP =  {"MULTIVERSEID" : "QUANTITY"}
//DECK = "RESULTS FROM DATABASE"
//TYPE IS THE DIMENSION YOU WANT TO HISTOGRAMIFY
function getHistogram(map, deck, type, callback){
var histogram = {}
	console.log(map)
	console.log(deck[0])

	deck.forEach(function(v, i){	
	
			var quant = parseInt(map[v.multiverseid], 0)	
			if(v[type] == undefined){
				if(histogram["other"] == null){
						histogram["other"] = quant
					}
					else{
					histogram["other"] = histogram["other"] + quant;
					}

			}
			else if(v[type].constructor === Array){
				_.each(v[type], function(w){
					if(histogram[w] == null){
						histogram[String(w)] = quant
					}
					else{
					histogram[String(w)] = histogram[String(w)] + quant;
					}
				})


			}
			else{
			if(histogram[v[type]] == null){
				histogram[String(v[type])] = quant
			}
			else{
				histogram[String(v[type])] = histogram[String(v[type])] + quant;
			}		
			}
			
			if(i == deck.length - 1)
				callback(histogram)

			
})
}



function landManaDistro(map,deck){
	var re = /{*}/;
	var obj = {}
	_.each(deck, function(v, i){
		if(v["types"].indexOf("Land") >= 0){
			var flag = false;
			_.each(v.text.split(''), function(d){			
				if(d == '{')
					flag = true
				if(d == '}')
					flag = false

				if(flag && d !=  '{'){
					if(obj[d] == null){
						obj[d] = 1
					}			
					else{
						obj[d] = 1 + obj[d]
					}
				}
			})
		}

		if(i == deck.length - 1){
			//console.log(obj)
		}


	})


}

function calcLandDistribution(deck){
	if(deck == undefined){
		return null
	}
	var histogram = {}
	console.log(deck)
	var countArr = []
	var idArr = []
	var map = {}
	_.each(deck.mainBoard, function(v){
		countArr.push(v.quantity)
		map[v.multiverseid] = v.quantity
		idArr.push(v.multiverseid)

	})
	_.each(deck.sideBoard, function(v){
		countArr.push(v.quantity)
		map[v.multiverseid] = v.quantity
		idArr.push(v.multiverseid)

	})
	console.log(idArr)
	var obj = {}
	console.log(deck.name)
	var stats = {}
	obj["multiverseid"] = {$in : idArr}
	console.log(idArr)
	getHistogramInner(obj, map).then(function(stats){
		if(stats != undefined){
		console.log(stats)
		res.send(stats)
		}
		else
		res.send("ERROR")


	})

}


function getHistogramInner(cards, map){	
console.log(cards)
return new Promise(function (fulfill, reject){
	cardCollection.find(cards, function(err, data){

			var stats = {}
			console.log(map)
			//console.log(data)
			var arr = ["types", "colors", "rarity","setName"]


			Promise.all(arr.map(getHistogram))
			stats["land_histogram"] = landManaDistro(map, data)
			stats["types_histogram"] = getHistogram(map, data, "types")
			stats["colors_histogram"] = getHistogram(map, data, "colors")
			stats["rarity_histogram"] = getHistogram(map, data, "rarity")
			stats["set_histogram"] = getHistogram(map, data, "setName")	
			fulfill(stats)
	})
});



}

module.exports = grapher;