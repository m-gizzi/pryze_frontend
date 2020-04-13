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
            return <a href={`/results/${game.square_payment_id}`} key={`game-${game.id}`}><li >{gameDate} - ${game.amount}</li></a>
        })
    }

    renderFundraiserScoreCard = () => {
        return this.state.fundraisers.map(fundraiser => {
            return <a href={fundraiser.url} key={`fundraiser-${fundraiser.id}`}><li>{fundraiser.fundraiser_name} - ${fundraiser.donation_amount}</li></a>
        })
    }

    handleHome = () => {
        window.location.replace('/')
    }

    render = () => {
        console.log(this.state, this.props.currentUser)
        this.fetchAdditionalInfo()
        const { match, currentUser, handleLogOut, history } = this.props
        if (currentUser && currentUser.square_id === match.params.id) {
            return (
                <div className="user-page-container">
                    <h1>{currentUser.full_name}</h1>
                    <div>{`Username: ${currentUser.username}`}<br/>
                    {`Email: ${currentUser.email}`}
                    </div><br/>

                    <div>
                        These are your saved payment methods:
                        <ul>
                            {this.renderCardsOnFile()}
                        </ul>
                    </div><br/>

                    <div>
                        Here's your game history so far:
                        <div>
                            <ul>
                                {this.renderGameHistory()}
                            </ul>
                        </div>
                    </div><br/>

                    <div>
                        Here are all the fundraisers you've contributed to:
                        <div>
                            <ul>
                                {this.renderFundraiserScoreCard()}
                            </ul>
                        </div>
                    </div><br/>

                    <LoginLogout
                        handleLogOut={handleLogOut} 
                        currentUser={currentUser} 
                        history={history}
                    />
                    <button type='button' onClick={this.handleHome} >Home</button>
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
                    <button type='button' onClick={this.handleHome} >Home</button>
                </div>
            )
        }
    }
}