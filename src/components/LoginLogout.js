import React from "react";

const LoginLogout = (props) => {
    return (
        <div>
            <button style={{display:props.currentUser ? 'none' : 'initial'}} type='button' >Sign Up</button>
            {props.currentUser ?
            <button type='button' onClick={props.handleLogOut}>Log Out</button> :
            <a href='/login'><button type='button' onClick={undefined}>Log In</button></a>}
        </div>
    )
}

export default LoginLogout