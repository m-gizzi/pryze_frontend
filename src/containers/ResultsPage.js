import React, { Component } from "react";
import LoginLogout from "../components/LoginLogout";
import ResultsMap from "../components/ResultsMap"

export default class ResultsPage extends Component {

    componentDidMount = () => {
        if (!this.props.currentGame.game || this.props.currentGame.game.square_payment_id !== this.props.match.params.id) {
            fetch(`http://localhost:3000/games/${this.props.match.params.id}`)
            .then(resp => resp.json())
            .then(game => {
                this.props.saveCurrentGame(game)
            })
        }
    }

    renderDonations = () => {
        const { game } = this.props.currentGame
        if (game) {
            return game.donations.map(donationEntry => {
                return <li key={donationEntry.donation.id}>
                    {`${donationEntry.fundraiser.name} - $${donationEntry.donation.amount.toFixed(2)}`}
                </li>
            })
        }
    }

    renderTotal = () => {
        const { game } = this.props.currentGame
        if (game) {
            const result = game.donations.reduce((total, donationEntry) => {
                return total + donationEntry.donation.amount
            }, 0)
            return result.toFixed(2)
        }
    }

    handleHome = () => {
        window.location.replace('/')
    }
    
    render = () => {
        return (
            <div>
                <p>These are the results of your donation:</p>
                <ul>
                    {this.renderDonations()}
                </ul>
                <div>Total: ${this.renderTotal()}</div><br/>
                <ResultsMap
                    currentGame={this.props.currentGame} />
                <LoginLogout currentUser={this.props.currentUser} handleLogOut={this.props.handleLogOut} history={this.props.history}/><br/>
                <button type='button' onClick={this.handleHome} >Home</button>
            </div>
        )
    }
}