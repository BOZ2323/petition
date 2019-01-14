//primary key in another table is a foreign key

// we join the songs ON a singer
// after user registers he immediataly goes to the petition

// there is an optional page for age,city, homepage questions

//create new table for this data and do joins for the database

CREATE TABLE users(

);

CREATE TABLE user_profiles(
    id SERIAL PRIMARY key,
    age INT,
    city VARCHAR (100),
    url VARCHAR (300),
    user_id INT NOT NULL UNIQUE REFERENCES users(id)
);
// we tell this is foreign key
//now remove first and last name, since we got the first and lastname already
//in the users table, remove first and last in signatures table

CREATE TABLE signatures(
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES users(id)
)

// signers page,
//select from signatures, to limit to the people that have already signed.
//but you join users, then you join users_id
// [
// {
//     first: funky',
//     lastname:
//     age:
//     url:
//     city:
// }
// ]
// we only take signatures to limit the list of people, we do not need any further information



SELECT singer.name AS singer_name, songs.name AS song_name,
FROM singers
LEFT join songs
ON singer.id = songs.singer_id;
LEFT JOIN albums
ON albums.id = songs.album_id;

// user_profiles might need a left join

{#if url}
    <a href ="";
{{#else}}}

app.get('/signers', (re))
    res.render(signers)

app.get('/signers/:city', (re))
    const city = req.params.city;
    WHERE city EQUALS $1 //or '=' do no know
    res.render('/signers', {
                signers,
                city
});

berlin
berlin
berlin

WHERE LOWER(city) = LOWER($1)

// login, we used email adress to find the user, we just do not get the signature id, we had to do
//another query to , now you can join the signatures table and get
//now do a left join, if they are in the signatures table then join and if it is not there, you get a null
