const proxy = "https://proxy-sites.herokuapp.com/";

const PRE = "https://precio-site.herokuapp.com/api/v1/servicio/precio/v2/SITE";

const WS = "0x0000000000000000000000000000000000000000";//0x0000000000000000000000000000000000000000 recibe los huerfanos por defecto

var SCtest = "0x0000000000000000000000000000000000000000";// direccion del contrato de pruebas test only no real
var SC = "0x0000000000000000000000000000000000000000";// direccion del contrato V1
var SC2 = "0x0000000000000000000000000000000000000000";// direccion del contrato V2

var TOKEN = "0x55d398326f99059fF775485246999027B3197955";


if(true){// testnet comand

    SCtest = "0x84de23Ef4D54a4A5620b6D7B1458516CBc7451ad";// direccion del contrato de pruebas test only no real
    SC = "0x84de23Ef4D54a4A5620b6D7B1458516CBc7451ad";// direccion del contrato V1
    SC2 = "0x84de23Ef4D54a4A5620b6D7B1458516CBc7451ad";// direccion del contrato V2

    TOKEN = "0xd5881b890b443be0c609BDFAdE3D8cE886cF9BAc";

}


export default {proxy, WS, SCtest, SC, SC2, PRE, TOKEN};
