import React, { Component } from "react";
import LoginLogout from "./LoginLogout";

export default class UserPage extends Component {
    constructor() {
        super()
        this.state = {
            games: [],
            fundraisers: []
        }
    }

    fetchAdditionalInfo = () => {
        if (this.props.currentUser && 
            this.props.currentUser.square_id === this.props.match.params.id &&
            this.state.games.length === 0) {
            fetch(`http://localhost:3000/users/${this.props.currentUser.id}`)
            .then(resp => resp.json())
            .then(userData => {
                this.props.handleCurrentUser(userData.user)
                this.setState({
                    games: userData.games,
                    fundraisers: userData.fundraisers
                })
            })
        }
    }

    renderCardsOnFile = () => {
        return this.props.currentUser.credit_cards.map(creditCard => {
            return <li key={`card-${creditCard.id}`} >{`${creditCard.card_brand} ending in ${creditCard.last_four}`}</li>
          })
    }

    renderGameHistory = () => {
        let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        return this.state.games.map(game => {
            const DATE_OPTIONS = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: `${timeZone}` }
            const gameDate = new Date(game.created_at).toLocaleDateString('en-US', DATE_OPTIONS)
            return <a href={`/results/${game.square_payment_id}`} key={`game-${game.id}`}><li >{gameDate} - ${game.amount.toFixed(2)}</li></a>
        })
    }

    renderFundraiserScoreCard = () => {
        return this.state.fundraisers.map(fundraiser => {
            return <a href={fundraiser.url} key={`fundraiser-${fundraiser.id}`}><li>{fundraiser.fundraiser_name} - ${fundraiser.donation_amount.toFixed(2)}</li></a>
        })
    }

    handleHome = () => {
        window.location.replace('/')
    }

    render = () => {
        this.fetchAdditionalInfo()
        const { match, currentUser, handleLogOut, history } = this.props
        if (currentUser && currentUser.square_id === match.params.id) {
            return (
                <div className="outer-user-page-container">
                    <div className="user-page-container">

                        <div className="payment-methods">
                            <h1>{currentUser.full_name}</h1>
                            <div>{`Username: ${currentUser.username}`}<br/>
                            {`Email: ${currentUser.email}`}
                            </div><br/>

                            These are your saved payment methods:
                            <div className="payment-methods-scroll">
                                <ul>
                                    {this.renderCardsOnFile()}
                                </ul>
                            </div>
                        </div>

                        <div className="game-history">
                            Here's your game history so far:
                            <div className="game-history-scroll">
                                <ul>
                                    {this.renderGameHistory()}
                                </ul>
                            </div>
                        </div>

                        <div className="fundraisers-sorted">
                            Here are all the fundraisers you've contributed to:
                            <div className="fundraisers-sorted-scroll">
                                <ul>
                                    {this.renderFundraiserScoreCard()}
                                </ul>
                            </div>
                        </div>
                    </div>
                    <LoginLogout
                            handleLogOut={handleLogOut} 
                            currentUser={currentUser} 
                            history={history}
                        />
                    <div className="user-page-home-container"><button className='blue-buttons' type='button' onClick={this.handleHome} >Home</button></div>
                </div>
            )
        } else {
            return (
                <div>
                    <p>You must be logged in to view your account details: </p>
                    <LoginLogout
                        handleLogOut={handleLogOut} 
                        currentUser={currentUser} 
                        history={history}
                    />
                    <div className="user-page-home-container"><button className='blue-buttons' type='button' onClick={this.handleHome} >Home</button></div>
                </div>
            )
        }
    }
}