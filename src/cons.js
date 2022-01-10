const proxy = "https://proxy-sites.herokuapp.com/";

const PRE = "https://precio-site.herokuapp.com/api/v1/servicio/precio/v2/SITE";

const WS = "0x0000000000000000000000000000000000000000";//0x0000000000000000000000000000000000000000 recibe los huerfanos por defecto

var SCtest = "0x01480A7Af2387ab0732e6a23863E5c160Db32b93";// direccion del contrato de pruebas test only no real
var SC = "0x01480A7Af2387ab0732e6a23863E5c160Db32b93";// direccion del contrato V1
var SC2 = "0x01480A7Af2387ab0732e6a23863E5c160Db32b93";// direccion del contrato V2

var TOKEN = "0x55d398326f99059fF775485246999027B3197955";


if(false){// testnet comand

    SCtest = "0x3892D40E37C0C8BeCC601E19Dba6f31f350Fe8C3";// direccion del contrato de pruebas test only no real
    SC = "0x3892D40E37C0C8BeCC601E19Dba6f31f350Fe8C3";// direccion del contrato V1
    SC2 = "0x3892D40E37C0C8BeCC601E19Dba6f31f350Fe8C3";// direccion del contrato V2

    TOKEN = "0xd5881b890b443be0c609BDFAdE3D8cE886cF9BAc";

}


export default {proxy, WS, SCtest, SC, SC2, PRE, TOKEN};
