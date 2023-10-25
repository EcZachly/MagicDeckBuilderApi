express = require('express')
path = require('path')
logger = require('morgan')
_ = require('lodash')
favicon = require('serve-favicon')
bodyParser = require('body-parser')
request = require('request')
fs = require('fs')
CronJob = require('cron').CronJob
cardCollection = require('./routes/database.js').get("Cards")
priceCollection = require('./routes/database.js').get("Prices")

app = express()
app.use logger('dev')
http = require('http').Server(app);
app.use bodyParser.json({limit: '50mb'})
app.use(express.static('public'));

app.get '/socket', (req, res) ->
  res.sendFile __dirname + '/public/socket.io/node_modules/socket.io-client/socket.io.js'
  return
app.get '/view', (req, res) ->
  res.sendFile __dirname + '/public/view.html'
  return

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.all '/*', (req, res, next) ->
  # CORS headers
  res.header 'Access-Control-Allow-Origin', '*'
  # restrict it to the required domain
  res.header 'Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS'
  # Set custom headers for CORS
  res.header 'Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key'
  if req.method == 'OPTIONS'
    res.status(200).end()
  else
    next()
  return


app.get '/', (req, res)->
  res.send(fs.readFileSync('./views/recommendations.html', 'utf-8'))

# Auth Middleware - This will check if the token is valid
# Only the requests that start with /api/v1/* will be checked for the token.
# Any URL's that do not follow the below pattern should be avoided unless you 
# are sure that authentication is not needed
app.all '/api/v1/*', [ require('./middleware/validateRequest') ]
app.use '/', require('./routes')
# If no route is matched by now, it must be a 404
app.use (req, res, next) ->
  # console.log(res)
  # err = new Error('Not Found')
  # err.status = 404
  # next err
  return
# Start the server
app.set 'port', process.env.PORT or 3001
server = app.listen(app.get('port'), ->
  console.log 'Express server listening on port ' + server.address().port
  return
)


job = new CronJob('00 30 3 * * 1-7', ()->
  console.log("Started Job")
  getCardsAndUpdate()
  return
, (() ->
  console.log "DONE"
  return
),  
  start: false,
  timeZone: 'America/Los_Angeles'
)
job.start()

getCardsAndUpdate = ()->
  console.log("STARTED")
  cardCollection.find {}, (err, data)->
    console.log(data.length)
    if(data != undefined)
      data.forEach (v, i)->
        if(v.set != undefined)
          v.set.forEach (set)->
            getPrice(set, v.name)
        else
          console.log("UNDEFINED SETS FOR " + v.name)


getPrice = (set, name) ->
  request 'http://partner.tcgplayer.com/x3/phl.asmx/p?pk=MAGICVIEW&s=' + set + '&p=' + name, (err, price) ->
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
                console.log("SAVED IN SET " + JSON.stringify(saved))
            )
            
    return
  return

