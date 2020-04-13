import React, { Component } from "react";
import { Redirect } from "react-router-dom";

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
        if (event.target.password.value === event.target.password_confirmation.value) {
            const reqObj = {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state)
            }
            fetch('http://localhost:3000/users', reqObj)
            .then(resp => {
                respStatus = resp.status
                return resp.json()
            })
            .then(resp => {
                this.setState({
                    error: []
                })
                if (respStatus === 201) {
                    this.props.handleCurrentUser(resp.user)
                    localStorage.setItem("pryzeToken", resp.token)
                } else if (respStatus === 406) {
                    Object.values(resp).forEach(error => {
                        this.setState({
                            error: [
                                ...this.state.error,
                                error[0]
                            ]
                        })
                    })
                }
            })
            .catch(error => console.log(error))
        } else {
            this.setState({
                error: [
                    "Passwords do not match"
                ]
            })
        }
    }

    handleBack = () => {
        this.props.history.goBack()
    }

    handleLoginClick = () => {
        this.props.history.push('/login')
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
                    <form onSubmit={this.handleSubmit}>
                        <label htmlFor='sign-up-username'>Username</label>
                        <input type='text' required onChange={this.handleInputChange} id='sign-up-username' name='username' value={this.state.username}/><br/>
                        <label htmlFor='full-name'>Full Name</label>
                        <input type='text' required onChange={this.handleInputChange} id='full-name' name='full_name' value={this.state.full_name}/><br/>
                        <label htmlFor='sign-up-password'>Password</label>
                        <input type='password' required onChange={this.handleInputChange} id='sign-up-password' name='password' value={this.state.password}/><br/>
                        <label htmlFor='password-confirm'>Confirm Password</label>
                        <input type='password' required onChange={this.handleInputChange} id='password-confirm' name='password_confirmation' value={this.state.password_confirmation}/><br/>
                        <label htmlFor='email'>Email</label>
                        <input type='text' required onChange={this.handleInputChange} id='email' name='email' value={this.state.email}/><br/>
                        <input type='submit' value='Create Account' /><br />
                        <div>{this.state.error ? <div>{this.renderErrors()}</div> : ''}</div>
                        <p>Already have an account?  Log in instead!</p>
                        <button onClick={this.handleLoginClick} type='button' >Log In</button><br />
                        <button type='button' onClick={this.handleBack} >Back</button>
                    </form>
                </div>
            )
        }
    }
}