import React, { Component } from "react";
import {CopyToClipboard} from 'react-copy-to-clipboard';

export default class Oficina extends Component {
  constructor(props) {
    super(props);

    this.state = {
      direccion: "loading Wallet",
      link: "Make an investment to get the referral LINK",
      registered: false,
      balanceRef: 0,
      available: 0,
      balanceSal: 0,
      totalRef: 0,
      invested: 0,
      paidAt: 0,
      my: 0,
      almacen: 0,
      withdrawn: 0,
      precioSITE: 1,
      valueSITE: 0,
      valueUSDT: 0,
      personasIzquierda: 0,
      puntosIzquierda: 0,
      personasDerecha: 0,
      puntosDerecha: 0,
      bonusBinario: 0,
      puntosEfectivosIzquierda: 0,
      puntosEfectivosDerecha: 0,
      puntosReclamadosIzquierda: 0,
      puntosReclamadosDerecha: 0,
      puntosLostIzquierda: 0,
      puntosLostDerecha: 0,
      directos: 0,

    };

    this.Investors = this.Investors.bind(this);
    this.Investors2 = this.Investors2.bind(this);
    this.Investors3 = this.Investors3.bind(this);
    this.Link = this.Link.bind(this);
    this.withdraw = this.withdraw.bind(this);

    this.rateSITE = this.rateSITE.bind(this);
    this.handleChangeSITE = this.handleChangeSITE.bind(this);
    this.handleChangeUSDT = this.handleChangeUSDT.bind(this);

    this.claim = this.claim.bind(this);
    this.rango = this.rango.bind(this);
  }

  handleChangeSITE(event) {
    this.setState({valueSITE: event.target.value});
  }

