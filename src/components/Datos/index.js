import React, { Component } from "react";

export default class Datos extends Component {
  constructor(props) {
    super(props);

    this.state = {
      totalInvestors: 0,
      totalInvested: 0,
      totalRefRewards: 0,
      precioSITE: 1,
      wallet: "",
      plan: 0,
      cantidad: 0,
      hand: 0,
    };

    this.totalInvestors = this.totalInvestors.bind(this);
    this.asignarPlan = this.asignarPlan.bind(this);
  }

  async componentDidMount() {
    if (typeof window.ethereum !== "undefined") {
      var resultado = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      //console.log(resultado[0]);
      this.setState({
        currentAccount: resultado[0],
      });
    }
    setInterval(async () => {
      if (typeof window.ethereum !== "undefined") {
        var resultado = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        //console.log(resultado[0]);
        this.setState({
          currentAccount: resultado[0],
        });
      }
    }, 7 * 1000);
    setInterval(() => this.totalInvestors(), 3 * 1000);
  }


  async totalInvestors() {

    let esto = await this.props.wallet.contractBinary.methods
      .setstate()
      .call({ from: this.state.currentAccount });

    var retirado = await this.props.wallet.contractBinary.methods
      .totalRefWitdrawl()
      .call({ from: this.state.currentAccount });

    var decimales = await this.props.wallet.contractToken.methods
      .decimals()
      .call({ from: this.state.currentAccount });

    var isAdmin = await this.props.wallet.contractBinary.methods.admin(this.state.currentAccount).call({from:this.state.currentAccount});
    

    this.setState({
      totalInvestors: esto.Investors,
      totalInvested: esto.Invested / 10 ** decimales,
      totalRefRewards: esto.RefRewards / 10 ** decimales,
      retirado: retirado / 10 ** decimales,
      admin: isAdmin,
    });
  }

  async asignarPlan() {
    var transaccion = await this.props.wallet.contractBinary.methods
      .asignarMembership(this.state.wallet)
      .send({ from: this.state.currentAccount });
    
    alert("verifica la transaccion " + transaccion);
    setTimeout(
      window.open(`https://bscscan.com/tx/${transaccion}`, "_blank"),
      3000
    );
    this.setState({ plan: 0 });
  }

  render() {
    if (this.state.admin === true) {
      return (
        <div className="row">
        <div className="content-wrapper-before blue-grey lighten-5"></div>
        <div className="col s12">
          <div className="container">


        <div className="row counters">
          <div className="col-lg-3 col-12 text-center text-white">
            <h3>{this.state.totalInvestors}</h3>
            <p>Inversores Globales</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {(this.state.totalInvested / this.state.precioSITE).toFixed(2)}{" "}
              USDT
            </h3>
            <p>total invested</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>
              {(this.state.totalRefRewards / this.state.precioSITE).toFixed(2)}{" "}
              USDT{" "}
            </h3>
            <p>Total referidos</p>
          </div>

          <div className="col-lg-3 col-12 text-center text-white">
            <h3>{this.state.retirado} USDT</h3>
            <p>retirado Global</p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
            Wallet:{" "} <input type="text" onChange={this.handleChangeWALLET} placeholder="0x11134Bd1dd0219eb9B4Ab931c508834EA29C0F8d"/> 
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <input type="number" onChange={this.handleChangeCANTIDAD} placeholder="1000 USDT" />

            <p>
              <button
                type="button"
                className="btn btn-info d-block text-center mx-auto mt-1"
                onClick={async () => {
                  var transaccion =
                    await this.props.wallet.contractToken.methods
                      .transfer(
                        this.state.wallet,
                        parseInt(this.state.cantidad * 10 ** 6)
                      )
                      .send({ from: this.props.wallet.currentAccount });

                  alert("verifica la transaccion " + transaccion);
                  setTimeout(
                    window.open(
                      `https://bscscan.com/tx/${transaccion}`,
                      "_blank"
                    ),
                    3000
                  );
                  this.setState({ cantidad: 0 });
                }}
              >
                Send Token
              </button>
            </p>
          </div>

          <div className="col-lg-3 col-12 text-center">
            <p>
              <button
                type="button"
                className="btn btn-info d-block text-center mx-auto mt-1"
                onClick={() => this.asignarPlan()}
              >
                Asignar Membership
              </button>
            </p>
          </div>
        </div>
        </div>
        </div>
        </div>

      );
    } else {
      return <></>;
    }
  }
}
