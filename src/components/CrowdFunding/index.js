import React, { Component } from "react";
import Select from 'react-select'

import cons from "../../cons.js";

export default class CrowdFunding extends Component {
  constructor(props) {
    super(props);

    this.state = {

      min: 100,
      deposito: "Loading...",
      balance: "Loading...",
      accountAddress: "Loading...",
      porcentaje: "Loading...",
      dias: "Loading...",
      partner: "Loading...",
      balanceTRX: "Loading...",
      balanceUSDT: "Loading...",
      precioSITE: 1,
      valueUSDT: 0,
      hand: 0,
      cantidadBlokes: 1,
      valorBlokes: 50

    };

    this.deposit = this.deposit.bind(this);
    this.estado = this.estado.bind(this);
    this.estado2 = this.estado2.bind(this);

    this.rateSITE = this.rateSITE.bind(this);
    this.handleChangeA = this.handleChangeA.bind(this);
    this.handleChangeB = this.handleChangeB.bind(this);
  }

  handleChangeA(event) {
    var evento = event.target.value;
    this.setState({
      cantidadBlokes: evento,
      valorBlokes: evento*50
    });
  }


  handleChangeB(event) {
    var evento = event.target.value;
    this.setState({
      valorBlokes: evento,
      cantidadBlokes: evento/50
    });
  }

  async componentDidMount() {
    if (typeof window.ethereum !== 'undefined') {           
      var resultado = await window.ethereum.request({ method: 'eth_requestAccounts' });
        //console.log(resultado[0]);
        this.setState({
          currentAccount: resultado[0]
        })

    }
    setInterval(async() => {
      if (typeof window.ethereum !== 'undefined') {           
        var resultado = await window.ethereum.request({ method: 'eth_requestAccounts' });
          //console.log(resultado[0]);
          this.setState({
            currentAccount: resultado[0]
          })
  
      }

    },3*1000);

    setInterval(() => this.estado(),3*1000);
    setInterval(() => this.estado2(),3*1000);
    
  };

  async rateSITE(){
    /*
    var proxyUrl = cons.proxy;
    var apiUrl = cons.PRE;
    var response;

    try {
      response = await fetch(proxyUrl+apiUrl);
    } catch (err) {
      console.log(err);
      return this.state.precioSITE;
    }

    var json = await response.json();

    this.setState({
      precioSITE: json.Data.precio
    });

    return json.Data.precio;*/

    return 1;

  };

