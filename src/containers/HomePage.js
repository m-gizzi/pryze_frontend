import React from "react";
import LoginLogout from "../components/LoginLogout";

const HomePage = (props) => {

    const handleSubmit = (event) => {
        event.preventDefault()
    }
    
    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input onChange={props.handleAmountForm} type="number" min='.01' step=".01" value={props.amountToCharge} /><br/>
                <input type='submit' value='Play!'/>
            </form><br/>
            <LoginLogout handleLogOut={props.handleLogOut} currentUser={props.currentUser} />
        </div>
    )
}

export default HomePage