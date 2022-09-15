const express = require('express');
const app = express();
const redis = require('ioredis');
const client = new redis();
const l = require('./console.js');
const appWs = require('./app-ws');
const {  kline, newOCO, futureOrder  }= require('./api.js')
const Robot = require('./RedisRobot');

const app3 = new Robot('BTCBUSD', '1h', 30);
const app2 = new Robot('BTCBUSD', '15m', 30);
const app4 = new Robot('BTCBUSD', '1h', 30);

app3.Init()
app2.Init()
app4.Init()

const cors = require('cors')
const port = 3054

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


app.get('/',  async (req, res) => {   
    const symbol = 'BTCBUSD'
    const interval = '1h'
    try {
    const result = await client.get(`${symbol.toUpperCase()}_candle_${interval}`);
    res.json(result);
    } catch {
    res.json("not included")
    }
});

app.post('/full_candle', async (req, res) => {
    const { symbol, interval } = req.body;
    const result = await client.get(`${symbol.toLowerCase()}_full_analizer_${interval}`);
    res.send(result);
});

app.post('/current_analizer', async (req, res) => {
    const { symbol, interval } = req.body;
    const result = await client.get(`${symbol.toLowerCase()}_current_analizer_${interval}`);
    res.send(result);
});

app.post('/current_candle', async (req, res) => {
    const { symbol, interval } = req.body;
    const result = await client.get(`${symbol.toLowerCase()}_current_${interval}`);
    res.send(result);
});

// app.post('/btcbusd', async (req, res) => {
//     const { symbol } = req.body;
//     const result = await client.get(`${symbol.toLowerCase()}`);
//     res.send(result);
// })

app.get('/btcbusd', async (req, res) => {
    const symbol = 'BTCBUSD'
    const interval = '15m'
    const limit = 60
    try {
    const resulto = await kline(symbol, interval, limit)
    console.log(resulto)
    res.json(resulto)
    } catch (err) {
        res.status(504).json(err, res)
    }
})

app.post('/analizer', async (req, res) => {
    console.log(req)
    const { symbol, interval, limit } = req.body
    const app = new Robot(symbol.toUpperCase(), interval, limit)
    app.Init()
})

app.post('/futureOrder', async (req, res) => {
    const {
        symbol,  // Symbol
        side, // BUY or SELL
        positionSide, // LONG or SHORT
        type, // MARKET or LIMIT
        quantity, // Quantity
        price,// Price
        timeInForce, // GTC, IOC, FOK -  No Mandatory
        workingType, // 1 or 2 -  No Mandatory
        callBackRate,  // 0.1 or 0.2 -  No Mandatory
        priceProtection    
    } = req.body

    const response =  await futureOrder(symbol.toUpperCase(), quantity, side, positionSide, price)
    res.json("Good Luck")
})


app.listen(port, () => {
console.log('App Express is Running')

})

appWs(app)