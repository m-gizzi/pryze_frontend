import React, { Component } from 'react';
import PaymentPage from './components/PaymentPage'
import LandingPage from './components/LandingPage';

class App extends Component {
  constructor() {
    super()
    this.state = {
      amountToCharge: 0.00
    }
  }

  handleAmountForm = (event) => {
    console.log(event.target.value)
    this.setState({
      amountToCharge: event.target.value
    })
  }

  render = () => {
    return (
      <div className="App">
        <div className="center-container">
          <LandingPage handleAmountForm={this.handleAmountForm} amountToCharge={this.state.amountToCharge} />
          <PaymentPage amountToCharge={this.state.amountToCharge} />
        </div>
      </div>
    );
  }
}

export default App;
