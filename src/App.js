import React, { Component } from 'react';
import SignInPage from './components/SignInPage';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import HomePage from './containers/HomePage';
import ResultsPage from './containers/ResultsPage';
import UserPage from './components/UserPage';
import { URL } from './constants';

class App extends Component {
  constructor() {
    super()
    this.state = {
      amountToCharge: 1,
      currentUser: undefined,
      currentGame: {}
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
      fetch(`${URL}auth/autologin`, reqObj)
      .then(resp => resp.json())
      .then(user => this.handleAutoLogin(user.user))
    }
  }

  handleAmountForm = (event) => {
    this.setState({
      amountToCharge: event.target.value
    })
  }

  handleAmountButtons = (event) => {
    // debugger
    if (event.target.className === "input-number-increment") {
      this.setState(prevState => ({
        amountToCharge: parseFloat(prevState.amountToCharge) + 1
      }))
    } else if (event.target.className === "input-number-decrement") {
      if (this.state.amountToCharge > 1) {
        this.setState(prevState => ({
          amountToCharge: parseFloat(prevState.amountToCharge) - 1
        }))
      }
    }
  }

  handleAutoLogin = (user) => {
    this.setState({
      currentUser: user
    })
  }

  handleCurrentUser = (user) => {
    window.history.back()
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

  saveCurrentGame = (game) => {
    this.setState({
      currentGame: game
    })
  }

  render = () => {
    // console.log(this.state.currentUser)
    return (
      <Router>
        <div className="center-container">
          <h1 className="app-title">Pryze</h1>
          <p>{this.state.currentUser ? `Logged in as: ${this.state.currentUser.username}` :
            "Continue as a guest, or login to conveniently see your play history and save your payment options."}
          </p>
          
          <Route exact path="/" render={routerProps => {
            return <HomePage 
              {...routerProps} 
              handleAmountForm={this.handleAmountForm} 
              handleAmountButtons={this.handleAmountButtons}
              amountToCharge={parseFloat(this.state.amountToCharge)} 
              currentUser={this.state.currentUser} 
              handleLogOut={this.handleLogOut}
              saveCurrentGame={this.saveCurrentGame}
            />
          }} />

          <Route exact path="/login" render={routerProps => {
            return <LoginForm 
              {...routerProps} 
              handleCurrentUser={this.handleCurrentUser} 
              currentUser={this.state.currentUser}
            />
          }} />

          <Route exact path='/signup' render={routerProps => {
            return <SignInPage 
              {...routerProps} 
              handleCurrentUser={this.handleCurrentUser} 
              currentUser={this.state.currentUser}
            />
          }} />

          <Route path='/results/:id' render={routerProps => {
            return <ResultsPage 
              {...routerProps} 
              saveCurrentGame={this.saveCurrentGame} 
              currentGame={this.state.currentGame} 
              currentUser={this.state.currentUser}
              handleLogOut={this.handleLogOut}
            />
          }} />

          <Route path='/user/:id' render={routerProps => {
            return <UserPage
              {...routerProps}
              currentUser={this.state.currentUser}
              handleLogOut={this.handleLogOut}
              handleCurrentUser={this.handleAutoLogin}
            />
          }} />
          
        </div>
      </Router>
    );
  }
}

export default App;
