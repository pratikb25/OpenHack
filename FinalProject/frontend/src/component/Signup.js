import React, { Component } from 'react';
import firebase from 'firebase';
import {NavLink} from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbas';
import swal from 'sweetalert';
import { frontend, url } from '../config/config';
const config = {
    apiKey: "AIzaSyB3Zwh6ZNXExXKzsnQWmCcw9C8em0Sq0A4",
    authDomain: "cmpe275-922ad.firebaseapp.com",
    databaseURL: "https://cmpe275-922ad.firebaseio.com",
    projectId: "cmpe275-922ad",
    storageBucket: "cmpe275-922ad.appspot.com",
    messagingSenderId: "681106181388",
    appId: "1:681106181388:web:3f1e42b24333fe8a"
  };

const fire=firebase.initializeApp(config);


class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            screenName:'',
            name:'',
            email:'',
            password: '',
            portraitUrl:'',
            businessTitle:'',
            aboutMe:'',
            address:'',
            error_message:" ",
            unique:false
         }
         this.setField=this.setField.bind(this);
         this.submitEvent=this.submitEvent.bind(this);
         this.setScreenName=this.setScreenName.bind(this);
    }

    setField(e){
        var target=e.target;
        var value=target.value;
        var name=target.name;
        this.setState({
            [name]:value
        })
    }

    setScreenName(e){

        console.log("screenname",e.target.value)
        var target=e.target;
        var value=target.value;
        var name=target.name;
        this.setState({
            [name]:value
        })
        console.log("screenname",this.state.screenName)
        if(e.target.value.includes(" ")){
            this.setState({error_message:"Screen Name can't contain space"})
        }else if(e.target.value.length<3){
            this.setState({error_message:"Screen Name should be atleast 3 characters"})
        }else{
        this.setState({error_message:" "})
        axios.get(url+`/user/profile/sn/${e.target.value}`)
        .then((response) => {
            if(response.status==201){
              this.setState({error_message:" Screen Name is available",
            unique:true})
            }
            if(response.status==200){
                this.setState({error_message:"Not available",
                unique:false})
            }
         }).catch(function(error) {
            console.log("error occured",error)
            // window.alert(error.code)
        });

        }

       
    }

    submitEvent(e){
        e.preventDefault();
        console.log("Inside signup form submission")
        var email=this.state.email
        var password=this.state.password
        console.log("submitin request",email,this.state.screenName)

        const data = {
            screenName:this.state.screenName,
            name:this.state.name,
            email : this.state.email,
            password : this.state.password,
            portraitUrl:this.state.portraitUrl,
            businessTitle:this.state.businessTitle,
            aboutMe:this.state.aboutMe,
            address:this.state.address
        }

        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
            console.log("User(Register)",user)
            // this.props.history.push('/');
            var user = firebase.auth().currentUser;
            user.sendEmailVerification().then(function() {
                console.log("Email successfully sent")

                    axios.post(url+'/user/signup', data)
                    .then((response) => {
                        console.log("Response received",response)
                        swal("Registration Successful","Verify the email link sent before Login!","success")
                     });
            }).catch(function(error) {
                console.log("error occured",error)
                //window.alert(error.code)
            });

        })
        .catch((error) => {
            console.log("error in sign up",error.code);
            if(error.code=="auth/email-already-in-use")
               swal("Account already exists with this account!","Please try again!","error")
            else if(error.code=="auth/invalid-email")
                swal("Invalid Email format!","Please try again!","error")
            else if(error.code=="auth/weak-password")
                swal("Weak Password","Please try again!","error")
            else
                console.log(error.code)
        });
    }

    render() { 
        return ( 
            <div>
                 <Navbar />
            <div className="text-center mt-5">
               <h1 class="title pt-2">Sign up for Hackathon</h1>
                Already have an account?<strong><NavLink to="/login"> Log in!</NavLink></strong>
               <form onSubmit={this.submitEvent}>

                <div class="form-group row">
                    <div class="col-sm-3">                                            
                    </div>    
                    <div class="col-sm-6">   
                    <input type="text" name="name" id="name" class="panel-input mt-2" placeholder="Full Name" onChange={this.setField} required/>                          
                    </div>
                    <div class="col-sm-3">                        
                    </div>             
                </div>

                <div class="form-group row">
                    <div class="col-sm-3">                                            
                    </div>    
                    <div class="col-sm-6">                  
                    <input type="text" name="screenName" id="screenName" class="panel-input mt-3" onChange={this.setScreenName} placeholder="Screen Name" required/>
                <h6 className="text-danger">{this.state.error_message}</h6>      
                    </div>
                    <div class="col-sm-3">                        
                    </div>             
                </div>

                <div class="form-group row">
                    <div class="col-sm-3">                                            
                    </div>    
                    <div class="col-sm-6">     
                    <input type="email" name="email" id="email" class="panel-input mt-3" onChange={this.setField} placeholder="Email address" required/>                   
                    </div>
                    <div class="col-sm-3">                        
                    </div>             
                </div>

                <div class="form-group row">
                    <div class="col-sm-3">                                            
                    </div>    
                    <div class="col-sm-6">   
                    <input type="password" name="password" id="password" class="panel-input mt-3" onChange={this.setField}    placeholder="Password" required/>                     
                    </div>
                    <div class="col-sm-3">                        
                    </div>             
                </div>               


                  {/* <div>
               <input type="text" name="portraitUrl" id="portraitUrl" class="panel-input mt-3 w-50" onChange={this.setField}    placeholder="Portrait URL"/>
                </div>

                  <div>
               <input type="text" name="businessTitle" id="businessTitle" class="panel-input mt-3 w-50" onChange={this.setField}    placeholder="businessTitle"/>
                </div>

                  <div>
               <input type="text" name="aboutMe" id="aboutMe" class="panel-input mt-3 w-50" onChange={this.setField}    placeholder="aboutMe"/>
                </div>

                  <div>
               <input type="text" name="address" id="address" class="panel-input mt-3 w-50" onChange={this.setField}    placeholder="address"/>
                </div>  */}


                <button disabled={!this.state.unique} class="btn btn-submit text-white btn-large custom mt-4"><strong>Sign Me Up</strong></button> 
            
               
             </form>

            </div>
            </div>
         );
    }
}
 
export default Signup;
