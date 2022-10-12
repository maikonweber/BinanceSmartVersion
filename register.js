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
   INSERT INTO spotRegister(
      position, valor, quantity, date 
   ) 
   VALUES (
      $1, $2, $3, $4
   );
   `

const futureQuery = `
INSERT INTO spotRegister(
   position, valor, quantity, date 
) 
VALUES (
   $1, $2, $3, $4
);

`

async function insertRegisterSpot(position, valor, quantity, id) {
   return await client.query(query, [[position, valor, quantity]])
}

async function insertRegisterFuture(position, valor, quantity, id) {
   return await client.query(query, [position, valor, quantity, id])
}

async function callFuture(position, valor, quantity, id) {
   const  objectDecisionFuture = {
     "Up" : async () => {

     },
     "Down" : async () => {

     }
   } 
   return 
} 


async function callSpot(position, valor, quantity, id) {
   const  objectDecision = {
     "Up" : async () => {

     },
     "Down" : async () => {

     }
   } 
   return 
}


const objectDecision = {
   "Spot": async (position, valor, quantity, id) => {
      await insertRegisterSpot(position, valor, quantity, id)
   },
   "Future": async (position, valor, quantity, id) => {
      await insertRegisterFuture(position, valor, quantity, id)
   }
}



