var { Pool, Client } = require("pg");


var client = new Pool({
  user: "binance",
  password: "binance",
  database: "binance",
  port: 5832,
  host: "localhost",
  ssl: false
});


async function insertOrder(symbol, side, price, quantity, ordertype, ) {
    console.log('insertOrder');
    const queryString = `INSERT INTO openorder (symbol, side, price, quantity, ordertype) 
    VALUES ($1, $2, $3, $4, $5)`;
    const values = [symbol, side, price, quantity, ordertype];
    var result = await client.query(queryString, values);
    console.log(result.rowCount);

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



