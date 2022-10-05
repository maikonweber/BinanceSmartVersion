const axios = require('axios');



async function callApi () {
   return axios({
        method : 'post',
        url : 'https://api.muttercorp.online/api/v4/full_candle',
        responseType : 'json',
        headers : {
            token : ""
        },
        body: {
         "symbol" : "BTCBUSD",
         "interval" : "1h"
        }
    }).then(el => {
       return el
    })
}


;(async () => {
   const result = await callApi();
   console.log(result);


})()
