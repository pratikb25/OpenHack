import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-responsive-modal'
import { Link } from 'react-router-dom'
import Autosuggest from 'react-autosuggest';
import AdminNavbar from './AdminNavbar';
import {Redirect} from 'react-router';
import { frontend, url } from '../config/config';
var swal = require('sweetalert')


class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            email:JSON.parse(localStorage.getItem('user')),
            screenName:'',
            aboutMe:'',
            address:'',
            businessTitle:'',
            portraitUrl:'',
            id:0,
            organization:'',
            orgName:'',
            orgDiscp:'',
            orgStreet:'',
            orgCity:'',
            orgState:'',
            orgZip:'',
            openCreate: false,
            openLeave: false,
            openJoin: false,
            value: '',
            suggestions: [],
            organizations:[]
         }
         this.handleEvent=this.handleEvent.bind(this);
         this.submitEvent=this.submitEvent.bind(this);
         this.submitCreateOrgEvent=this.submitCreateOrgEvent.bind(this);
         this.leaveOrganizationEvent=this.leaveOrganizationEvent.bind(this);
         this.joinOrganizationEvent=this.joinOrganizationEvent.bind(this);
         this.getSuggestions=this.getSuggestions.bind(this)
    }

    onOpenCreateModal = (e) => {
        e.preventDefault();
        this.setState({ openCreate: true });
      };
    
    onCloseCreateModal = (e) => {
        e.preventDefault();
        this.setState({ openCreate: false });
    };

    onOpenLeaveModal = (e) => {
        e.preventDefault();
        this.setState({ openLeave: true });
      };
    
    onCloseLeaveModal = (e) => {
        e.preventDefault();
        this.setState({ openLeave: false });
    };

    onOpenJoinModal = (e) => {
        e.preventDefault();
        this.setState({ openJoin: true });
      };
    
    onCloseJoinModal = (e) => {
        e.preventDefault();
        this.setState({ openJoin: false });
    };

    onChangeValue = (event, { newValue, method }) => {
        this.setState({
          value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        this.setState({
          suggestions: this.getSuggestions(value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
          suggestions: []
        });
    };

    getSuggestions = value => {
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;
      
        return inputLength === 0 ? [] : this.state.organizations.filter(org =>
          org.name.toLowerCase().slice(0, inputLength) === inputValue
        );
      };
      
    getSuggestionValue = suggestion => suggestion.name;

    renderSuggestion = suggestion => (
        <span>{suggestion.name}</span>
      );

    handleEvent(e){
        let target=e.target
        let name=target.name;
        this.setState({
            [name]:target.value    
        });
        console.log("handle Event for update profile")
    }

    submitEvent(e){
        e.preventDefault();

        const id=this.state.id

        const data=({
            email:this.state.email,
            name:this.state.name,
            aboutMe:this.state.aboutMe,
            address:this.state.address,
            businessTitle:this.state.businessTitle,
            portraitUrl:this.state.portraitUrl
        })
        
        axios.put(url+`/user/profile/${this.state.id}`,data)
        .then((response) => {
                this.setState({
                    name:response.data.name,
                    aboutMe:response.data.aboutMe,
                    address:response.data.address,
                    businessTitle:response.data.businessTitle,
                    portraitUrl:response.data.portraitUrl
                })
                console.log(response.data);
                swal("Profile updated","Updated","success")
        });
    }

    submitCreateOrgEvent(e){
        e.preventDefault();

        const orgData=({
            name: this.state.orgName,
            description: this.state.orgDiscp,
            address:{
                street: this.state.orgStreet,
                city: this.state.orgCity,
                state: this.state.orgState,
                zip: this.state.orgZip
            },
            owner:{
                id:this.state.id
            }
        })

        axios.post(url+'/organization', orgData)
        .then(
            (response) => {
                const data=({
                    email:this.state.email,
                    name:this.state.name,
                    aboutMe:this.state.aboutMe,
                    address:this.state.address,
                    businessTitle:this.state.businessTitle,
                    portraitUrl:this.state.portraitUrl,
                    organization:response.data
                });
                axios.put(url+`/user/profile/${this.state.id}`,data)
                .then();
                console.log(response.data);
            }
        );

        this.onCloseCreateModal(e);
        swal("Created Organization","You are member of this organization","success")
    }

    leaveOrganizationEvent(e){
        e.preventDefault();

        axios.put(url+`/organization/${this.state.organization.id}/leave/${this.state.id}`)
        .then((response) => {
                console.log(response.data);
        });

        this.onCloseLeaveModal(e);
        swal("Left Organization","You are no more member of any organization","success")

    }

    joinOrganizationEvent(e){
        e.preventDefault();

        const inputValue = this.state.value.trim().toLowerCase();
        const inputLength = inputValue.length;
      
        const currVal = inputLength === 0 ? [] : this.state.organizations.filter(org =>
          org.name.toLowerCase().slice(0, inputLength) === inputValue
        );
        console.log(currVal)

        axios.put(url+`/organization/${currVal[0].id}/join/${this.state.id}`)
        .then((response) => {
            console.log(response.data);
        });

        this.onCloseJoinModal(e);
        swal("Join organization request sent to owner","Once approved organization will be visible in your profile","success")

    }

    componentWillMount(){
        console.log("localStorage",localStorage.getItem('user'))
        const email=JSON.parse(localStorage.getItem('user'));
        axios.get(url+`/user/profile/${email}`)
        .then((response) => {
                this.setState({
                    id:response.data.id,
                    screenName:response.data.screenName,
                    name:response.data.name,
                    aboutMe:response.data.aboutMe,
                    address:response.data.address,
                    businessTitle:response.data.businessTitle,
                    portraitUrl:response.data.portraitUrl,
                    organization:response.data.organization
                })
                console.log(response.data);
        });
        axios.get(url+'/organizations')
        .then((response)=> {
            this.setState({
                organizations:response.data
            })
            console.log(response.data);
        });
    }

    goToOrg = (e) => {
        this.props.history.push({
            pathname: '/organization',
            state: { detail: this.state.organization.id }
          })
    }

    render() { 
        let redirectVar = null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        return ( <div>
             {redirectVar}
            <AdminNavbar />
                   <div className="container-fluid">
            <div className="row">
                <div className=" col-lg-7 mb-5  mt-5 ml-5 bg-white border border-light" >
                    <form onSubmit={this.submitEvent}>
                        <h3 className="text-left mt-4 ">Profile Information</h3>
                        <hr></hr>   
                        <div className="mt-4 mr-5"   >
                        <span className="text-info font-weight-bold">Screen Name:</span>
                            <input type="text" className=" ml-4 btn-lg col-lg-7 pull-right"  value={this.state.screenName} disabled/>
                        </div><br></br>

                        <div className="mt-4 mr-5" >
                           <span className="text-info font-weight-bold">Email:</span>
                            <input type="text" className=" btn-lg col-lg-7 pull-right" value={this.state.email} disabled />
                        </div>

                        <div className="mt-4 mr-5"   >
                        <span className="text-info font-weight-bold">Full Name:</span>
                            <input type="text" className=" ml-4 btn-lg col-lg-7 pull-right" name="name" id="name" onChange={this.handleEvent} placeholder={this.state.name}/>
                        </div><br></br>
                        
                        <div className="mt-5 mr-5">
                            <span className="text-info font-weight-bold">About Me:</span>
                            <textarea rows="6" cols="40" className="mt-4 ml-5 btn-lg pull-right" onChange={this.handleEvent} placeholder={this.state.aboutMe} name="aboutMe" id="aboutMe"   max="500"/>
                        </div><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>

                        <div className="mt-4 mr-5"  >
                         <span className="text-info font-weight-bold">Business Title:</span>
                            <input type="text" className="btn-lg ml-5 col-lg-7 pull-right" onChange={this.handleEvent} placeholder={this.state.businessTitle} name="business_title" defaultValue={this.state.businessTitle} id="business_title"  />
                        </div><br></br>

                        <div className="mt-4 mr-5"  >
                         <span className="text-info font-weight-bold">Portrait URL:</span>
                            <input type="text" className="btn-lg ml-4 col-lg-7 pull-right" onChange={this.handleEvent} placeholder={this.state.portraitUrl} name="portraitUrl" id="portraitUrl" defaultValue={this.state.portraitUrl}  />
                            <br></br><br></br>
                            <br></br>
                            <a  href={this.state.portraitUrl}  target="_blank" className="ml-5 pull-right"><h6 className="ml-5 text-danger">  Click here to View the Portrait:</h6></a>
                        </div><br></br>
                        
                        <div className="mt-4 mr-5 mb-4"  >
                         <span className="text-info font-weight-bold">Address</span>
                            <input type="text" className="btn-lg ml-3 col-lg-7 pull-right" onChange={this.handleEvent} placeholder={this.state.address} name="address" id="address" defaultValue={this.state.address} />
                        </div><br></br>
                       
                    
                    <div className="row text-center mt-4 ml-5">
                         <button type="submit" className="mt-4 mb-4 ml-5 btn btn-submit bg-primary text-white btn-lg ">Save Changes</button>
                    </div>
                    </form>
                </div>
               
                {/* <div className="col-lg-3 text-left mt-5 border-left" >
                </div> */}

            </div>
        </div>
        </div> );
    }
}
 
export default Profile;