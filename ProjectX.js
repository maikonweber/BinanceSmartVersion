const axios = require('axios');
const sendMessage = require('./telegram.js')


async function callApi () {
   return axios({
        method : 'post',
        url : 'https://api.muttercorp.online/api/v3/full_candle',
        responseType : 'json',
        headers : {
            token : ""
        }
    }).then(el => {
       return el
    })
}


;(async () => {
   const result = await callApi();
   console.log(result);


})()
