import React, { Component } from 'react';
import Navbar from './Navbas';

class NotAuthorized extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }

    render() { 
        return ( 
        <div>
            <Navbar />
        <div className="container">
            <div className="ml-5 mt-5 mr-5 bg-light">
                <h3 className="ml-3 mt-3 p-4">Verify the link sent to your email to proceed!</h3>
                <p className="text-danger"></p><a className="ml-3 mt-5 p-4" href="/login">Click her to proceed to Login</a><br></br>
            </div>
         </div>
        </div> );
    }
}
 
export default  NotAuthorized;