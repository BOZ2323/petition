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

function requireSignature(req,res,next){
    if(!req.session.signatureId){
        res.redirect('/petition');
    }else{
        next();
    }
}
function requireNotSigned(req,res,next){
    if(req.session.signatureId){
        res.redirect('/thankYou');
    }else{
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home', {
        layout: 'main',
        title: "home"
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
app.get('/logout', (req,res) => {
    req.session = null;
    res.render('logout', {
        layout: 'main'

    });
});

app.get('/login', (req, res) => {
    res.render('login', {
        layout: 'main'

    });
});

app.post('/login', requireSignature, (req, res) => {
    console.log("login works!!");
    db.getHashedPasswordfromDB(req.body.email)
        .then(result => {
            console.log("********* req.body.password, result.rows[0].password",req.body.password, result.rows[0].password);
            return db.checkPassword(req.body.password, result.rows[0].password);

            // compares entered password with hashed password
        })
        .then(answer => {
            if (answer) { //if it is true go on here and get the user ID
                console.log("is true: ", answer);
                db.getIdfromDB(req.body.email).then(result => {
                    req.session.userId = result.rows[0].id;
                    req.session.first = result.rows[0].first;
                    // res.redirect("/petition");
                    return db.checkForSignature(result.rows[0].id).then(sigId => {
                        if (sigId) {
                            req.session.signatureId = sigId;
                            res.redirect('/thankYou');
                        } else {
                            res.redirect('/profile');
                        }
                    });
                });
            } else {
                res.redirect('/register');
            }
        })
        .catch(err => {console.log(err);});
});
/////////////////
app.use(checkForRegistrationOrLogin); /////////////do not cross when not registered or logged in
//////////////////

app.get('/petition', (req, res) => {
    console.log("is there a cookie: ",req.session);
    res.render('petition', {
        layout: 'main',
        firstname: req.session.first
    });
});

app.post('/petition', (req, res) => {
    // console.log("req.session ",req.session);
    let sig= req.body.hidden;
    console.log("sig", sig);
    db.submitSignature(sig, req.session.userId)

        .then(result => {
            req.session.signatureId = result.rows[0].id;
            res.redirect('/thankYou');
        })
        .catch(err => console.log("this catch",err.message));
});

app.get('/thankYou', (req, res) => {
    console.log("Thankyou page");
    db.signersCount()
        .then(count => {
            console.log("thankyou, count: ",count);
            db.getPicture(req.session.userId)
                .then(result => {
                    res.render('thankYou', {
                        layout: 'main',
                        signature: result.rows[0].signature,
                        count: count

                    });
                    // res.redirect('/supporter');
                })
                .catch(err => console.log("error in get/thankYou", err.message));
        });
});//app.get





/////// list of all supporters from database ///////////////
app.get('/supporter', (req, res) => {

    db.getSignersList(req.session.userId)
        .then(signedUsers => {

            res.render('supporter', {
                layout: 'main',
                signedUsers: signedUsers.rows,
                age: signedUsers.rows[0].age,
                city: signedUsers.rows[0].city,
                url: signedUsers.rows[0].url
            });

        })
        .catch(err => console.log("error in get/supporter", err.message));
});

/////// click on city and all users from that city are displayed ///////////////
app.get('/supporter/:city', (req, res) => {
    console.log("req.params", req.params);
    console.log("city req session:", req.session);
    db.getSignersFromCity(req.params.city)
        .then(selectedSigners => {
            console.log("selectedSigners", selectedSigners.rows);
            // console.log("age", selectedSigners[0].rows);
            res.render('city', {
                layout: 'main',
                selectedSigners: selectedSigners.rows,
                city: req.params.city
            });

        })
        .catch(err => console.log("error in get/supporter/:city", err.message));
});








app.get('/profile', (req, res) => {
    res.render('profile', {
        layout: 'main'

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
            console.log(result);
            res.redirect('/petition');
        })
        .catch(err => console.log("this catch",err.message));
});

app.get('/myprofile', checkForRegistrationOrLogin, (req, res) => {
    console.log("GET myprofile is working");
    db.checkProfileData(req.session.userId)
        .then(updatedUsers => {
            console.log("updatedUsers", updatedUsers);
            res.render('myprofile', {
                layout: 'main',
                signedUsers: updatedUsers.rows,
                age: updatedUsers.rows[0].age,
                city: updatedUsers.rows[0].city,
                url: updatedUsers.rows[0].url
            });

        })
        .catch(err => console.log("error in get/myprofile", err.message));

});
app.post('/myprofile', (req, res) => {
    console.log("req.body", req.body);
    console.log("req.session", req.session);//
    let age = req.body.age; //body is on POST whatever they filled in the form
    let city = req.body.city;
    let url = req.body.url;
    db.updateProfile(req.session.userId, age, city, url )
        .then(result => {
            console.log(result);
            res.redirect('/');
        })
        .catch(err => console.log("POST /myprofile error",err.message));
});



app.listen(process.env.PORT || 8080, () => {
    console.log('Glistening on port 8080');
});
