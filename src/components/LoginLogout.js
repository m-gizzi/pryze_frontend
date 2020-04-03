import React from "react";

const LoginLogout = (props) => {
    return (
            props.currentUser ?
            <button type='button' onClick={props.handleLogOut}>Log Out</button> :
            <div>
                <a href='/signup'><button type='button' >Sign Up</button></a>
                <a href='/login'><button type='button' onClick={undefined}>Log In</button></a>
            </div>
    )
}

export default LoginLogout