var spicedPg = require('spiced-pg');
const {spicedling, password} = require('./secrets');
var db = spicedPg(`postgres:${spicedling}:${password}@localhost:5432/petition`);





exports.submitSignature = function(firstname, lastname, signature){
    return db.query(
        `INSERT INTO signatures (first, last, signature)
        VALUES($1,$2,$3) RETURNING id`,
        [firstname || null , lastname || null , signature || null ]
    );

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