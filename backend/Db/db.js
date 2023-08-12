const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/iNotebook", {useNewUrlParser: true});

const db = mongoose.connection;

db.on("error", function(){
    console.log("Mongo DB not connected")
})
db.once("open", function(){
    console.log("Successfully connected with mongo db")
})


module.exports = db;