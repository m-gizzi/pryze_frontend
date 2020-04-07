import React from "react";

const LoginLogout = (props) => {

    const handleSignUpClick = () => {
        props.history.push('/signup')
    }

    const handleLoginClick = () => {
        props.history.push('/login')
    }

    return (
        props.currentUser ?
        <div><button type='button' onClick={props.handleLogOut}>Log Out</button></div> :
        <div>
            <button onClick={handleSignUpClick} type='button' >Sign Up</button>
            <button onClick={handleLoginClick} type='button' >Log In</button>
        </div>
    )
}

export default LoginLogout