const proxy = "https://proxy-sites.herokuapp.com/";

const PRE = "https://precio-site.herokuapp.com/api/v1/servicio/precio/v2/SITE";

const WS = "0x0000000000000000000000000000000000000000";//0x0000000000000000000000000000000000000000 recibe los huerfanos por defecto

var SCtest = "0xEC836b3F0fa7BF1579ab32C57A4e7dee971ccDcE";// direccion del contrato de pruebas test only no real
var SC = "0xaD356cA07BE4A9a3237b7d4326ad07D08846fb60";// direccion del contrato V1
var SC2 = "0xaD356cA07BE4A9a3237b7d4326ad07D08846fb60";// direccion del contrato V2

var TOKEN = "0x55d398326f99059fF775485246999027B3197955";


if(true){// testnet comand

    SCtest = "0xB1EEfb4A76037FdA91b38387833B79C5cA151682";// direccion del contrato de pruebas test only no real
    SC = "0xB1EEfb4A76037FdA91b38387833B79C5cA151682";// direccion del contrato V1
    SC2 = "0xB1EEfb4A76037FdA91b38387833B79C5cA151682";// direccion del contrato V2

    TOKEN = "0xd5881b890b443be0c609BDFAdE3D8cE886cF9BAc";

}


export default {proxy, WS, SCtest, SC, SC2, PRE, TOKEN};
