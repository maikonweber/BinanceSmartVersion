const consumerRoleta = require('./consumerFinished');
const Redis = require('ioredis');
const redis = new Redis()
var pg = require('pg');


let client = {
    host: 'localhost',
    port: 5832,
    database: 'binance',
    user: 'binance',
    password: 'binance'
};


let pool = new pg.Pool(client);

const consumer = new  consumerRoleta(pool, redis, 'msg');
consumer.intervalInit(18000);

