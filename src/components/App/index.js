import React, { Component } from "react";

import Web3 from "web3";

import Home from "../V1Home";
import TronLinkGuide from "../TronLinkGuide";
import cons from "../../cons"

import abiToken from "../../token";
import abiBinario from "../../unilevel";
import abiInfinity from "../../infinity-abi";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      admin: false,
      metamask: false,
      conectado: false,
      currentAccount: "0x0000000000000000000000000000000000000000",
      binanceM:{
        web3: null,
        contractToken: null,
        contractBinary: null
      }
      
    };
  }

  async componentDidMount() {

      if (typeof window.ethereum !== 'undefined') {           
        var resultado = await window.ethereum.request({ method: 'eth_requestAccounts' });
          //console.log(resultado[0]);
          this.setState({
            currentAccount: resultado[0],
            metamask: true,
            conectado: true
          })

      } else {          
        this.setState({
          metamask: false,
          conectado: false
        })      
      }

      setInterval(async() => {
        if (typeof window.ethereum !== 'undefined') {           
          var resultado = await window.ethereum.request({ method: 'eth_requestAccounts' });
            //console.log(resultado[0]);
            this.setState({
              currentAccount: resultado[0],
              metamask: true,
              conectado: true
            })
  
        } else {          
          this.setState({
            metamask: false,
            conectado: false
          })      
        }

      },7*1000);


    try {         
      var web3 = new Web3(window.web3.currentProvider);// mainet... metamask
      var contractToken = new web3.eth.Contract(
        abiToken,
        cons.TOKEN
      );
      var contractBinary = new web3.eth.Contract(
        abiInfinity,
        cons.INFINITY

      );
      var contractInfinity = new web3.eth.Contract(
        abiBinario,
        cons.SC

      );

      var isAdmin = await contractBinary.methods.admin(this.state.currentAccount).call({from:this.state.currentAccount});
      var sponsor = await contractBinary.methods.padre(this.state.currentAccount).call({from:this.state.currentAccount});

      var user = await contractBinary.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});
      var userInfinity = await contractInfinity.methods.investors(this.state.currentAccount).call({from:this.state.currentAccount});

      if(userInfinity.invested > 0 && !user.registered){
        alert("there was an adjustment in the smart contract if you agree to the new terms please accept the following transaction to migrate the remaining blocks to this new contract, we are sorry for the inconvenience if you want to recover your progress please contact one of our leaders, happy earnings, we keep working for you.")
        contractBinary.methods.inMigracion(this.state.currentAccount, sponsor).send({from:this.state.currentAccount})
        .then(()=>{alert("thanks for updating the terms of the contract")})
        .catch(()=>{alert("there were problems updating please contact support")})
        
      }

      this.setState({
        binanceM:{
          web3: web3,
          contractToken: contractToken,
          contractBinary: contractBinary,
          contractInfinity: contractInfinity
        },
        admin: isAdmin,
      })
      //web3 = new Web3(new Web3.providers.HttpProvider("https://data-seed-prebsc-1-s1.binance.org:8545/"));
    } catch (error) {
        alert(error);
    }  

  }

  render() {

    if (!this.state.metamask) return (
      <>
        <div className="row">
          <TronLinkGuide />
        </div>
      </>
      );

    if (!this.state.conectado) return (
      <>
        <div className="row">
          <TronLinkGuide installed />
        </div>
      </>
      );

      var getString = "";
      var loc = document.location.href;
      var verWallet = cons.WS;
      //console.log(loc);
      if(loc.indexOf('?')>0){
                
        getString = loc.split('?')[1];
        getString = getString.split('#')[0];
        getString = getString.split('&')[0];

        verWallet = getString.split('=')[1];
        
        getString = getString.split('=')[0];

        console.log(getString)
  
      }
    
    switch (getString) {
      case "view":
        return(
          <div className="row">
            <Home admin={this.state.admin} contractAddress={cons.SC} version="2" wallet={this.state.binanceM} currentAccount={verWallet}/>
          </div>
        );
      case "old":
        return(
          <div className="row">
            <Home admin={this.state.admin} contractAddress={cons.SC} version="2" wallet={{
          web3: this.state.binanceM.web3,
          contractToken: this.state.binanceM.contractToken,
          contractBinary: this.state.binanceM.contractInfinity,
          contractInfinity: this.state.binanceM.contractInfinity
        }}  currentAccount={verWallet}/>
          </div>
        );
      default:
        return(
          <div className="row">
            <Home admin={this.state.admin} contractAddress={cons.SC} version="2" wallet={this.state.binanceM} currentAccount={this.state.currentAccount}/>
          </div>
        );
    }

      
  
  }
}
export default App;