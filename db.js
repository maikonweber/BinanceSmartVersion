var { Pool, Client } = require("pg");


var client = new Pool({
  user: "binance",
  password: "binance",
  database: "binance",
  port: 5832,
  host: "localhost",
  ssl: false
});



async function checkToken(token) {
    console.log(token)
    const query = `SELECT * FROM users_token WHERE token = $1`
    try {
        const result = await pool.query(query, [token]);
        return result.rows[0]
    } catch(e) {
        console.log(e)
    }

}

async function createUsers(email, password, name, username, phone, address) {
    
    const hash = hasher.hasher(password, "")

    const query = `INSERT INTO users(username, name, email, password, sal, phone, address)
                    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`
    try {
        const result = await pool.query(query, [username, name ,email, hash.hashedpassword, hash.salt, phone, address])
        return result.rows

        } catch(e) {
        console.log(e)
    }
}


async function InsertRoulleteEv (name, number) {
    let sql = `INSERT INTO 
    robotevolution (name, number) 
    VALUES ($1, $2) returning id;
    `;

    let result = await pool.query(sql, [name, number]);
    
    return result
}


async function insertUsersToken(id, navegator, is_admin) {

    const token = crypto.randomBytes(16).toString('hex')
    console.log(token)
    const query = `INSERT INTO users_token(user_id, token, navegator, is_admin)
                    VALUES ($1, $2, $3, $4) RETURNING *`
    try {
        const result = await pool.query(query, [id, token, navegator, is_admin])
        console.log(result.rows[0])
        return result.rows[0]
    } catch(e) {
        console.log(e)
    }
}


async function checkToken(token) {
    console.log(token)
    const query = `SELECT * FROM users_token WHERE token = $1`
    try {
        const result = await pool.query(query, [token]);
        return result.rows[0]
    } catch(e) {
        console.log(e)
    }
}



async function getUser(email, password) {
    const query = `SELECT * FROM users WHERE email = $1`
        try {
            const result = await pool.query(query, [email])

            console.log(result)

            const hash = hasher.hasher(password, result.rows[0].sal)
            console.log(hash)
            if (hash.hashedpassword == result.rows[0].password) {
                return result.rows[0]
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
    verifyLastOrder,
    getUser,
    checkToken,
    createUsers,
    insertUsersToken,
    InsertRoulleteEv
}



