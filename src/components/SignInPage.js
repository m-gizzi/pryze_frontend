import React, { Component } from "react";

export default class SignInPage extends Component {
    constructor() {
        super()
        this.state = {
            user: {
                username: '',
                full_name: '',
                password: '',
                password_confirmation: '',
                email: ''
            },
            error: ''
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
        if (event.target.password.value === event.target.password_confirmation.value) {
            const reqObj = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            }
            fetch('http://localhost:3000/users', reqObj)
            .then(resp => resp.json())
            .then(resp => {
                console.log(resp)
                this.setState({
                    error: ''
                })
            })
            .catch(error => console.log(error))
        } else {
            this.setState({
                error: 'Passwords do not match'
            })
        }
    }

    render = () => {
        return (
            <form onSubmit={this.handleSubmit}>
                <label htmlFor='username'>Username</label>
                <input type='text' required onChange={this.handleInputChange} id='username' name='username' value={this.state.username}/><br/>
                <label htmlFor='full-name'>Full Name</label>
                <input type='text' required onChange={this.handleInputChange} id='full-name' name='full_name' value={this.state.full_name}/><br/>
                <label htmlFor='password'>Password</label>
                <input type='password' required onChange={this.handleInputChange} id='password' name='password' value={this.state.password}/><br/>
                <label htmlFor='password-confirm'>Confirm Password</label>
                <input type='password' required onChange={this.handleInputChange} id='password-confirm' name='password_confirmation' value={this.state.password_confirmation}/><br/>
                <label htmlFor='email'>Email</label>
                <input type='text' required onChange={this.handleInputChange} id='email' name='email' value={this.state.email}/><br/>
                <input type='submit' value='Sign Up' /><br />
                <div>{this.state.error}</div>
            </form>
        )
    }
}