var express = require('express');
var app = express();
var db = require('./db');

var cookieSession = require('cookie-session');

app.use(cookieSession({
    secret: `Feel the fear and do it anyway.`,
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
    // console.log('petition with cute animal!');
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

app.get('/petition', (req, res) => {

    res.render('petition', {
        layout: 'main'
    //     title: "PETITION"
    });
});

app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main'

    });
});
app.get('/register', (req, res) => {
    res.render('register', {
        layout: 'main'

    });
});
app.post('/register', (req, res) => {
    console.log(req.body);
    db.hashPassword(req.body.password)
        .then(hash => {
            db.insertNewUser(req.body.first, req.body.last, req.body.email, hash)

                .then(results => {
                    console.log("here are my results", results.rows);
                    req.session.userId = results.rows[0].id;
                    req.session.firstname = req.body.first;
                    req.session.lastname = req.body.last;
                    console.log(req.session);
                    res.redirect('/petition');
                    // you would set the session here!
                    // req.session.userId = results.rows[0].id
                })
                .catch(err => console.log(err.message));

        });
});
///////////////// login /////////////////////////


app.post('/login', (req, res) => {
    console.log("login works!!");
    db.getHashedPasswordfromDB(req.body.email)
        .then(result => {
            return db.checkPassword(req.body.password, result);
        })
        .then(answer => {
            if (answer) {
                console.log("is true: ", answer);
                db.getIdfromDB(req.body.email).then(result => {
                    req.session.user = result;
                    res.redirect("/");
                });
            } else {
                console.log("Incorrect Password");
                res.render("login", {
                    layout: "main",
                    title: "PETITION",
                    error: "error"
                });
            }
        });





});






//this is how we access our cookie, req.session is an object
//we add an property "animal" and the value








app.listen(8080, () => {
    console.log('Glistening on port 8080');
});





//////////// console.log to get rid of red dot linter terror /////
