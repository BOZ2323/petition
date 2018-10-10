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

// const http = require('http');
// const fs = require('fs');
// const path = require('path');
const hb = require('express-handlebars');



app.engine('handlebars', hb());
app.set('view engine', 'handlebars');
app.use(express.static('public'));
app.use(require('body-parser').urlencoded({
    extended: false
}));
app.use(require('cookie-parser')());


// everything after the function declaration
// in line 12 is technically middleware since it modifies a user request.

app.get('/', (req, res) => {
    res.render('home', {
        layout: 'main',
        title: "home"
    });
});



app.get('/supporter', checkForRegistrationOrLogin, (req, res) => {
    console.log("req session:", req.session);
    res.render('supporter', {
        layout: 'main',
        title: "PETITION"
    });
});

function checkForRegistrationOrLogin(req,res,next){
    if(!req.session.first){
        res.redirect('/register');
    }else{
        next();
    }
}
function checkIfAlreadyLoggedIn(req,res,next){
    if(!req.session.first){
        res.redirect('/petition/signers');
    }else{
        next();
    }
}
app.get('/thankYou', (req, res) => {
    console.log("Thankyou page");
    db.getPicture(req.session.userId)
        .then(result => {
            res.render('thankYou', {
                layout: 'main',
                signature: result.rows[0].signature
            })

        })
        .catch(err => console.log("error in get/thankYou", err.message));
});

app.post('/petition', (req, res) => {
    // console.log("req.session ",req.session);
    let sig= req.body.hidden;
    console.log("sig", sig);
    db.submitSignature(sig, req.session.userId)

        .then(result => {
            // req.session.signatureId = result.rows[0].id;
            res.redirect('/thankYou');
        })
        .catch(err => console.log("this catch",err.message));
});


app.get('/petition', (req, res) => {
    // console.log("first",req.session.first);
    res.render('petition', {
        layout: 'main',
        firstname: req.session.first
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

app.get('/profile', checkForRegistrationOrLogin, (req, res) => {
    res.render('profile', {
        layout: 'main'

    });
});



app.post('/register', (req, res) => {
    console.log(req.body);
    db.hashPassword(req.body.password)
        .then(hash => {
            db.insertNewUser(req.body.first, req.body.last, req.body.email, hash)

                .then(results => {
                    // console.log("here are my results", results.rows);
                    req.session.userId = results.rows[0].id;
                    req.session.firstname = req.body.first;
                    req.session.lastname = req.body.last;
                    req.session.first = req.body.first;
                    // console.log(req.session);
                    res.redirect('/profile');
                    // you would set the session here!
                    // req.session.userId = results.rows[0].id
                })
                .catch(err => console.log(err.message));

        });
});


app.post('/login', (req, res) => {
    console.log("login works!!");
    db.getHashedPasswordfromDB(req.body.email)
        .then(result => {
            return db.checkPassword(req.body.password, result.rows[0].password);
            // compares entered password with hashed password
        })
        .then(answer => {
            if (answer) { //if it is true go on here and get the user ID
                console.log("is true: ", answer);
                db.getIdfromDB(req.body.email).then(result => {
                    console.log("result NEU", result.rows[0].id);
                    req.session.userId = result.rows[0].id;
                    req.session.first = result.rows[0].first;
                    console.log("*********",result.rows[0]);
                    res.redirect("/petition");
                });
            } else { //if it false go on here
                console.log("Incorrect Password");
                res.render("login", {
                    layout: "main",
                    error: "error"
                });
            }
        });
});

app.post('/profile', (req, res) => {
    console.log("profile works");
    console.log("first", req.session.first);
    let age = req.body.age;
    let city = req.body.city;
    let url = req.body.url;
    db.submitProfileData(age, city, url, req.session.userId)
    .then(result => {
        // req.session.signatureId = result.rows[0].id;
        res.redirect('/petition');
    })
    .catch(err => console.log("this catch",err.message));
});




app.listen(8080, () => {
    console.log('Glistening on port 8080');
});

/////////// console.log to get rid of red dot linter terror //