  async estado(){

    //console.log(this.props.wallet);

    var inversors = await this.props.wallet.contractBinary.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});

    var options = [];

    var datos = {};

    inversors.inicio = 1000;

    var aprovado = await this.props.wallet.contractToken.methods.allowance(this.state.currentAccount,this.props.contractAddress).call({from:this.state.currentAccount});
    

    if (aprovado > 0) {

      var top = await this.props.wallet.contractBinary.methods.plansLength().call({from:this.state.currentAccount});

      for (let index = 0; index < top; index++) {
        var precio = await this.props.wallet.contractBinary.methods.plans(index).call({from:this.state.currentAccount});
        var active = await this.props.wallet.contractBinary.methods.active(index).call({from:this.state.currentAccount});
        precio = parseInt(precio)/10**18;
        if( precio > 0 && active && inversors.registered){
          datos = {};
          datos.value = index;
          datos.label = precio+' USDT';
          options[index] = datos;

        }
        
        
      }
    }

    this.setState({
      options: options
    });

  }

  async estado2(){

    var accountAddress =  this.state.currentAccount;
    var inversors = await this.props.wallet.contractBinary.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});

    var inicio = accountAddress.substr(0,4);
    var fin = accountAddress.substr(-4);

    var texto = inicio+"..."+fin;

    document.getElementById("login").href = `https://bscscan.com/address/${accountAddress}`;
    document.getElementById("login-my-wallet").innerHTML = texto;

    var nameToken1 = await this.props.wallet.contractToken.methods.symbol().call({from:this.state.currentAccount});

    var aprovado = await this.props.wallet.contractToken.methods.allowance(accountAddress,this.props.contractAddress).call({from:this.state.currentAccount});

    if (aprovado > 0) {
      if(!inversors.registered){
        aprovado = "Register";
      }else{
        aprovado = "Buy Plan";
      }
      
    }else{
      aprovado = "Allow wallet";
    }

    inversors.inicio = 1000;
    
    var tiempo = await this.props.wallet.contractBinary.methods.tiempo().call({from:this.state.currentAccount});

    tiempo = tiempo*1000;

    var porcentiempo = ((Date.now()-inversors.inicio)*100)/tiempo;

    var decimales = await this.props.wallet.contractToken.methods.decimals().call({from:this.state.currentAccount});

    var balance = await this.props.wallet.contractToken.methods.balanceOf(this.state.currentAccount).call({from:this.state.currentAccount});

    balance = balance/10**decimales;

    var valorPlan = 0;

    if( porcentiempo < 100 ){
      aprovado = "Update Plan";

      valorPlan = inversors.plan/10**8;
      
    }

    var partner = cons.WS;

    var hand = "Left ";

    if ( inversors.registered ) {
      partner = await this.props.wallet.contractBinary.methods.padre(this.state.currentAccount).call({from:this.state.currentAccount});

    }else{

      var loc = document.location.href;
      if(loc.indexOf('?')>0){
          var getString = loc.split('?');
          //console.log(getString)
          getString = getString[getString.length-1];
          //console.log(getString);
          var GET = getString.split('&');
          var get = {};
          for(var i = 0, l = GET.length; i < l; i++){
              var tmp = GET[i].split('=');
              get[tmp[0]] = unescape(decodeURI(tmp[1]));
          }

          if (get['hand']){
            tmp = get['hand'].split('#');

            //console.log(tmp);

            if (tmp[0] === "right") {
              hand = "Rigth ";
            }
          }

          if (get['ref']) {
            tmp = get['ref'].split('#');

            //console.log(tmp[0]);

            var wallet = await this.props.wallet.contractBinary.methods.idToAddress(tmp[0]).call({from:this.state.currentAccount});

            inversors = await this.props.wallet.contractBinary.methods.investors(wallet).call({from:this.state.currentAccount});
            //console.log(wallet);
            if ( inversors.registered ) {
              partner = "team "+hand+" of "+wallet;
            }
          }

        
      }

    }

    if(partner === "0x0000000000000000000000000000000000000000"){
      partner = "---------------------------------";
    }
    

    var dias = 365;//await Utils.contract.tiempo().call();

    //var velocidad = await Utils.contract.velocidad().call();

    //dias = (parseInt(dias)/86400)*velocidad;

    var porcentaje = await this.props.wallet.contractBinary.methods.porcent().call({from:this.state.currentAccount});

    porcentaje = parseInt(porcentaje);

    var decimals = await this.props.wallet.contractToken.methods.decimals().call({from:this.state.currentAccount});

    var balanceUSDT = await this.props.wallet.contractToken.methods.balanceOf(this.state.currentAccount).call({from:this.state.currentAccount});

    balanceUSDT = parseInt(balanceUSDT)/10**decimals;

    this.setState({
      deposito: aprovado,
      balance: valorPlan,
      decimales: decimales,
      accountAddress: accountAddress,
      porcentaje: porcentaje,
      dias: dias,
      partner: partner,
      balanceSite: balance,
      balanceUSDT: balanceUSDT,
      nameToken1: nameToken1
    });
  }


  async deposit() {

    var { balanceSite, valueUSDT , balance} = this.state;

    var accountAddress =  this.state.currentAccount;

    var aprovado = await this.props.wallet.contractToken.methods.allowance(accountAddress,this.props.contractAddress).call({from:this.state.currentAccount});

    if (aprovado <= 0 ){
      await this.props.wallet.contractToken.methods.approve(this.props.contractAddress, "115792089237316195423570985008687907853269984665640564039457584007913129639935").send({from:this.state.currentAccount});
      window.alert("Balance approval for exchange: successful");
      return;
    }
    var blokes = document.getElementById("a").value;
    var amount = blokes *50;
    amount = amount-balance;

    if ( aprovado > 0 && 
      balanceSite >= amount 
      ){

        var loc = document.location.href;
        var sponsor = cons.WS;
        var hand = 0;
        var investors = await this.props.wallet.contractBinary.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});

        if (investors.registered) {

          sponsor = await this.props.wallet.contractBinary.methods.padre(this.state.currentAccount).call({from:this.state.currentAccount});

        }else{

          if(loc.indexOf('?')>0){
            var getString = loc.split('?');
            getString = getString[getString.length-1];
            //console.log(getString);
            var GET = getString.split('&');
            var get = {};
            for(var i = 0, l = GET.length; i < l; i++){
                var tmp = GET[i].split('=');
                get[tmp[0]] = unescape(decodeURI(tmp[1]));
            }


            if (get['ref']) {
              tmp = get['ref'].split('#');

              var wallet = await this.props.wallet.contractBinary.methods.idToAddress(tmp[0]).call({from:this.state.currentAccount});

              var padre = await this.props.wallet.contractBinary.methods.investors(wallet).call({from:this.state.currentAccount});

              if ( padre.registered ) {
                sponsor = wallet;
              }
            }

          }
          
        }

        if(!investors.registered ){// && sponsor !== "0x0000000000000000000000000000000000000000"){
          var reg = this.props.wallet.contractBinary.methods.registro(sponsor, "migel merchan").send({from:this.state.currentAccount});
          reg.then(() => window.alert("congratulation registration: successful"));
          return;
        }else{
          if (!investors.registered) {
            alert("you need a referral link to register");
            return;
          }
          
        }

        if(/*sponsor !== "0x0000000000000000000000000000000000000000" && */investors.registered ){
        
          var userWithdrable = await this.props.wallet.contractBinary.methods.withdrawable(this.state.currentAccount).call({from:this.state.currentAccount});
          var MIN_RETIRO = await this.props.wallet.contractBinary.methods.MIN_RETIRO().call({from:this.state.currentAccount});

          var despositos = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount).call({from:this.state.currentAccount});

  
          if (userWithdrable/10**18 >= MIN_RETIRO/10**18 && despositos[0].length !== 0){
            if(window.confirm("Realizar el retiro de su disponible, para continuar")){
              this.props.wallet.contractBinary.methods.withdraw().send({from:this.state.currentAccount})
              .then(() => {
                this.props.wallet.contractBinary.methods.buyPlan(valueUSDT).send({from:this.state.currentAccount})
                .then(() => {
                  window.alert("Felicidades inversión exitosa");
                  document.getElementById("services").scrollIntoView({block: "start", behavior: "smooth"});
                })

              })

              
            }else{
              return;
            }
          
          }else{
              this.props.wallet.contractBinary.methods.buyBlocks(blokes).send({from:this.state.currentAccount})
              .then(() => {
                window.alert("Felicidades inversión exitosa");
              });
  
          }
          
        }else{
  
            window.alert("Please use referral link to buy a plan");
  
        }
          
    }else{


      if ( balanceSite < amount ) {

        window.alert("You do not have enough balance, you need: "+amount+" USDT and in your wallet you have: "+balanceSite);
      }

      
    }


  };

  render() {

    var {options} = this.state;

    return (
      <div className="row">
                <div className="col s12">
                    <div className="container">
                        <div className="row vertical-modern-dashboard">
                            <div className="col s12 m12 l12 card padding-4 animate fadeLeft gradient-45deg-blue-indigo white-text">
                                <div className="row">
                                    <div className="col s2 m2 center-align">
                                        <i className="material-icons background-round mt-1 mb-0">perm_identity</i>
                                        <p className="mb-0">Blocks</p>
                                    </div>
                                    <div className="col s3 m2 center-align">
                                        <h5 className="mb-0 white-text">X</h5>
                                    </div>
                                    <div className="col s2 m2 center-align">
                                        <input id="a" type="number" className="form-control center-align white-text" value={this.state.cantidadBlokes} onChange={this.handleChangeA}  />
                                        <p className="mb-0">Quantity</p>
                                    </div>
                                    <div className="col s2 m2 center-align">
                                        <h5 className="mb-0 white-text">=</h5>
                                    </div>
                                    <div className="col s2 m2 center-align">
                                        <input id="b" type="number" className="form-control center-align white-text" value={this.state.valorBlokes} onChange={this.handleChangeB} />
                                        <p className="mb-0">Total</p>
                                    </div>
                                    <div className="col s2 m2 center-align mt-1">
                                        <button className="mb-6 btn waves-effect waves-light cyan"  onClick={() => this.deposit()}>Buy</button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col s12 m6 l6 card padding-3 animate fadeLeft gradient-45deg-blue-indigo white-text">
                                <div className="row">
                                    
                                    <div className="col s12 m12 center-align">
                                        <i className="material-icons background-round mt-1 mb-0">perm_identity</i>
                                        <p className="mb-0 center-align break">Upline: <br /> {this.state.partner}</p>
                                    </div>

                                </div>
                            </div>
                            <div className="col s12 m6 l6 card-width">
                              <div className="card card-border center-align gradient-45deg-indigo-purple">
                                  <div className="card-content white-text">
                                      <div className="col s12"><i className="material-icons right">favorite</i></div>
                                      <h5 className="white-text mb-1">Membership</h5>
                                      <p className="m-0">13 Dec 2021</p>
                                      <a className="waves-effect waves-light btn gradient-45deg-deep-orange-orange border-round mt-7 z-depth-4">Buy $30/AN</a>
                                  </div>
                              </div>
                          </div>
                        </div>
                    </div>
                    <div className="content-overlay"></div>
                </div>
            </div>

    );
  }
}
