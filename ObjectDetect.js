const { getLastNumberEv, getResultDatabase } = require('./database')
const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const testStrategy = require('./functions/testStrategy')
const consulExpectNumber = require('./functions/detectExpectNumber')

var pg = require('pg');
const EventEmitter = require('events');


let client = {
    host: 'localhost',
    port: 5532,
    database: 'roullet',
    user: 'roullet',
    password: 'roullet'
};

let pool = new pg.Pool(client);

const apiId = 17228434;
const apiHash = 'b05e1c84ad4dd7c77e9965204c016a36';
const stringSession = new StringSession('1AQAOMTQ5LjE1NC4xNzUuNTQBu7jfw1tDzOkH7vrrFyEhVQHcFgx/NY/xgc2zt2nrGFEXZCLizMgd/IZfD4xZYPkq071kVGb64BaBRY13fLFfUOZiUo40jfMokpnuM7+y+V8WGcwYi6cLBCXYaVeyMI/pTbkcHyQOZOoAmD6qh7C3ls+OGjTzrIaWQF27VQmNX73lv6Vg4FjALR7Cpa+Xz3e63tViZ84pph2Zw50q6u9TpNsDfdNTocK9cVODEdczeXrekDCB9D8+bZullp5hsn77lgpWjDHe57eZHC/m7OhR0wLvjnhcqRp5JrWQNMJYV2P1xdGimgzAQGRLn5pAPzuxDkKawdi5ZHjYgXsVQ1lPDOE=');
const input = require('input');


class StrategyProccedChannel {
     constructor(users) {
          this.lastStringSession;
          this.users = users.usersProfile.name
          this.channel = users.usersProfile.channel
          this.number = users.usersProfile.number
          this.usersFilter = users.usersFilters
          this.availableRoullete = users.userAvailableRoullete
          this.usersStrigAlert = users.usersStringAlert
          this.usersStringSygnal = users.usersStringComprove
          this.usersStringGreen = users.usersStringWin
          this.usersStringRed = users.usersStringLoss
          this.usersMartingale = users.usersStringMartingale
          this.waitingResult = false
          this.emitResult;
          this.clientTelegram;
     }


     async init() {
          const client = new TelegramClient(stringSession, apiId, apiHash,  {
               connectionRetries: 5,
          })

          await client.start({
               phoneNumber: this.number,
               phoneCode: async () => await input.text('Please enter your Number')
          })   
          
          this.clientTelegram = client

     }

     sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms))
     }        

     async proccedThisSygnal(sygnalObject) {
          const isRoulleteAvailable = this.availableRoullete.includes(sygnalObject))
          const isStrategyAvailable = this.usersFilter.includes(sygnalObject));
          if(isRoulleteAvailable && isStrategyAvailable) {
               await this.SendNotification(sygnalObject)
          }               
     }

     async SendNotification() {
          await sendMsgChanell(this.clientTelegram, sygnalObject, this.usersStringAlert)
     }
     
}

module.exports =  StrategyProccedChannel



