import React, { Component } from "react";
import LoginLogout from "../components/LoginLogout";
import ResultsMap from "../components/ResultsMap"

export default class ResultsPage extends Component {
    constructor() {
        super()
        this.state = {
            selectedFundraiser: null
        }
    }

    //  Removes an extra unnessecary fetch request if the user has followed normal flow
    componentDidMount = () => {
        if (!this.props.currentGame.game || this.props.currentGame.game.square_payment_id !== this.props.match.params.id) {
            fetch(`https://pryze-backend.herokuapp.com/games/${this.props.match.params.id}`)
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
                return <li className="hoverable-li" key={donationEntry.donation.id } onMouseMove={() => this.handleClick(donationEntry)} >
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

    handleClick = (donationEntry) => {
        this.setState({
            selectedFundraiser: donationEntry
        })
    }

    handleClose = () => {
        this.setState({
            selectedFundraiser: null
        })
    }
    
    render = () => {
        return (
            <div>
                <div className="outer-map-container">
                    <div className="result-info-container">
                        <div>These are the results of your donation:</div>
                        <div className='donation-scroll'>
                            <ul>
                                {this.renderDonations()}
                            </ul>
                        </div>
                        <div>Total: ${this.renderTotal()}</div>
                    </div>
                    <ResultsMap
                        currentGame={this.props.currentGame} 
                        selectedFundraiser={this.state.selectedFundraiser}
                        handleClick={this.handleClick}
                        handleClose={this.handleClose}/>
                </div>
                <LoginLogout currentUser={this.props.currentUser} handleLogOut={this.props.handleLogOut} history={this.props.history}/>
                <div className="home-container"><button className="blue-buttons" type='button' onClick={this.handleHome} >Home</button></div>
            </div>
        )
    }
}