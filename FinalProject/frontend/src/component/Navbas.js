import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';

class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    render() { 
        return ( <div>
            <nav className="navbar navbar-light bg-faded border-bottom" >
            <div className="h-25 w-25">
            <NavLink to="/" className="mb-0 py-0 img-thumbnail h-25 w-25" ><img src={require('../images/2.png')} /></NavLink>
            </div>
           
            </nav>
        </div> );
    }
}
 
export default Navbar;