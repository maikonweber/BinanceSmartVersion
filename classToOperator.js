/* Operator 
  This is a class to insert order in database registration the simulations
  order['side']
  order['valor']
  
  */
const pg = require('pg')



let client = {
  host: 'localhost',
  port: 5532,
  database: 'roullet',
  user: 'roullet',
  password: 'roullet'
};


let pool = new pg.Pool(client);


class Operator {
  construtor(order, iSimulation) {
    let order = order['side']
    let orderValues   = order['valor']
    let target = order['target']
    let stopwin = order['stopwin']
    let isFilled = order['isFilled']
    let coin = order['coin']
  }

  async putOrder() {
  
  }

  setFilled() {

  }
}