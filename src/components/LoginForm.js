import React, { Component } from "react";

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
    }

    renderErrors = () => {
        return this.state.error.map((error, index) => {
            return <p key={index} >{error}</p>
        })
    }

    render = () => {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor='login-username'>Username</label>
                <input type='text' required onChange={this.handleInputChange} id='login-username' name='username' value={this.state.username}/><br/>
                <label htmlFor='login-password'>Password</label>
                <input type='password' required onChange={this.handleInputChange} id='login-password' name='password' value={this.state.password}/><br/>
                <input type='submit' value='Log In' /><br />
                <div>{this.state.error ? <div>{this.renderErrors()}</div> : ''}</div>
            </form>
        )
    }
}