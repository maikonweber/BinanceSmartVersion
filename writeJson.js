// Escreva um arquivo json no sistema com um que receba como parametro
// o resultado do trade.
const os = require('os');
const fs = require('fs');


    function writeJson(resultofOrder) {
        fs.writeFileSync(`${os.homedir()}/result.json`, JSON.stringify(resultofOrder));
        console.log('escrevendo um json')
    }

    module.exports
    = {
        writeJson
    }