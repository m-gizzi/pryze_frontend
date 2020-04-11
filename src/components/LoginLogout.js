import React from "react";

const LoginLogout = (props) => {

    const handleSignUpClick = () => {
        props.history.push('/signup')
    }

    const handleLoginClick = () => {
        props.history.push('/login')
    }

    const handleUserPage = () => {
        props.history.push(`/user/${props.currentUser.square_id}`)
    }

    return (
        props.currentUser ?
        <div>
            <button type='button' onClick={props.handleLogOut}>Log Out</button>
            {props.history.location.pathname.includes("user") ? null : <button type='button' onClick={handleUserPage}>My Account</button>}
        </div> :
        <div>
            <button onClick={handleSignUpClick} type='button' >Sign Up</button>
            <button onClick={handleLoginClick} type='button' >Log In</button>
        </div>
    )
}

export default LoginLogout