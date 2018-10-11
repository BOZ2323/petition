// var spicedPg = require('spiced-pg');
// const bcrypt = require('bcryptjs');
// const {spicedling, password} = require('./secrets');
// var db = spicedPg(`postgres:${spicedling}:${password}@localhost:5432/petition`);

const spicedPg = require('spiced-pg');
const bcrypt = require('bcryptjs');
let secrets;
let dbUrl;
if (process.env.NODE_ENV === 'production') {
    secrets = process.env;
    dbUrl = secrets.DATABASE_URL;
} else {
    secrets = require('./secrets.json');
    dbUrl = `postgres:${secrets.spicedling}:${secrets.password}@localhost:5432/sage`;
}
const db = spicedPg(dbUrl);




exports.submitSignature = function(signature, user_id){
    console.log("signature",signature);
    return db.query(
        `INSERT INTO signatures (signature, user_id)
        VALUES ($1,$2) RETURNING id`,
        [signature, user_id]
    );

};

exports.getHashedPasswordfromDB = function(email){
    let q = `SELECT password FROM users WHERE email = $1`;
    let params = [email];
    return db.query(q, params);

};
exports.getPicture = function(user_id){
    let q = `SELECT signature FROM signatures WHERE user_id = $1`;
    let params = [user_id];
    return db.query(q, params);

};
// exports.getProfileData = function(user_id){
//     let q = `SELECT * FROM user_profiles WHERE user_id = $1`;
//     let params = [user_id];
//     return db.query(q, params);
//
// };

exports.submitProfileData = function(age, city, url, user_id){
    console.log("db.query: age",age);
    return db.query(
        `INSERT INTO user_profiles (age, city, url, user_id)
        VALUES ($1,$2,$3,$4) RETURNING id`,
        [age, city, url, user_id]
    );

};

exports.getIdfromDB = function(email){
    let q = `SELECT * FROM users WHERE email = $1`;
    let params = [email];
    return db.query(q, params);

};
exports.getUserNamefromDB = function(id){
    let q = `SELECT first FROM users WHERE id = $1`;
    let params = [id];
    return db.query(q, params);

};

exports.signersList = function(){
    return db.query(
        `SELECT COUNT(*) FROM signatures`
    ).then(num => {
        return num.rows[0].count;
    });

};
//when calling signerList in server.js
//db.signerList().then(result =>{
//let signers = result.row
//pass the result back into the handlebars, loop through it

exports.insertNewUser = function(first, last, email, hashedPw) {
    const q = `
        INSERT INTO users
        (first, last, email, password)
        VALUES
        ($1, $2, $3, $4)
        RETURNING id
    `;
    const params = [
        first || null,
        last || null,
        email || null,
        hashedPw || null
    ];

    return db.query(q, params);
};

exports.hashPassword = function(plainTextPassword) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(function(err, salt) {
            if (err) {
                return reject(err);
            }
            bcrypt.hash(plainTextPassword, salt, function(err, hash) {
                if (err) {
                    return reject(err);
                }
                resolve(hash);
            });
        });
    });
};

exports.checkPassword = function(textEnteredInLoginForm, hashedPasswordFromDatabase) {
    return new Promise(function(resolve, reject) {
        bcrypt.compare(textEnteredInLoginForm, hashedPasswordFromDatabase, function(err, doesMatch) {
            if (err) {
                reject(err);
            } else {
                resolve(doesMatch);
            }
        });
    });
};



//
// module.exports.signPetition = function(signature){
// return dbUrl.query(
//     "INSERT INTO signatures(signature, first, last) VALUES ($1, $2, $3) RETURNING id",[signature]
//
//     return results.rows[0].id;
//
// }).catch((err) => {
//     console.log("",err);
// })
