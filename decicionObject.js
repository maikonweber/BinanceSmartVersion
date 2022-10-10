const registerEnter = require('./db')
class decicionObject {
    constructor(oneDes, twoDes, thDes) {
        let oneDes = oneDes;
        let twoDes = twoDes;
        let thDes = thDes;
        let call;

    }
    setCall(call) {
        this.call = call
    }
    
    putOrder({decisionMMA10, relMMA10MMA20, volume}) {
        if(this.oneDes && this.twoDes && thDes) {
            console.log('Inicializando uma Ordem'); 
        }
    }

    procces
}

module.exports = decicionObject

/* 
    * Objecto tem um interface que recebe 3 valores para executar um ordem
    * Armazena a ordem até ela ser executada.
    * Salva em Memoria as Ordens Abertas e Ordens que estão prontas para serem executadas
    * Verifica valores de preço e stop 
    * Ganhos de Ordens Abertas
    * Ordens Executadas
    * Janela de Ganhos e Valores.


*/   