  handleChangeUSDT(event) {
    this.setState({valueUSDT: event.target.value});
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

    },7*1000);
    
    setInterval(() => this.Investors2(),3*1000);
    setInterval(() => this.Investors3(),3*1000);
    setInterval(() => this.Investors(),3*1000);
    //setInterval(() => this.rango(),3*1000);
    setInterval(() => this.Link(),3*1000);

    
  };

  async rateSITE(){
    /*var proxyUrl = cons.proxy;
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

  async Link() {
    const {registered} = this.state;
    if(registered){

      let loc = document.location.href;
      if(loc.indexOf('?')>0){
        loc = loc.split('?')[0];
      }

      if(loc.indexOf('#')>0){
        loc = loc.split('#')[0];
      }
      let mydireccion = this.state.currentAccount;
      mydireccion = await this.props.wallet.contractBinary.methods.addressToId(this.state.currentAccount).call({from:this.state.currentAccount});
      var ver = "";
      if (this.props.version > 1) {
        ver = "?v"+this.props.version;
      }
      mydireccion = loc+'?ref='+mydireccion;
      var link = mydireccion;
      this.setState({
        link: link,
      });
    }else{
      link = "Make an investment to get the referral LINK";
      this.setState({
        link: link,
      });
    }

    document.getElementById("linkRefer").value = link;
  }


  async Investors() {

    let usuario = await this.props.wallet.contractBinary.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});
    usuario.withdrawable = await this.props.wallet.contractBinary.methods.withdrawable(this.state.currentAccount).call({from:this.state.currentAccount});
    
    var decimales = await this.props.wallet.contractToken.methods.decimals().call({from:this.state.currentAccount});

    var despositos = await this.props.wallet.contractBinary.methods.depositos(this.state.currentAccount).call({from:this.state.currentAccount});
    
    var valores = despositos[0];
    var valorPlan = 0;

    usuario.withdrawable = usuario.withdrawable/10**decimales;
    usuario.withdrawn = usuario.withdrawn/10**decimales;

    for (let index = 0; index < valores.length; index++) {
      valorPlan += valores[index]/10**decimales;
    }

    //valorPlan = (valorPlan*porcent);//(usuario.invested*porcent);// decimales visuales

    var progresoUsdt = ((valorPlan-(valorPlan-(usuario.withdrawn+usuario.withdrawable)))*100)/valorPlan;

    progresoUsdt = progresoUsdt.toFixed(2);

    var progresoRetiro = ((valorPlan-(valorPlan-usuario.withdrawn))*100)/valorPlan;

    progresoRetiro = progresoRetiro.toFixed(2);

    //console.log(usuario)

    this.setState({
      registered: usuario.registered,
      balanceRef: usuario.balanceRef/10**decimales,
      balanceSal: usuario.balanceSal/10**decimales,
      totalRef: usuario.totalRef/10**decimales,
      invested: usuario.invested/10**decimales,
      paidAt: usuario.paidAt/10**decimales,
      my: usuario.withdrawable,
      withdrawn: usuario.withdrawn,
      almacen: usuario.almacen/10**decimales,
      progresoUsdt: progresoUsdt,
      progresoRetiro: progresoRetiro,
      valorPlan: valorPlan,
      directos: usuario.directos
    });

  };

  async Investors2() {

    //var precioSITE = await this.rateSITE();

    /*this.setState({
      precioSITE: precioSITE
    });*/

  };

  async Investors3() {

    var {directos, valorPlan } = this.state;

    //Personas y puntos totales
    let puntos = await this.props.wallet.contractBinary.methods.personasBinary(this.state.currentAccount).call({from:this.state.currentAccount});

    // monto de bonus y puntos efectivos
    let bonusBinario = await this.props.wallet.contractBinary.methods.withdrawableBinary(this.state.currentAccount).call({from:this.state.currentAccount});
  
    var available = await this.props.wallet.contractBinary.methods.withdrawable(this.state.currentAccount).call({from:this.state.currentAccount});

    available = available/10**18;

    if(directos >= 2 && available < valorPlan ){
      bonusBinario.amount = bonusBinario.amount/10**18;
    }else{
      bonusBinario.amount = 0;
    }

    let brazoIzquierdo = await this.props.wallet.contractBinary.methods.handLeft(this.state.currentAccount).call({from:this.state.currentAccount});

    let brazoDerecho = await this.props.wallet.contractBinary.methods.handRigth(this.state.currentAccount).call({from:this.state.currentAccount});

    //console.log(brazoDerecho);

    var MIN_RETIRO = await this.props.wallet.contractBinary.methods.MIN_RETIRO().call({from:this.state.currentAccount});

    MIN_RETIRO = MIN_RETIRO/10**18;


    this.setState({
      personasIzquierda: puntos.pLeft,
      personasDerecha: puntos.pRigth,

      bonusBinario: bonusBinario.amount,

      puntosEfectivosIzquierda: bonusBinario.left/10**18,
      puntosEfectivosDerecha: bonusBinario.rigth/10**18,

      puntosReclamadosIzquierda: brazoIzquierdo.reclamados/10**18,
      puntosReclamadosDerecha: brazoDerecho.reclamados/10**18,

      puntosIzquierda: (bonusBinario.left/10**18)+(brazoIzquierdo.reclamados/10**18),
      puntosDerecha: (bonusBinario.rigth/10**18)+(brazoDerecho.reclamados/10**18),

      available:available,
      MIN_RETIRO: MIN_RETIRO

    });

  };

  async withdraw(){
    var {available} = this.state;

    available = (available*1).toFixed(6);
    available = parseFloat(available);

    var decimales = await this.props.wallet.contractToken.methods.decimals().call({from:this.state.currentAccount});

    var MIN_RETIRO = await this.props.wallet.contractBinary.methods.MIN_RETIRO().call({from:this.state.currentAccount});
    MIN_RETIRO = MIN_RETIRO/10**decimales;

    if ( available > MIN_RETIRO ){
      await this.props.wallet.contractBinary.methods.withdraw().send({from:this.state.currentAccount});

    }else{
      if (available < MIN_RETIRO) {
        window.alert("The minimum to withdraw are: "+(MIN_RETIRO)+" USDT");
      }
    }
  };

  async claim(){
    await this.props.wallet.contractBinary.methods.newRecompensa().send({from:this.state.currentAccount});
  }

  async rango(){
    var rango = await this.props.wallet.contractBinary.methods.withdrawableRange(this.state.currentAccount).call({from:this.state.currentAccount});
    rango = rango/10**18;
    rango = rango/2;
    var rangoArray = [];
    var rangoEstilo = "btn-secondary";
    var gananciasRango = "Claimed";
    var funcionRango = () => {};
    var cantidad = "";

    for (let index = 0; index < 7; index++) {
      rangoArray[index] = await this.props.wallet.contractBinary.methods.rangoReclamado(this.state.currentAccount, index).call({from:this.state.currentAccount});
      
    }
    
    if (rango === 0) {
      rango = "N/A"
    }
    if (rango >= 1500 && rango < 5000) {
      rango = "Master"
      if(!rangoArray[0]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(0).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }
    if (rango >= 5000 && rango < 20000) {
      rango = "Sapphire"
      if(!rangoArray[1]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(1).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }
    if (rango >= 20000 && rango < 50000) {
      rango = "Ruby"
      if(!rangoArray[2]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(2).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }
    if (rango >= 50000 && rango < 120000) {
      rango = "Emerauld"
      if(!rangoArray[3]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(3).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }
    if (rango >= 120000 && rango < 600000) {
      rango = "Diamond"
      if(!rangoArray[4]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(4).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }
    if (rango >= 600000 && rango < 1500000) {
      rango = "Blue Diamond"
      if(!rangoArray[5]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(5).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }
    if (rango >= 1500000 && rango < 5000000) {
      rango = "Black Diamond"
      if(!rangoArray[6]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(6).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }
    if (rango >= 5000000) {
      rango = "Crown Diamond"
      if(!rangoArray[7]){
        rangoEstilo = "btn-success";
        cantidad = await this.props.wallet.contractBinary.methods.gananciasRango(7).call({from:this.state.currentAccount});
        cantidad = cantidad / 10 ** 18;
        gananciasRango = `Claim ${cantidad} USDT`;
        funcionRango = () => {
          return this.claim();
        } ;
      }
    }

    this.setState({
      rango: rango,
      rangoEstilo: rangoEstilo,
      gananciasRango: gananciasRango,
      funcionRango: funcionRango
    })
  }
  

  render() {
    var { available, invested,  direccion, rango, balanceSal} = this.state;

    available = (available+balanceSal).toFixed(2);
    available = parseFloat(available);

    invested = invested.toFixed(2);
    invested = parseFloat(invested);


    if(available >= this.state.MIN_RETIRO){
      var ret = (available).toFixed(2);
    }else{
      ret = 0;
    }

    return (

      <div class="row">
      <div class="content-wrapper-before blue-grey lighten-5"></div>
      <div class="col s12">
          <div class="container">
              <div class="section">


          
                  <div class="row">

                  <div class="col s12 m6 l6">
                          <div class="card card-border center-align gradient-45deg-purple-deep-orange">
                            <div class="card-content white-text">
                                <img class="responsive-img circle z-depth-4" width="100" src="app-assets/images/user/2.jpg" alt="images" />
                                <p class="m-0 break">{this.state.currentAccount}</p>
                                <h4 class="white-text">Migel Merchan</h4>
                                <div class="row mt-5">
                                    <a href="#" class="col s4">
                                        <h5 class="gradient-45deg-indigo-light-blue icon-background circle white-text z-depth-3 mx-auto">
                                            <i class="fab fa-behance"></i>
                                        </h5>
                                        <p class="white-text">12.8k</p>
                                        <p class="white-text">Profit</p>
                                    </a>
                                    <a href="#" class="col s4">
                                        <h5 class="icon-background circle gradient-45deg-indigo-blue white-text z-depth-3 mx-auto">
                                            <i class="fab fa-linkedin-in"></i>
                                        </h5>
                                        <p class="white-text">10.1k</p>
                                        <p class="white-text">Infinity</p>
                                    </a>
                                    <a href="#" class="col s4">
                                        <h5 class="icon-background circle gradient-45deg-red-pink white-text z-depth-3 mx-auto">
                                            <i class="fab fa-pinterest-p"></i>
                                        </h5>
                                        <p class="white-text">8.23k</p>
                                        <p class="white-text">Network</p>
                                    </a>
                                </div>
                            </div>
                        </div>

                      </div>

                  
                    <div class="col s12 s6 m6">
                      <div class="card gradient-shadow gradient-45deg-light-blue-cyan border-radius-3">
                        <div class="card-content center">
                          <img src="app-assets/images/icon/apple-watch.png" alt="images" class="width-40" />
                          <h5 class="m-0 white-text lighten-4 mt-6">Rank</h5>
                          <p class="white-text lighten-4"></p>
                        </div>
                      </div>
                    </div>

                      
                     
                  </div>
                  
                  <div id="card-stats" class="pt-0">
                      <div class="row">
                          <div class="col s12 m6 l6 xl3">
                              <div class="card gradient-45deg-light-blue-cyan gradient-shadow min-height-100 white-text animate fadeLeft">
                                  <div class="padding-4">
                                      <div class="row">
                                          <div class="col s7 m5">
                                              <i class="material-icons background-round mt-5">add_shopping_cart</i>
                                              <p>Account</p>
                                          </div>
                                          <div class="col s5 m7 right-align">
                                              <h5 class="mb-0 white-text">{invested/50} BLKS</h5>
                                              <p class="no-margin">Total invested</p>
                                              <p>${invested}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col s12 m6 l6 xl3">
                              <div class="card gradient-45deg-red-pink gradient-shadow min-height-100 white-text animate fadeLeft">
                                  <div class="padding-4">
                                      <div class="row">
                                          <div class="col s5 m5">
                                              <i class="material-icons background-round mt-5">perm_identity</i>
                                          </div>
                                          <div class="col s7 m7 right-align mb-7">
                                              <h5 class="mb-0 white-text">1885</h5>
                                              <p class="no-margin">Passive Gain</p>
                                          </div>
                                          <div class="col s12 m12">
                                            <button class="waves-effect waves-light btn mb-1 mr-1 ancho100">Withdraw</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col s12 m6 l6 xl3">
                              <div class="card gradient-45deg-amber-amber gradient-shadow min-height-100 white-text animate fadeRight">
                                  <div class="padding-4">
                                      <div class="row">
                                          <div class="col s5 m5">
                                              <i class="material-icons background-round mt-5">timeline</i>
                                          </div>
                                          <div class="col s7 m7 left-align p-0 mb-6 pr-3">
                                              <h5 class="mb-0 white-text">$80</h5>
                                              <p class="no-margin">Network Bonus</p>
                                          </div>
                                          <div class="col s12 m12">
                                            <button class="mb-2 btn waves-effect waves-light amber darken-4 ancho100">Withdraw</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          <div class="col s12 m6 l6 xl3">
                              <div class="card gradient-45deg-green-teal gradient-shadow min-height-100 white-text animate fadeRight">
                                  <div class="padding-4">
                                      <div class="row">
                                          <div class="col s5 m5">
                                              <i class="material-icons background-round mt-5">attach_money</i>
                                              <p>Account</p>
                                          </div>
                                          <div class="col s7 m7 left-align p-0 pr-2">
                                              <h5 class="mb-0 white-text">{(this.state.withdrawn).toFixed(2)/50} BLKS</h5>
                                              <p class="no-margin">Infinity earned</p>
                                              <p class="right-align pr-8">${(this.state.withdrawn).toFixed(2)}</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              
                 
              </div>
            
          </div>
          <div class="content-overlay"></div>
      </div>
  </div>    

    );
  }
}
