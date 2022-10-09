
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
    
    putOrder() {
        if(this.oneDes && this.twoDes && thDes) {
            console.log('Inicializando uma Ordem'); 
        }
    }
}

module.exports = decicionObject

/* 
    * Objecto tem um interface que recebe 3 valores para executar um ordem
    * Armazena a ordem até ela ser executada.
    * Define o Stop o Meta e Valor de Saida.
    * Finaliza a Operação
*/