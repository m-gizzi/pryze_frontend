import React, { Component } from 'react';
import PaymentPage from './components/PaymentPage'

class App extends Component {
  render = () => {
    return (
      <div className="App">
        <div className="center-container">
          <PaymentPage />
        </div>
      </div>
    );
  }
}

export default App;
