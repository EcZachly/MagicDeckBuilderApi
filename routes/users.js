var db = require('./database.js')
var jwt = require('jwt-simple');
var userCollection = db.get('Users');
var deckCollection = db.get('Decks');
var emailCollection = db.get('Emails');
var Promise = require('promise')


var nodemailer, transporter;

nodemailer = require('nodemailer');

transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'deckbuilderio@gmail.com',
    pass: 'Password1234999'
  }
});


var users = {
  getAll: function(req, res) {
      if(req.query.zachPass != undefined){
      console.log("Connected correctly to server");
      var userArr = []
      userCollection.find({}, function(err, data){
        data.forEach(function(d){
          userArr.push(d)
          if(userArr.length == data.length){
            res.json(userArr)
          }
        })
      })
      }
      else{
        res.send("UNAUTHORIZED")
      }
  },
  getOne: function(req, res) {
    var username = req.params.username;
    console.log("Connected correctly to server");
      var userArr = []
      userCollection.find({"username": username}, function(err, data){
        data.forEach(function(d){
          userArr.push(d)
          if(userArr.length == data.length){
            res.json(userArr)
          }
        })
      })
  },
  create: function(req, res) {
    var obj = req.body
    var device_id2 = req.body.device_id
    var facebook_id = req.body.facebook_id
    var query = {}

    if(obj.username == undefined){
      query["facebook_id"] = facebook_id
      obj["email"] = facebook_id
      obj["username"] = facebook_id
    }
    else{
      query["username"] = obj.username     
    }
        var user = genToken(obj)
        userCollection.insert(user, function(err, userCreated){
          console.log(err)
          console.log(userCreated)
          //HANDLES DUPLICATE EMAIL OR USERNAME ERROR
          if(err != null){  
            console.log(err)
           var response = {}
           response.message = []      
            if(err.err.indexOf("email") > 0){   
              res.json(500, "email")
            }
            if(err.err.indexOf("username") > 0){
             res.json(500, "username")
            }       
             return
          }
          else{
            var json = JSON.stringify(userCreated)
            console.log("CREATED " + json)
            deckCollection.find({"device_id" : device_id2}, function(err, data){             
                data.forEach(function(v, i){
                    deckCollection.findAndModify({query: {"_id" : v._id}, update: {$set : {username : obj.username}}}, function(err, data){
                    })
                    if(i == data.length - 1)
                        res.json(JSON.parse(json))
                })

                if(data.length == 0){
                    res.json(JSON.parse(json))
                }
            })   
         }
        })
      
  },
  update: function(req, res) {
    var user = req.body;
    userCollection.update({ username: user["username"] },
          {$set:{username: user["username"], password: user["password"]}},
          {upsert: true}
          , function(err, created){
              console.log(created)
              res.send(created + " was successfully updated")
      })
  },
  delete: function(req, res) {
    var username = req.params.username
    var response = userCollection.remove({ username: username })
    res.send(response)
  },
  storeEmail:function(req, res){
    req.on('data', function(v){
      var email = bufferToString(v).substring(6)
      console.log(email)
      var obj = {}
      obj["email"] = email
      emailCollection.insert(obj, function(err, data){
        res.send("<h1>Thanks for signing up for the beta! <br/> You should be receiving an email shortly.</h1>")
      })
    })
  },
  recoverPassword : function(req, res) {
    var email = req.body.email;
    userCollection.find({"email": email}, function(err, data){
      if(data.length > 0){
          var recover = makeRecoverString()
          var user = data[0]
          user.recoveryString = recover
          userCollection.update({"_id":user._id}, user, function(err, data){
              sendRecoveryEmail(user, email, recover)
          })
      }
    })
  }, 
  getByCriteria : function(req, res){
     userCollection.find(req.query, {username:1, email:1}, function(err, data){
          var obj = {}
          if(data[0] != undefined){
          obj.recoveryString = data[0].recoveryString
          obj.email = data[0].email
          obj.username = data[0].username

          res.json(obj)
          }
          else
          {
            res.json({error:"email doesn't exist"})
          }
     })
  }, 
  updatePassword : function(req, res){
    var newPassword = req.body.password
      var username = req.body.username
      console.log(req.body)
          userCollection.find({"username":username}, function(err, data){
              var newUser = data[0]
              newUser.password = newPassword
              newUser.recoveryString = makeRecoverString()
              userCollection.update({"username":newUser.username}, newUser, function(err, data){
                       console.log(newUser)
                      res.json(newUser)
              })
         })
     
  }
};

function makeRecoverString()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function sendRecoveryEmail(user, email, recoverString){
  console.log(email)
  console.log(recoverString)
  
  var mailOptions = {
    from: 'Password Recovery <deckbuilderio@gmail.com>',
    to: email,
    subject: 'Password blbkjdflds',
    text: 'To recover your password follow this link http://angularmagicapp.herokuapp.com/recovery/' + recoverString + '/' + user.username,
    html: 'To recover your password follow this link http://angularmagicapp.herokuapp.com/recovery/' + recoverString + '/' + user.username 
  };
  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      return console.log(error);
    }
    return console.log('Message sent: ' + info.response);
  });
}



function bufferToString(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
};

function genToken(user) {
  var expires = expiresIn(14); // 7 days
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

module.exports = users;