import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { frontend, url } from '../config/config';

class UserNavbar extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    handleLogout = () => {
       localStorage.removeItem('user')
    }

    render() { 
        return ( 
        <div>
              <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <a class="navbar-brand" href="#">
                    <img src={require('../images/2.png')} class="d-inline-block align-top" alt=""></img>
                    
                </a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div className="ml-5"></div>
                <div className="ml-5"></div>
              

                <div class="collapse navbar-collapse float-right ml-5" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                    <li class="nav-item active">
                        <a class="nav-link" href="/dashboard"><b>Home</b> <span class="sr-only">(current)</span></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/profile"><b>|   Profile</b></a>
                    </li>      
                    <li class="nav-item">
                        <a class="nav-link" href="/dashboard"><b>|  Dashboard</b></a>
                    </li>
                    <li className="ml-3 mt-1 nav-item"><h6 className="ml-5 text-secondary">Welcome</h6><h6 className="mt-2 text-black">{localStorage.getItem("user")}</h6></li> 
                    <li class="nav-item ml-2">
                        <Link to="/login" class="btn ml-5 p-2 border text-dark" href="#" onClick = {this.handleLogout}><b>LogOut</b></Link>
                    </li>             
                    </ul>
                   
                </div>
                </nav>
            <hr></hr>
        </div>


         );
    }
}
 
export default UserNavbar;
