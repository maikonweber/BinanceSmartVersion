const { Pool } = require("@material-ui/icons");
var pg = require("pg");



var client = new pg.Client({
  user: "postgres",
  password: "mara128sio4",
  database: "binance",
  port: 5735,
  host: "0.0.0.0",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();


async function insertOrder(pair, type, amount, price, stop, orderExec, Buy, tim) {
    const client = await pool.connect()
    try {
        const result = await client.query('INSERT INTO ordersBuy(pair, type, amount, price, stop, orderExec, Buy) VALUES ($1, $2, $3, $4, $5, $6, $7)', 
        [price, type, amount, price, stop, orderExec, Buy])
        
    } catch (err) {
        console.log(err)
    } finally {
        return result.rows
    }

    async function sellOrder(pair, type, amount, price, stop, OCOgain, OCOloss, orderExec, time) {
        try {
            const result = await client.query('INSERT INTO SellOrder(pair, type, amount, price, stop, gain, loss,orderExec, time) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)', 
            [pair, type, amount, price, stop, OCOgain, OCOloss,orderExec, time])
        }   catch (err) {
            console.log(err)
        }

    }



}

module.exports = {  
    insertOrder,
    sellOrder
}



