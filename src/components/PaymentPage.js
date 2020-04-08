import React, { Component, Fragment } from 'react'
import {
    SquarePaymentForm,
    CreditCardNumberInput,
    CreditCardExpirationDateInput,
    CreditCardPostalCodeInput,
    CreditCardCVVInput,
    CreditCardSubmitButton
  } from 'react-square-payment-form'
import 'react-square-payment-form/lib/default.css'

export default class PaymentPage extends Component {

    constructor(props) {
      super(props)
      this.state = {
        errorMessages: [],
        saveCard: false,
        postalCode: ''
      }
    }
  
    cardNonceResponseReceived = (errors, nonce, cardData, buyerVerificationToken) => {
      if (errors) {
        this.setState({ errorMessages: errors.map(error => error.message) })
        return
      }
      this.setState({ errorMessages: [] })
      alert("nonce created: " + nonce + ", buyerVerificationToken: " + buyerVerificationToken)
      const reqObj = {
          method: "POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nonce: nonce,
            token: buyerVerificationToken,
            amount: this.props.amountToCharge * 100,
            user: this.props.currentUser,
            postal_code: this.state.postalCode
          })
      }
      fetch("http://localhost:3000/games", reqObj)
      .then(resp => resp.json())
      .then(game => {
        console.log(game)
        if (game.game) {
          this.props.saveCurrentGame(game)
          this.props.history.push(`/results/${game.game.square_payment_id}`)
        }
      })
      .catch(error => console.log(error))
    }
  
    createVerificationDetails = () => {
      let givenName
      let email
      if (this.props.currentUser) {
        givenName = this.props.currentUser.full_name
        email = this.props.currentUser.email
      }
      return {
        amount: (this.props.amountToCharge * 100).toString(),
        currencyCode: "USD",
        intent: "CHARGE",
        billingContact: {
          givenName: givenName,
          email: email,
        }
      }
    }

    handleCheck = () => {
      this.setState(prevState => ({
        saveCard: !prevState.saveCard
      }))
    }

    handleChange = (event) => {
      this.setState({
        postalCode: event.target.value
      })
    }
  
    render() {
      return (
        <div>

          <SquarePaymentForm
            sandbox={true}
            applicationId={'sandbox-sq0idb-gOudPwTBnxbEYKpxdTvKOw'}
            locationId={'3J44BEJN11JNZ'}
            cardNonceResponseReceived={this.cardNonceResponseReceived}
            createVerificationDetails={this.createVerificationDetails}
          >
                <fieldset className="sq-fieldset">
                    <CreditCardNumberInput />
                    <div className="sq-form-third">
                    <CreditCardExpirationDateInput />
                    </div>

                    <div className="sq-form-third">
                    <CreditCardPostalCodeInput />
                    </div>

                    <div className="sq-form-third">
                    <CreditCardCVVInput />
                    </div>
                </fieldset>

                {this.props.currentUser ?
                <Fragment>
                  <label htmlFor='save-card' >Check this box to save this card for later use </label>
                  <input onChange={this.handleCheck} type="checkbox" id='save-card' checked={this.state.saveCard}></input><br/></Fragment> :
                null}

                {this.state.saveCard ?
                <Fragment>
                  <label htmlFor='confirm-zip'>To confirm please reenter your billing postal code: </label>
                  <input type='number' required id='confirm-zip' value={this.state.postalCode} onChange={this.handleChange} /></Fragment> :
                null}

                <CreditCardSubmitButton>
                    Pay ${this.props.amountToCharge}
                </CreditCardSubmitButton>
          </SquarePaymentForm><br/>



          
          <div className="sq-error-message">
            {this.state.errorMessages.map(errorMessage =>
              <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
            )}
          </div>
  
        </div>
      )
    }
  }