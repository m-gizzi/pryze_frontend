import React, { Component } from 'react';
import PaymentPage from './components/PaymentPage'
import LandingPage from './components/LandingPage';
import SignInPage from './components/SignInPage';
import Logout from './components/Logout'
import LoginForm from './components/LoginForm';

class App extends Component {
  constructor() {
    super()
    this.state = {
      amountToCharge: 0.01,
      currentUser: ''
    }
  }

  componentDidMount = () => {
    const token = localStorage.getItem('pryzeToken')
    if (token) {
      const reqObj = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({token: token})
      }
      fetch('http://localhost:3000/auth/autologin', reqObj)
      .then(resp => resp.json())
      .then(user => this.handleCurrentUser(user))
    }
  }

  handleAmountForm = (event) => {
    this.setState({
      amountToCharge: event.target.value
    })
  }

  handleCurrentUser = (user) => {
    this.setState({
      currentUser: user
    })
  }

  handleLogOut = () => {
    localStorage.removeItem('pryzeToken')
    this.setState({
      currentUser: ''
    })
  }

  render = () => {
    return (
      <div className="App">
        <div className="center-container">
          <LandingPage handleAmountForm={this.handleAmountForm} amountToCharge={this.state.amountToCharge} />
          <SignInPage handleCurrentUser={this.handleCurrentUser} />
          <PaymentPage amountToCharge={this.state.amountToCharge} />
          <p>Current User: {this.state.currentUser.username}</p>
          <Logout handleLogOut={this.handleLogOut}/>
          <LoginForm />
        </div>
      </div>
    );
  }
}

export default App;
