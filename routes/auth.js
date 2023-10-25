var jwt = require('jwt-simple');
var db = require('./database.js')
var userCollection = db.get("Users");
var Promise = require('promise')
var auth = {
  login: function(req, res) {
    console.log(Object.keys(req))
    console.log(req.body)
    var user = req.body
    var query = {}
    if(user.username != undefined){
      query["username"] = user.username
    }
    else if(user.email != undefined){
        query["email"] = user.email
    }

    if(user.password != undefined){
      query["password"] = user.password
    }
    else if(user.facebook_id != undefined){
      query["facebook_id"] = user.facebook_id
      query["facebook_token"] = user.facebook_token
    }
    else{
      res.json(500, "no password")
      return
    }

    auth.validate(query).done(function(d){
      //GENERATE A TOKEN FOR THE USER
      console.log(d)
      var dbuser = genToken(d);
      console.log(dbuser)
      res.body = dbuser
      res.send(dbuser)

    }, function(err){
      res.status(403).json(500, "INVALID credentials")

    })
  },
  validate: function(query) {
    return new Promise(function (fulfill, reject){
    userCollection.find(query, function(err, data){
      if(data.length == 0){
        reject(err)
      }
      else{
        fulfill(data[0])
      }
    })
    });
  },
  validateUser: function(username, callback) {
    userCollection.find({"username": username}, function(err, data){
      if(data.length == 0){
        callback(null)
      }
      else{
        callback(data)
      }
    })
    }
}


function generateResponse(user){
 if (!user) { // If authentication fails, we send a 401 back
      res.status(401);
      res.json({
        "status": 401,
        "message": "Invalid credentials"
      });
      return;
    }
    if (user) {
      var token = genToken(user)
      res.json(token);
    }
}

// private method
function genToken(user) {
  var expires = expiresIn(180); // 7 days
  var token = jwt.encode({
    exp: expires
  }, require('../config/secret')());
  user["token"] = token
  user["expires"] = expires
  return user
}

function expiresIn(numDays) {
  var dateObj = new Date();
  return dateObj.setDate(dateObj.getDate() + numDays);
}

module.exports = auth;