// Escreva um arquivo json no sistema com um que receba como parametro
// o resultado do trade.
const os = require('os');
const fs = require('fs');


    function writeJson(resultofOrder) {
        // WriteCSV of Result
        // Create result json file
        const result = {
            "result": resultofOrder
        };
        // Path to the file to windown
        const path = os.homedir() + '/Desktop/result.json';
       
        fs.writeFile(path, JSON.stringify(result), function (err) {
            if (err) {
                console.log(err);
            }
        });
    }

    module.exports
    = {
        writeJson
    }