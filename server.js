const express = require('express');
const app = express();
const redis = require('ioredis');
const client = new redis();
const l = require('./console.js');

const appWs = require('./app-ws');

const {
    getUser,
    insertOrder,
    verifyLastOrder,
    checkToken,
    createUsers,
    insertUsersToken,
    insertLeads

} = require('./db')

const {  kline, newOCO, futureOrder  }= require('./api.js')

const Robot = require('./RedisRobot');

const app3 = new Robot('BTCBUSD', '1h', 30);
const app2 = new Robot('BTCBUSD', '15m', 30);

app3.Init()
app2.Init()

const cors = require('cors')
const port = 3054

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.get('/api/v1', (req, res) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

});


app.use('/api/v2/*', (req, res, next) => {
    console.log(req.headers);
    const token = req.headers.token;
    if (token === '551576') {
        next();
      } else {
        res.send('You need to login to access this page');
      }

    })


app.post("/api/v2/createus", async (req, res) => {
    const { email, password, name, username, phone, address } = req.body;
    console.log(email, password, name, username, phone, address)
    let result = await createUsers(email, password, name, username, phone, address);
    res.send(result);
  })

  -

// Send Lead   
app.post('/api/v1/sendLead', async (request, response) => {
    
    const first_name = request.body.first_name;
    const last_name = request.body.last_name;
    const phone = request.body.phone;
    const email = request.body.email;
    const message = request.body.message;

    const data = await insertLeads(first_name, last_name, phone, email, message);
    if (data === true) {
        return response.json({
            status: 'success',
            data: data
        });
    } else {
        return response.json({
            status: 'error',
        });
    }
});

// Login 

app.post('/api/v3/login', async(request, response) => {
    const user = request.body.email;
    const pass = request.body.password;
    const data = await getUser(user, pass);
    if (data === false) {
      res.status(403).send('Usuário ou senha inválidos');
        return
      } else {
      const token = await insertToken();
      response.send(token).status(200);
      }
});



// API Binance 


app.get('/api',  async (req, res) => {   
    const symbol = 'BTCBUSD'
    const interval = '1h'
    try {
    const result = await client.get(`${symbol.toUpperCase()}_candle_${interval}`);
    res.json(result);
    } catch {
    res.json("not included")
    }
});

app.post('/api/v3/full_candle', async (req, res) => {
    const { symbol, interval } = req.body;
    const result = await client.get(`${symbol.toLowerCase()}_full_analizer_${interval}`);
    res.send(result);
});

app.post('/api/v3/current_analizer', async (req, res) => {
    const { symbol, interval } = req.body;
    const result = await client.get(`${symbol.toLowerCase()}_current_analizer_${interval}`);
    res.send(result);
});

app.post('/api/v3/current_candle', async (req, res) => {
    const { symbol, interval } = req.body;
    const result = await client.get(`${symbol.toLowerCase()}_current_${interval}`);
    res.send(result);
});

app.get('/api/v3/btcbusd', async (req, res) => {
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


app.post('/api/v2/futureOrder', async (req, res) => {
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