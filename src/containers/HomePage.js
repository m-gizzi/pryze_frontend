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

    handleSubmit = (event) => {
        event.preventDefault()
        this.setState({
            displayPayment: true
        })
    }
    
    render = () => {
        // debugger
        return (
            <div>
                <form className="amount-form" onSubmit={this.handleSubmit}>
                    <span onClick={this.props.handleAmountButtons} className="input-number-decrement">–</span>
                    <span className="input-label-dollar">$</span>
                    <input className="input-number" type="number" onChange={this.props.handleAmountForm} value={this.props.amountToCharge} />
                    <span onClick={this.props.handleAmountButtons} className="input-number-increment">+</span>
                    <input className="blue-buttons" type='submit' value='Play!'/>
                </form><br/>
                {this.state.displayPayment ?
                <PaymentPage 
                    displayStatus={this.state.displayPayment} 
                    amountToCharge={this.props.amountToCharge.toFixed(2)} 
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