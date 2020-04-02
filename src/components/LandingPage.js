import React, { Component } from "react";

export default class LandingPage extends Component {
    constructor() {
        super()
        this.state = {

        }
    }

    render = () => {
        return (
            <div>
                <form>
                    <input onChange={this.props.handleAmountForm} type="number" min='.01' step=".01" value={this.props.amountToCharge} />
                </form>
            </div>
        )
    }
}