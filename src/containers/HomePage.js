import React, { Component } from "react";
import LoginLogout from "../components/LoginLogout";
import PaymentPage from "../components/PaymentPage"


export default class HomePage extends Component {
    constructor() {
        super()
        this.state = {
            displayPayment: false
        }
    }

    handleFocus = () => {
        this.setState({
            displayPayment: false
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({
            displayPayment: true
        })
    }
    
    render = () => {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input onFocus={this.handleFocus} onChange={this.props.handleAmountForm} type="number" min='.01' step=".01" value={this.props.amountToCharge} /><br/>
                    <input type='submit' value='Play!'/>
                </form><br/>
                {this.state.displayPayment ?
                <PaymentPage 
                    displayStatus={this.state.displayPayment} 
                    amountToCharge={this.props.amountToCharge} 
                    currentUser={this.props.currentUser}
                    saveCurrentGame={this.props.saveCurrentGame}
                    history={this.props.history}
                /> :
                null}<br/>
                <LoginLogout 
                    handleLogOut={this.props.handleLogOut} 
                    currentUser={this.props.currentUser} 
                    history={this.props.history}
                />
            </div>
        )
    }
}