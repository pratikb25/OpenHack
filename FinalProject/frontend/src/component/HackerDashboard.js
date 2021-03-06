import React, { Component } from 'react';
import Navbar from './Navbas';
import {Link} from 'react-router-dom';
import axios from 'axios';
import UserNavbar from './UserNavbar';
import {Redirect} from 'react-router';
import Modal from 'react-responsive-modal'
import { frontend, url } from '../config/config';
var swal = require('sweetalert')

class HackerDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            isOwner:false,
            inviteModal: false,
            userEmail:''
         }
    }

    componentWillMount(){
        console.log("localStorage",localStorage.getItem('user'))
        const email=JSON.parse(localStorage.getItem('user'));
        axios.get(url+`/user/profile/${email}`)
        .then((response) => {
                this.setState({
                    isOwner:response.data.owner
                })
                console.log(response.data);
        });
    }

    handleEvent = (e) =>{
        let target=e.target
        let name=target.name;
        this.setState({
            [name]:target.value    
        });
    }

    setOpenInviteModal = () => {
        this.setState({
            inviteModal:true
        })
    }
    
    onCloseInviteModal = () => {
        this.setState({
            inviteModal:false
        })
    }

    submitAddExpense = (e) => {
        e.preventDefault()
        const data={
            emailID:this.state.userEmail
        }
        axios.get(url+`/user/profile/${this.state.userEmail}`)
        .then((response) => {
        }).catch((error) => {
            console.log("Error", error.response)
            if(error.response.status == 404) {
            axios.post(url+'/user/invite', data)
                .then((response, error) => {
                    this.setState({
                        userEmail:'',
                        inviteModal:false
                    })
                    swal("User Invited","Invitation Email sent!","success")
                }).catch((error) => {
                    console.log("Error",error.code)
                });
            }
            else {
                swal("User Not Invited","","error")
            }
        });
        this.setState({
            userEmail:'',
            inviteModal:false
        })
    }


    render() { 
        let redirectVar = null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        var isOwnerSection
         if (this.state.isOwner) {
         isOwnerSection = <ul class="thumbnails bg-secondary m-5 p-5 col-sm-6 col-md-3">
                  <Link to="/approveRequests" className="text-white"> <h3> Pending Approvals </h3></Link>
                 </ul>
         }

        return ( 
            <div>
                 {redirectVar}
               <UserNavbar />
                <div>
                  <div class = "row">  
                  <ul class="thumbnails bg-secondary m-5 p-5 col-sm-6 col-md-3">
                       <Link to="/view/hackathon" className=" btn btn-link text-white text"><h3>View Hackathons</h3> </Link>
                 </ul>

                 <ul class="thumbnails bg-secondary m-5 p-5 col-sm-6 col-md-3">
                       <Link to="/profile" className="text-white text-center"><h3> View Profile </h3></Link>
                 </ul>

                 {isOwnerSection}

                 <ul class="thumbnails bg-secondary m-5 p-5 col-sm-6 col-md-3">
                       <Link to="#" className="text-white text-center" onClick={this.setOpenInviteModal}><h3> Invite a Friend </h3></Link>
                 </ul>
            
                  </div>
                </div>  
                <div>
                <Modal open={this.state.inviteModal} onClose={this.onCloseInviteModal} focusTrapped>
                <div>
                <h4  className="text-info">Invite Friend</h4><hr></hr>
                <form onSubmit={this.submitAddExpense}>
                    <div className="mt-5 mr-5">
                    <span className="text-info font-weight-bold">User Email:</span>
                        <input type="text" className="ml-4 col-lg-7 btn-lg pull-right" name="userEmail" id="userEmail" onChange={this.handleEvent} placeholder={this.state.userEmail}/>
                    </div>
                    <div className="mt-5 mr-5">
                    <div className="row text-center mt-4">
                         <button type="submit" className="mt-4 mb-4 ml-5 btn btn-submit bg-primary text-white btn-lg ">Send Invitation</button>
                    </div>
                    </div>
                </form>
                </div>
                </Modal>
                </div>

            </div> );
    }
}
 
export default HackerDashboard;