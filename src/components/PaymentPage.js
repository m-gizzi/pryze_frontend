import React, { Component } from 'react'
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
            amount: this.props.amountToCharge * 100
          })
      }
      fetch("http://localhost:3000/payments", reqObj)
      .then(resp => resp.json())
      .then(payment => console.log(payment))
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
  
    render() {
      console.log(this.props)
      return (
        <div>
          <h1>Payment Page</h1>
  
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

                <CreditCardSubmitButton>
                    Pay ${this.props.amountToCharge}
                </CreditCardSubmitButton>
          </SquarePaymentForm>
  
          <div className="sq-error-message">
            {this.state.errorMessages.map(errorMessage =>
              <li key={`sq-error-${errorMessage}`}>{errorMessage}</li>
            )}
          </div>
  
        </div>
      )
    }
  }