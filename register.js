var { Pool, Client } = require("pg");
const hasher = require('./hasher')
const crypto = require('crypto');



var client = new Pool({
            user: "binance",
            password: "binance",
            database: "binance",
            port: 5832,
            host: "localhost",
            ssl: false
});

const query = `
   INSERT INTO sportRegister ()
`




const objectDecision = {
            "Spot": async () =>  {
            
            },

            "Future": async ()  => {
            }

}

