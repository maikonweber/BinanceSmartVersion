const express = require('express');
const app = express();
const redis = require('ioredis');
const client = new redis();
const l = require('./console.js');
const crypto = require('crypto');
const appWs = require('./app-ws');
const cookieParser = require('cookie-parser');
const GeoIp = require('geoip-lite');
const {
    getUser,
    insertOrder,
    verifyLastOrder,
    checkToken,
    createUsers,
    insertUsersToken,
    insertLeads,
    insertLeadLocation,
    checkInToken,
    insertPost,
    selectPostByTitle,
    selectPostById,
    getAllPost
} = require('./db')

const {  kline, newOCO, futureOrder  }= require('./api.js')

const Robot = require('./RedisRobot');

const app3 = new Robot('BTCBUSD', '1h', 30);
const app2 = new Robot('BTCBUSD', '15m', 30);

app3.Init()
app2.Init()

const cors = require('cors');
const port = 3054

app.use(cookieParser())

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cors())


app.get('/api/*', async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    const cookie = req.cookies.cookieName;
    if(cookie) {
    const result = await checkInToken(cookie)
    console.log(result)
    }    
    next();
    
    
});



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

app.post('/api/login', async(request, response) => {
    const browser = request.headers['user-agent']
    const user = request.body.email;
    const pass = request.body.password;
    const data = await getUser(user, pass);
    if (!data) {
      res.status(403).send('Usuário ou senha inválidos');
        return
      } else {
      const token = await insertUsersToken(data, browser, true);
      response.send(token.token).status(200);
      }
});

app.use('/api/v3/*', async (request, response, next) => {
    console.log(request);
    const token = request.headers.token;
    const check  = await checkToken(token)
    if (check) {
        next();
      } else {
        response.send('You need to login to access this page');
      } 
})

// Send Post 

app.post('/api/v3/sendPost', async (request, response) => {
    const { Text, img, title } = request.body
    console.log(Text, img, title,"request");
    try {
    const post = await insertPost(Text, img, title);
    response.send("True");
    } catch {
    response.send("False");
    }
})

app.get('/api/allPost', async (req, res) => {
    const allPost = await getAllPost();
    res.send(allPost).status(200);
})

app.get('/api/getpost/:id', async (req, res ) => {
    const id = req.params['id'];
    const result = await selectPostById(id);
    res.send(result).status(200);
})

app.get('api/getpost/:title', async (req, res) => {
    const title = req.params['title']
    const result = await selectPostByTitle(title);
    res.send(result).status(200);
})

// GeoIp and Reference of users
// lastPage.textContent = document.referrer;

app.post('/api/accept_cookie', async (req, res) => {
   const cookie = req.cookies.cookieName;
   const info = req.body.info
   const ip = req.headers['x-forwarded-for']
   const host =  req.headers['host']
   const browser = req.headers['user-agent']
   const geo = GeoIp.lookup(ip);
   console.log('Country', + (geo ? geo.country : "Unkown"));
   console.log('Region', + (geo ? geo.region: 'Unkown'));
   var id = crypto.randomBytes(20).toString('hex');
   const information = {
        "ip" : ip,
        "host" : host,
        "browser" : browser,
        "geoInfo" : geo,
        "info" : info
     }

    await insertLeadLocation(id, information, ip)
    console.log('cookie created succesfully');
    res.cookie('cookieName', id, { maxAge : 90000, httpOnly: true })
    res.send(JSON.stringify({status: "OK"}))
  
})

// API Binance 


app.get('/api',  async (req, res) => {   
    const symbol = 'BTCBUSD'
    const interval = '1h'
    try {
    const result = await client.get(`${symbol.toUpperCase()}_candle_${interval}`);
    res.send(result);
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


// API PARA CRIAR PRIMEIRO USUARIOS

app.use('/api/v2/*', (req, res, next) => {
    console.log(req.headers);
    const token = req.headers.token;
    if (token === '551576') {
        next();
      } else {
        res.send('You need to login to access this page');
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


    
app.post("/api/v2/createus", async (req, res) => {
    const { email, password, name, username, phone, address } = req.body;
    console.log(email, password, name, username, phone, address)
    let result = await createUsers(email, password, name, username, phone, address);
    res.send(result);
  })




app.listen(port, () => {
console.log('App Express is Running')
})

appWs(app)