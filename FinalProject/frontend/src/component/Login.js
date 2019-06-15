import React, { Component } from 'react';
import firebase from 'firebase';
import {NavLink} from 'react-router-dom';
import Navbar from './Navbas';
import axios from 'axios';
import { frontend, url } from '../config/config';
// import "../css/login.css"
var swal = require('sweetalert')
// import fire from '../config/fire'

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email:'',
            password: ''
         }
         this.setField=this.setField.bind(this);
         this.submitEvent=this.submitEvent.bind(this);
    }

    setField(e){
        var target=e.target;
        var value=target.value;
        var name=target.name;
        this.setState({
            [name]:value
        })
    }

    async submitEvent(e){
        var headers = new Headers();
        console.log("I am here inside login submit event")
        e.preventDefault();
        var email=this.state.email
        var password=this.state.password

        //firebase authentication
       await firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                  console.log("User(Login)",user)
                  if(firebase.auth().currentUser.emailVerified==false){
                    this.props.history.push('/notAuthorized')
                  } else{
                    window.localStorage.setItem('user', JSON.stringify(email));
  
                        axios.put(url+`/user/profileVerify/${email}`)
                        .then((response) => {
                            console.log("Response received",response)
                        }).catch(function(error) {
                          console.log("error occured",error)
                          //window.alert(error.code)
                      });
                      console.log("before routing",email)
                     if(email.endsWith("@sjsu.edu"))
                       this.props.history.push('/admin/maindashboard');
                     else
                       this.props.history.push('/dashboard');
                  }
            })
            .catch((error) => {
                  console.log("error code(Login)",error.code)
                  if(error.code=="auth/user-not-found")
                   swal("No account exists with given email","Signup first!","error")
                  else if(error.code="auth/wrong-password")
                   swal("Wrong/Invalid password","Login Again!","error")
                  else
                    console.log(error.code)
            });
    }

    render() { 
        return ( 
          <div>
              <Navbar />
            <div className="text-center pull-center mt-5 ">
              <form onSubmit={this.submitEvent}>
              <h1 class="title pt-2">Login to Hackathon</h1>
                Need an account?<strong><NavLink to="/signup"> Sign Up!</NavLink></strong>
                <br></br>          
                <br></br>          

                <div class="form-group row">
                  <div class="col-sm-4">
                  </div>
                  <div class="col-sm-4">
                    <input type="email" name="email" id="email" class="form-control text-center mt-3" onChange={this.setField} placeholder=" Email address" required />                
                  </div>
                  <div class="col-sm-4">
                  </div>
                </div>

                <div class="form-group row">
                  <div class="col-sm-4">
                  </div>
                  <div class="col-sm-4">
                    <input type="password" name="password" id="password" class="form-control text-center mt-3" onChange={this.setField}   placeholder="Password" required />
                  </div>
                  <div class="col-sm-4">
                  </div>
                </div>         
 
                <button class="btn btn-submit text-white btn-large mt-4 custom" onSubmit={this.submitEvent}><strong>Login</strong></button> 
              </form>
            </div>
           </div>
         );
    }
}
 
export default Login;