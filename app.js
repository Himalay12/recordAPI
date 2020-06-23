//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//for local host
//mongoose.connect("mongodb://localhost:27017/studentRecord", {useNewUrlParser: true, useUnifiedTopology: true});


// web storage
mongoose.connect(`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0-y70r4.mongodb.net/studentRecord`, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log( 'Database Connected' ))
    .catch(err => console.log( err ));

const recordSchema = new mongoose.Schema({
    Name: String,
    Age: String,
    Std: String
});

const Record = mongoose.model("Record", recordSchema);

//chained route

app.route("/records")
    .get((req, res) => {
        Record.find({}, (err, results) => {
            if(err) throw err;
            res.send(results);
        });
    })
    .post((req, res) => {
        const student = new Record({
            Name: req.query.Name,
            Age: req.query.Age,
            Std: req.query.Std
        });
        
        student.save(err => {
            if(err) res.send(err);
            res.send("Successfully added a new record.");
        });
    })
    .delete((req, res) => {
        Record.deleteMany({}, err => {
            if(err) res.send(err);
            res.send("succesfully deleted all record.");
        });
    });


//////////////////////////////REQUEST TARGETING SPECIFIC Students///////////////////

app.route("/records/:Name")
    .get((req, res) => {
        Record.findOne({Name: req.params.Name}, (err, result) => {
            if(err) res.send;
            else if(result) res.send(result);
            else res.send("Not Found");
        })
    })
    .put((req, res) => {
        Record.update(
            {Name: req.params.Name}, 
            req.query, 
            {overwrite: true}, 
            (err, result) => {
                if(err) res.send(err);
                res.send("successfully overwritten");
        });
    })
    .patch((req, res) => {
        Record.updateOne(
            {Name: req.params.Name}, 
            {$set: req.query}, 
            (err, result) => {
                if(err) res.send(err);
                res.send("successfully updated");
        });
    })
    .delete((req, res) => {
        Record.deleteOne(
            {Name: req.params.Name},
            (err) => {
                if(err) console.log(err);
                else console.log('successfully deleted');
            })
    });

let port = process.env.PORT;

if(port == null || port == "") port = 3000;

app.listen(port, function() {
  console.log(`Server started on port ${port}`);
});