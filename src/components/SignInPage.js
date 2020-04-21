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
                    localStorage.setItem("pryzeToken", resp.token) // set JWT for future logins
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
        this.props.history.push('/')
    }

    handleLoginClick = () => {
        this.props.history.push('/login')
    }

    renderErrors = () => {
        return this.state.error.map((error, index) => {
            return <li className="error-text" key={index} >{error}</li>
        })
    }

    render = () => {
        if (this.props.currentUser) {
            return <Redirect to='/' />
        } else {
            return (
                <div>
                    <form className="sign-in-form" onSubmit={this.handleSubmit}>
                        <div className="form-row"><span className="input-label"><label htmlFor='sign-up-username'>Username</label></span>
                        <input className="input-text" type='text' required onChange={this.handleInputChange} id='sign-up-username' name='username' value={this.state.username}/></div><br/>
                        <div className="form-row"><span className="input-label"><label htmlFor='full-name'>Full Name</label></span>
                        <input className="input-text" type='text' required onChange={this.handleInputChange} id='full-name' name='full_name' value={this.state.full_name}/></div><br/>
                        <div className="form-row"><span className="input-label"><label htmlFor='sign-up-password'>Password</label></span>
                        <input className="input-text" type='password' required onChange={this.handleInputChange} id='sign-up-password' name='password' value={this.state.password}/></div><br/>
                        <div className="form-row"><span className="input-label"><label htmlFor='password-confirm'>Confirm Password</label></span>
                        <input className="input-text" type='password' required onChange={this.handleInputChange} id='password-confirm' name='password_confirmation' value={this.state.password_confirmation}/></div><br/>
                        <div className="form-row"><span className="input-label"><label htmlFor='email'>Email</label></span>
                        <input className="input-text" type='text' required onChange={this.handleInputChange} id='email' name='email' value={this.state.email}/></div><br/>
                        <input className="blue-buttons" type='submit' value='Create Account' />
                        {this.state.error ? <div className="sq-error-message">{this.renderErrors()}</div> : ''}
                        <p className="centered-text">Already have an account?  Log in instead!</p>
                        <button className="blue-buttons" onClick={this.handleLoginClick} type='button' >Log In</button>
                        <button className="blue-buttons" type='button' onClick={this.handleBack} >Back</button>
                    </form>
                </div>
            )
        }
    }
}