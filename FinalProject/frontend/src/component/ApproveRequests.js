import React, { Component } from 'react';
import axios from 'axios';
import swal from 'sweetalert';
import UserNavbar from './UserNavbar';
import { frontend, url } from '../config/config';
import {Redirect} from 'react-router';

class ApproveRequests extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            orgId:'',
            userId:'',
            pendingApprovals:[]
         }
    }

    handleApprove = (id) => {
        axios.put(url+`/organization/${this.state.orgId}/approve/${id}`)
        .then((response) => {
            console.log(response)
        });
        swal("Approved the join request","User added to the organization","success")
    }

    handleReject = (id) => {
        axios.put(url+`/organization/${this.state.orgId}/reject/${id}`)
        .then((response) => {
            console.log(response)
        });
        swal("Rejected the join request","User not added to the organization","success")
    }

    componentWillMount(){
        console.log("localStorage",localStorage.getItem('user'))
        const email=JSON.parse(localStorage.getItem('user'));
        axios.get(url+`/user/profile/${email}`)
        .then((response) => {
            this.setState({
                userId:response.data.id
            })
            axios.get(url+'/organizations/'+response.data.organization.id)
            .then((response)=> {
                this.setState({
                    orgId:response.data.id,
                    pendingApprovals:response.data.pendingApprovals
                })
                //console.log(response.data);
            });
        });
    }


    render() { 
        let redirectVar = null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        var items
        if(this.state.pendingApprovals!=null) {
        items = this.state.pendingApprovals.map((item, key) => <div className="row text-center mt-4 ml-5">
            <span className="mt-2 ml-5 text-info pull-right font-weight-bold btn-lg">{item.name}</span>
            <button onClick={()=>this.handleApprove(item.id)} className="mb-4 ml-5 btn btn-submit bg-success text-white btn-lg ">Approve</button>
            <button onClick={()=>this.handleReject(item.id)} className="mb-4 ml-5 btn btn-submit bg-danger text-white btn-lg ">Reject</button>
        </div>
        );
        }
        return ( <div> 
             {redirectVar}
                    <UserNavbar />
                    <div className="container-fluid">
                    <div className=" col-lg-7 mb-5  mt-5 ml-5 bg-white border border-light">
                    <h1 class="ml-9">Pending Approvals</h1>
                            {items}
                    </div>
                    </div>

                </div>
                );
        }
}
 
export default ApproveRequests;