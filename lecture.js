const spicedPg = require('spiced-pg');
const db = spicedPg('postgres:dbUser:letmein@localhost:5432/sage');

db.query(
     `SELECT * FROM cities`
).then(
    result => console.log(result)
).catch(
    err => console.log(err);
)



.then (
    ({rows}) => {
        rows.forEach(
            row => console.log("hey");
        )
    }
}


db.query(
     `INSERT INTO cities (city, population)`
     .then (
         ({rows}) => {
             rows.forEach(
                 row => console.log("hey");
             )
         }
     }
).catch(
    err => console.log(err);
)





exports.getCityByName(name){
    return db.query(
        `SELECT * FROM cities `
    )
}

app.get()

const rows = result rows //is the same as ({rows}) this destructering

$1   ///user intput name
[name]

exports.getCityByName(name){
    return db.query(
        `SELECT * FROM cities WHERE name = $1`
    [name]   )
}

CREATE TABLE signature(
			id SERIAL PRIMARY KEY,
			first VARCHAR(100)
			last VARCHAR(200)
			signature TEXT

);
