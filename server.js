var express = require('express');
var app = express();
var db = require('./db');

var cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 14
}));
//in the POST petition route we get the req.session.signatureId =id; and put it in our session
//in the thankyou, write database query, to receive users id and in return give us users signature
// this signature is the url

const http = require('http');
const fs = require('fs');
const path = require('path');
const hb = require('express-handlebars');
const projects = __dirname + '/projects';


app.engine('handlebars', hb());
app.set('view engine', 'handlebars');

app.use(express.static('public'));


app.use(require('body-parser').urlencoded({
    extended: false
}));
app.use(require('cookie-parser')());


// In fact, everything after the function declaration
// in line 12 is technically middleware since it modifies a user request.

app.get('/', (req, res) => {
    res.render('home', {
        layout: 'main',
        title: "PETITION"
    });
});

app.get('/thankYou', (req, res) => {
    res.render('thankYou', {
        layout: 'main',
        title: "PETITION"
    });
});
app.get('/supporter', (req, res) => {
    console.log("req session:", req.session);
    res.render('supporter', {
        layout: 'main',
        title: "PETITION"
    });
});
app.post("/", (req, res) => {
    // console.log("REQ BODY: ", req.body);
    res.render("thankYou", {
        layout: "main",
        title: "PETITION"
    });
});


app.get('/petition', (req, res) => {
    console.log('petition with cute animal!');
    res.render('petition', {
        layout: 'main'
    //     title: "PETITION"
    });
});

app.post('/petition', (req, res) => {

    let fname= req.body.firstname;
    let lname= req.body.lastname;
    let sig= req.body.hidden;
    console.log(fname,lname, sig);
    db.submitSignature(fname,lname,sig);
    res.redirect('/');
});

app.get('/cute-animals', (req, res) => {
    console.log('GET cute animals!');
    res.render('cute-animals', {
        layout: 'main',
    //     title: "PETITION"
    });
});
app.post("/cute-animals", (req, res) => {
    console.log("/POST cute animals", req.body.animal);
    req.session.animal = req.body.animal;
    console.log('req.session', req.session);

    //this is how we access our cookie, req.session is an object
    //we add an property "animal" and the value
});







app.listen(8080, () => {
    console.log('Glistening on port 8080');
});





//////////// console.log to get rid of red dot linter terror /////
