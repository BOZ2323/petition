const redis = require('redis');
const client = redis.createClient({
    host: 'localhost',
    port: 6379
});

client.on('error', function(err) {
    console.log(err);
});

const get = exports.get = promisify(client.get).bind(client);
const get = exports.setex = promisify(client.setex).bind(client);
const get = exports.del = promisify(client.del).bind(client);

client.get('funky', function(err, data){
    if(err){
        console.log('error');
    }else{
        console.log(data);
    }
});

get ('funky').then
