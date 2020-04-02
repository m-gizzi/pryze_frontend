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
                this.setState({
                    user: {
                        username: '',
                        password: ''
                    },
                    error: []
                })
                document.getElementById('login-form').reset()
            } else if (respStatus === 401) {
                this.setState({
                    error: [
                        resp.message
                    ]
                })
            }
        })
    }

    renderErrors = () => {
        return this.state.error.map((error, index) => {
            return <p key={index} >{error}</p>
        })
    }

    render = () => {
        console.log(this.state)
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
                <button style={{display:this.props.currentUser ? 'none' : 'initial'}} type='button' >Sign Up</button>
            </div>
        )
    }
}