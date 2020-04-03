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
                localStorage.setItem("pryzeToken", resp.token)
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

    renderErrors = () => {
        return this.state.error.map((error, index) => {
            return <p key={index} >{error}</p>
        })
    }

    render = () => {
        if (this.props.currentUser) {
            return <Redirect to='/' />
        } else {
            return (
                <div>
                    <form id='login-form' onSubmit={this.handleSubmit}>
                        <label htmlFor='login-username'>Username</label>
                        <input type='text' required onChange={this.handleInputChange} id='login-username' name='username' value={this.state.username}/><br/>
                        <label htmlFor='login-password'>Password</label>
                        <input type='password' required onChange={this.handleInputChange} id='login-password' name='password' value={this.state.password}/><br/>
                        <input type='submit' value='Log In' /><br />
                        <div>{this.state.error ? <div>{this.renderErrors()}</div> : ''}</div>
                    </form>
                    <p>Don't have an account yet?  Sign up instead!</p>
                    <a href='/signup'><button type='button' >Sign Up</button></a><br />
                    <button type='button' onClick={this.handleBack} >Back</button>
                </div>
            )
        }
    }
}