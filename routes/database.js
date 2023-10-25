var mongo = require('mongodb');
var monk = require('monk');
var url = "mongodb://Zach:1147798@ds047593-a0.mongolab.com:47593,ds047593-a1.mongolab.com:47593/heroku_wq52rx93?replicaSet=rs-ds047593"
var db = monk(url);
module.exports = db;