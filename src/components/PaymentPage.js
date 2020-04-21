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
import { URL } from '../constants'

export default class PaymentPage extends Component {

    constructor(props) {
      super(props)
      this.state = {
        errorMessages: [],
        saveCard: false,
        postalCode: '',
        displayLoading: false
      }
    }

    handleToggleModal = () => {
      const modal = document.querySelector("#modal");
      modal.classList.toggle("off");
    }

    handleToggleModalTwo = () => {
      const modalTwo = document.querySelector("#modal-sandbox");
      modalTwo.classList.toggle("off");
    }
  
    //  Square defined callback for when the payment form submit button is clicked,
    //  and the response from Square has reached the frontend
    cardNonceResponseReceived = (errors, nonce, cardData, buyerVerificationToken) => {
      if (errors) {
        this.setState({ errorMessages: errors.map(error => error.message) })
        return
      }
      this.setState({ errorMessages: [], displayLoading: true })
      // alert("nonce created: " + nonce + ", buyerVerificationToken: " + buyerVerificationToken)
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

      this.sendFetch(reqObj)
    }

    //  Send the fetch request to my own backend
    //  for handling my own database as well as Square's
    sendFetch = (reqObj) => {
      fetch(`${URL}games`, reqObj)
      .then(resp => resp.json())
      .then(game => {
        if (game.game) {
          this.props.saveCurrentGame(game)
          this.props.history.push(`/results/${game.game.square_payment_id}`)
        } else if (game.errors) {
          this.setState({
            errorMessages: game.errors.map(error => error.detail),
            displayLoading: false
          })
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

    renderCCOF = () => {
      return this.props.currentUser.credit_cards.map(creditCard =>{
        return <option key={creditCard.id} value={creditCard.id} >{`${creditCard.card_brand} ending in ${creditCard.last_four}`}</option>
      })
    }

    //  Package the data needed for Square to handle payment
    //  with saved card instead of entered in the form
    handleSavedCardClick = () => {
      this.setState({
        displayLoading: true
      })
      const selectedCard = document.getElementById('ccof')
      const reqObj = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ccof: selectedCard.value,
          amount: this.props.amountToCharge * 100,
          user: this.props.currentUser,
          postal_code: this.state.postalCode
        })
      }
      this.sendFetch(reqObj)
    }
  
    render() {
      return (
        <div className="payment-form">

          {this.state.displayLoading ?
            <div className="preloader-wrapper active">
              <div className="spinner-layer spinner-red-only">
                <div className="circle-clipper left">
                  <div className="circle"></div>
                </div><div className="gap-patch">
                  <div className="circle"></div>
                </div><div className="circle-clipper right">
                  <div className="circle"></div>
                </div>
              </div>
            </div>

            :
            <div>
              <SquarePaymentForm
                sandbox={true}
                applicationId={'sandbox-sq0idb-gOudPwTBnxbEYKpxdTvKOw'}
                locationId={'3J44BEJN11JNZ'}
                cardNonceResponseReceived={this.cardNonceResponseReceived}
                createVerificationDetails={this.createVerificationDetails}
              >

                    {this.props.currentUser && this.props.currentUser.credit_cards.length !== 0 ?
                      
                      <Fragment>
                        
                      <label htmlFor='ccof'>Select a credit card on file:</label><br/><br/>
                      <div className="ccof-container">
                        <select className="app-drop-down" id='ccof'>
                          {this.renderCCOF()}
                        </select>
                        <button className="pay-credit-card-on-file" onClick={this.handleToggleModal}>Charge this card ${this.props.amountToCharge}</button>
                      </div>
                      <br/>

                      <div>Or use a new one:</div><br/>
                    </Fragment> :
                    
                    null}
                    
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
                      <div className="zip-code-confirmation"><input className="input-number" type='number' id='confirm-zip' value={this.state.postalCode} onChange={this.handleChange} /></div></Fragment> :
                    null}

                    <CreditCardSubmitButton>
                        Charge this card ${this.props.amountToCharge}
                    </CreditCardSubmitButton>
              </SquarePaymentForm>



              
              <div className="sq-error-message">
                {this.state.errorMessages.map(errorMessage =>
                  <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
                )}
              </div>

              <div className="modal off" id="modal">
                <h2>Charge this card ${this.props.amountToCharge}?</h2>
                <div className="content">Please confirm this is the amount you meant.</div>
                <div className="actions">
                  <button onClick={this.handleSavedCardClick} className="toggle-button blue-buttons">Yes, charge me</button>
                  <button onClick={this.handleToggleModal} className="toggle-button blue-buttons">No, take me back</button>
                </div>
              </div>

              <div className="modal sandbox" id="modal-sandbox">
                <h2>Square Sandbox</h2>
                <div className="content">There is only one credit card that works for this sandbox environment:<br/>
                Card number: 4111 1111 1111 1111<br/>
                Expiration: 12/21<br/>
                Zipcode: 11111<br/>
                CVV: 111</div>
                <div className="actions">
                <button onClick={this.handleToggleModalTwo} className="toggle-button blue-buttons">Got it!</button>
                </div>
              </div>

            </div>
          }
        </div>
        
      )
    }
  }