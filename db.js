var pg = require("pg");



var client = new pg.Client({
  user: "binance",
  password: "binance",
  database: "binance",
  port: 5832,
  host: "localhost",
  ssl: false
});

client.connect();


async function insertOrder(symbol, side, price, quantity, ordertype, stopprice, target) {
    const client = await pool.connect()
    var result = await client.query(`
    INSERT INTO openorder (symbol, side, price, quantity, ordertype, stopprice, target) 
    VALUES ($1, $2, $3, $4, $5, $6)`, 
    [symbol, side, quantity, price, stopprice, target]);
        
    return result;
};

async function verifyLastOrder(pair, type, amount, price, stop, OCOgain, OCOloss, orderExec, time) {
    const client = await pool.connect()
    var result = await client.query(`
         Select * 
            from 
            openorder
            order by timestamp desc`);

    return result;

};

   

module.exports = {  
    insertOrder,
    verifyLastOrder
}



