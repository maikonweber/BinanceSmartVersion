const { Pool } = require("@material-ui/icons");
var pg = require("pg");



var client = new pg.Client({
  user: "binance",
  password: "binance",
  database: "binance",
  port: 5535,
  host: "localhost",
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();


async function insertOrder(symbol, side, price, quantity, ordertype, stopprice, target) {
    const client = await pool.connect()
    
    try {
        const result = await client.query(`
        INSERT INTO openorder (symbol, side, price, quantity, ordertype, stopprice, target) 
        VALUES ($1, $2, $3, $4, $5, $6)`, 
        [symbol, side, quantity, price, stopprice, target]);
        console.log(result);

    } catch (err) {
        console.log(err)
    } finally {
        return result.rows
    }

    async function verifyLastOrder(pair, type, amount, price, stop, OCOgain, OCOloss, orderExec, time) {
        try {
            const result = await client.query(`
            Select * 
            from 
            openorder
            order by timestamp desc`);
        } catch (err) {
            console.log(err)
        } finally {
            return result.rows[0]
        }
    }



}

module.exports = {  
    insertOrder,
    sellOrder
}



