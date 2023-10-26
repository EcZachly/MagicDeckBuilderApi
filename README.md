# MagicDeckBuilderApi




BASE URL is http://magicapp.herokuapp.com/
FOR ADVANCED SEARCH USE
	http://magicapp.herokuapp.com/mtg/cards?language=en


	THIS TAKES PARAMETERS
	color  [red, black, blue, green, white]
	EXAMPLE --
	http://magicapp.herokuapp.com/mtg/cards?language=en&color=red

	subtypes 
	Get all subtypes from this API CALL http://magicapp.herokuapp.com/mtg/subtypes
	http://magicapp.herokuapp.com/mtg/cards?language=en&subtypes=goblin&color=red

	types 
	Get all avaialble types from this API CALL http://magicapp.herokuapp.com/mtg/types
	http://magicapp.herokuapp.com/mtg/cards?language=en&types=planeswalker

	rarity [common, uncommon, mythic, rare]
	http://magicapp.herokuapp.com/mtg/cards?language=en&rarity=mythic

	set
	Get all available sets from this API CALL http://magicapp.herokuapp.com/mtg/sets
	http://magicapp.herokuapp.com/mtg/cards?language=en&set=Avacyn Restored

	text (AKA search by keyword) Get all availabe keywords from http://magicapp.herokuapp.com/mtg/keywords
	http://magicapp.herokuapp.com/mtg/cards?language=en&text=deathtouch


	format [standard, modern, legacy, vintage, commander]
	http://magicapp.herokuapp.com/mtg/cards?language=en&format=standard


FOR PREDICTIVE TEXT USE THIS
	http://magicapp.herokuapp.com/mtg/cards/typeahead?
	ONLY PARAMETER is q
	RETURNS ALL Cards that start with q


FOR CARD RECOMMENDATIONS 
	http://


FOR DECK LIST USE THIS
	http://magicapp.herokuapp.com/decks/format/{format}/{page}
	PARAMETERS ARE format and page
	HERE's and EXAMPLE 
	http://magicapp.herokuapp.com/decks/format/standard/4

TO GET DECKS BY USERNAME
	http://magicapp.herokuapp.com/api/v1/decks/user/{username}

TO CREATE A DECK USE THIS API CALL
	http://magicapp.herokuapp.com/mtg/decks/create
	THIS TAKES IN A BODY PARAMETER MODELED AFTER 
	DeckModel.java (See android app)

TO CREATE A USER USE THIS API CALL
	http://magicapp.herokuapp.com/api/user
	THIS TAKES IN A BODY PARAMETER MODELED AFTER
	User.java (see Android app)


TO LOGIN USE THIS API CALL 
	http://magicapp.herokuapp.com/login
	THIS TAKES IN A BODY PARAMETER MODELED AFTER
	User.java (see Android app)
