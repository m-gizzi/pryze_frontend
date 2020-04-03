import React, { Component } from 'react';
import PaymentPage from './components/PaymentPage'
import SignInPage from './components/SignInPage';
import LoginLogout from './components/LoginLogout'
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './containers/HomePage';

class App extends Component {
  constructor() {
    super()
    this.state = {
      amountToCharge: 0.01,
      currentUser: undefined
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
      currentUser: undefined
    })
  }

  render = () => {
    return (
      <Router>
        <div className="App">
          <div className="center-container">
            <h1>Pryze</h1>
            <p>{this.state.currentUser ? `Logged in as: ${this.state.currentUser.username}` : "Continue as a guest, or login to see your play history and save your payment options for convenience."}</p>
            <Route exact path="/" render={routerProps => <HomePage {...routerProps} handleAmountForm={this.handleAmountForm} amountToCharge={this.state.amountToCharge} currentUser={this.state.currentUser} handleLogOut={this.handleLogOut}/>} />
            <Route exact path="/login" render={routerProps => <LoginForm {...routerProps} handleCurrentUser={this.handleCurrentUser} currentUser={this.state.currentUser}/>} />
            <Route exact path='/signup' render={routerProps => <SignInPage {...routerProps} handleCurrentUser={this.handleCurrentUser} currentUser={this.state.currentUser}/>} />
            {/* <PaymentPage amountToCharge={this.state.amountToCharge} /> */}
            {/* <LoginLogout handleLogOut={this.handleLogOut} currentUser={this.state.currentUser}/> */}
            {/* <LoginForm handleCurrentUser={this.handleCurrentUser}/> */}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
