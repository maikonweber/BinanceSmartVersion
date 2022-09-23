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

async function insertPost(Text, Img) {
    let string = `INSERT INTO post (text, img) VALUES ($1, $2)`;
    try {
        const result = await client.query(string, [Text, Img])
        console.log(result)
        return true
    } catch (er) {
        return er
    }
}

async function selectPostByTitle(title) {
    let string = `Select * from post WHERE title ~ $1`;
    try {
    const result = await client.query(string, [title])
    return result.rows
    } catch {
        return [{ erro : "Dont Find by Title" }]
    }
}

async function selectPostById(id) {
    let string = `Select * from post Where id = $1`;
    try {
        const result = await client.query(string, [id])
        return result.rows[0]
    } catch (er) {
        return [{ error : "Dont find by id"}]
    }
}

async function getAllPost() {
    let string = `Select * from post order by created`
    try {
        const result = await client.query(string)
        console.log(result);
        return result.rows
    } catch {
        return [{ error : "Dont find any post"}]
    }
}

async function insertLeads(first_name, last_name, phone, email, message) {
    let string = `INSERT INTO lead 
    (first_name, last_name, email, phone, message) 
    VALUES ($1, $2, $3, $4, $5);` 
    try {
      const result = await client.query(string, [first_name, last_name,  email, phone, message]);
      console.log(result.rows)
      return true
  } catch (err) {
      console.log(err)
  } 
  }


async function checkToken(token) {
  
    console.log(token)
    const query = `SELECT * FROM users_token WHERE token = $1`
    try {
        const result = await client.query(query, [token]);
        if(result.rows[0]) {
        return true
        } else {
        return false
        }
    } catch(e) {
        console.log(e)
    }

}

async function createUsers(email, password, name, username, phone, address) {
  
    const hash = hasher.hasher(password, "")

    const query = `INSERT INTO users(username, name, email, password, sal, phone, address)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
    try {
        const result = await client.query(query, [username, name ,email, hash.hashedpassword, hash.salt, phone, address])
        return result.rows

        } catch(e) {
        console.log(e)
    }

}


async function InsertRoulleteEv (name, number) {
    await client.connect()
    let sql = `INSERT INTO 
    robotevolution (name, number) 
    VALUES ($1, $2) returning id;
    `;

    let result = await client.query(sql, [name, number]);
    
    return result
}


async function insertUsersToken(id, navegator, is_admin) {

    const token = crypto.randomBytes(16).toString('hex')
    console.log(token)
    const query = `INSERT INTO users_token(users_id, token, navegator, is_admin)
                    VALUES ($1, $2, $3, $4) RETURNING *`
    try {
        const result = await client.query(query, [id, token, navegator, true])
        console.log(result.rows[0])
        return result.rows[0]
    } catch(e) {
        console.log(e)
    }
}




async function checkInToken(token) {
    console.log(token);
    const query = `SELECT * FROM lead_location WHERE token = $1`;
    try {
    const result = await client.query(query, [token])
        return result.rows[0]
    } catch (e) {
        return console.log(e)
    }
}

async function checkToken(token) {
    console.log(token)
    const query = `SELECT * FROM users_token WHERE token = $1`
    try {
        const result = await client.query(query, [token]);
        return result.rows[0]
    } catch(e) {
        console.log(e)
    }
}

async function insertLeadLocation (ip, geoJson, token) {
    const query = `
    INSERT INTO lead_location
    (token, infomation, ip)
    VALUES (
    $1, $2, $3
    );`

    try {
        const result = await client.query(query, [ip, geoJson, token])
        return result
    } catch (e) {
        console.log(e)
    }
}



async function getUser(email, password) {
    const query = `SELECT * FROM users WHERE email = $1`
        try {
            const result = await client.query(query, [email])

            console.log(result)

            const hash = hasher.hasher(password, result.rows[0].sal)
            console.log(hash)
            if (hash.hashedpassword == result.rows[0].password) {
                return result.rows[0].id
            } else {
                return 
            } 
        } catch(e) {
                console.log(e)
                return 
            }   
}


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
   
    var result = await client.query(`
         Select * 
            from 
            openorder
            order by timestamp desc`);

    return result;
};



module.exports = {  
    insertOrder,
    verifyLastOrder,
    getUser,
    checkToken,
    createUsers,
    insertUsersToken,
    insertLeads,
    insertLeadLocation,
    checkInToken,
    insertPost,
    selectPostById,
    getAllPost,
    selectPostByTitle,
    insertPost
}



