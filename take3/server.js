const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const hb = require('express-handlebars')
const db = require('./db')

app.engine('handlebars', hb())
app.set('view engine', 'handlebars')
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/register', (req, res) => {
    res.render('register', {
        layout: 'main'
    })
})

app.post('/register', (req, res) => {
    db.hashPassword(req.body.password)
        .then(hash => {
            db.insertNewUser(req.body.firstname, req.body.lastname, req.body.email, hash)
                .then(results => {
                    console.log("here are my results", results.rows);
                    // you would set the session here!
                    // req.session.userId = results.rows[0].id
                })
                .catch(err => console.log(err.message))
        })
})

app.listen(8080, () => {
    console.log('Glistening on port 8080')
})
