express = require('express')
router = express.Router()
auth = require('./auth.js')
decks = require('./decks.js')
cards = require('./cards.js')
users = require('./users.js')
comments = require('./comment.js')
ratings = require('./ratings.js')
analytics = require('./analytics.js')
lists = require('./lists.js')

###
# Routes that can be accessed by any one
###


router.post '/analytics/create', analytics.createEntry

router.get '/mtg/analytics', analytics.getEntries



router.post '/login', auth.login

router.post '/api/user', users.create
router.post '/update/recover/user', users.updatePassword
router.get '/api/recover/user', users.getByCriteria
router.delete '/api/v1/user/:username', users.delete

router.post '/mtg/decks/create', decks.create
router.get '/mtg/deck/card', decks.getDecksByCard
router.get '/mtg/deck/price/timeline/:id', decks.getPriceTimeLime
router.get '/mtg/deck/stats/:id', decks.getStats
router.get '/mtg/decks', decks.getDecks
router.get '/decks/format/:format/:page', decks.getByFormat
router.get '/decks/user/:username', decks.getDecksByUser
router.post '/mtg/update/deck', decks.updateDeck
router.post '/mtg/update/rating/deck', decks.updateDeckRating

router.get '/mtg/user/lists', lists.getListsByUser
router.post '/mtg/user/lists/create', lists.createList
router.post '/mtg/user/lists/update', lists.updateList

router.get '/mtg/decks/trending', decks.getTrendingDecks

router.post '/password/recover', users.recoverPassword 


router.post '/ratings/create', ratings.createRating
router.get '/ratings/card', ratings.getCardRating
router.get '/ratings/users/card', ratings.getAllCardRatings
router.get '/ratings/deck', ratings.getDeckRating
router.get '/ratings/users/deck', ratings.getAllDeckRatings




router.get '/mtg/price/card', cards.getCardPrice


router.post '/comments/create', comments.createComment
router.get '/comments/card/:name', comments.getComments


router.post '/mtg/update/card', cards.updateCard
router.get '/image', cards.getFromList
router.get '/mtg/recommends/list', cards.getRecommendedCardsFromList
router.get '/mtg/recommend/cards', cards.getRecommendedCards
router.get '/mtg/sets', cards.getSets
router.get '/mtg/all/cards', cards.getAll
router.get '/mtg/cards', cards.getByName
router.get '/mtg/types', cards.getTypes
router.get '/mtg/cards/typeahead', cards.getTypeAhead
router.get '/mtg/keywords', cards.getKeywords
router.get '/mtg/subtypes', cards.getSubtypes


module.exports = router

 