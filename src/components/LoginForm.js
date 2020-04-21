import React, { Component } from "react";
import { Redirect } from "react-router-dom";

export default class LoginForm extends Component {
    constructor() {
        super()
        this.state = {
            user: {
                username: '',
                password: ''
            },
            error: []
        }
    }

    handleInputChange = (event) => {
        this.setState({
            user: {
                ...this.state.user,
                [event.target.name]: event.target.value
            }
        })
    }

    handleSubmit = (event) => {
        event.preventDefault()
        let respStatus
        const reqObj = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.user)
          }
        fetch('http://localhost:3000/auth/login', reqObj)
        .then(resp => {
            respStatus = resp.status
            return resp.json()
        })
        .then(resp => {
            if (respStatus === 202) {
                this.props.handleCurrentUser(resp.user)
                localStorage.setItem("pryzeToken", resp.token) // set JWT for future logins
            } else if (respStatus === 401) {
                this.setState({
                    error: [
                        resp.message
                    ]
                })
            }
        })
    }

    handleBack = () => {
        this.props.history.push('/')
    }

    handleSignUpClick = () => {
        this.props.history.push('/signup')
    }

    renderErrors = () => {
        return this.state.error.map((error, index) => {
            return <li key={index} >{error}</li>
        })
    }

    render = () => {
        if (this.props.currentUser) {
            return <Redirect to='/' />
        } else {
            return (
                <div>
                    <form className="log-in-form" id='login-form' onSubmit={this.handleSubmit}>
                        <div className="form-row"><span className="input-label"><label htmlFor='login-username'>Username</label></span>
                        <input className="input-text" type='text' required onChange={this.handleInputChange} id='login-username' name='username' value={this.state.username}/></div><br/>
                        <div className="form-row"><span className="input-label"><label htmlFor='login-password'>Password</label></span>
                        <input className="input-text" type='password' required onChange={this.handleInputChange} id='login-password' name='password' value={this.state.password}/></div><br/>
                        <input className="blue-buttons" type='submit' value='Log In' />
                        {this.state.error ? <div className="sq-error-message">{this.renderErrors()}</div> : ''}
                        <p className="centered-text">Don't have an account yet?  Sign up instead!</p>
                        <button className="blue-buttons" onClick={this.handleSignUpClick} type='button' >Sign Up</button>
                        <button className="blue-buttons" type='button' onClick={this.handleBack} >Back</button>
                    </form>
                </div>
            )
        }
    }
}