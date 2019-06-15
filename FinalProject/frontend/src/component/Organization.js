import React, { Component } from 'react';
import axios from 'axios';
import UserNavbar from './UserNavbar';
import {Redirect} from 'react-router';
import { frontend, url } from '../config/config';

class Organization extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            name:'',
            owner:'',
            description:'',
            address:'',
            orgOwner:'',
            orgUsers:[]
         }

         this.submitEvent=this.submitEvent.bind(this)
    }

    submitEvent(e) {
        e.preventDefault();
        const data=({

        })
    }

    componentWillMount(){
        console.log(this.props.location.state.detail)
        axios.get(url+`/organizations/${this.props.location.state.detail}`)
        .then((response)=> {
            this.setState({
                name:response.data.name,
                description:response.data.description,
                address:response.data.address,
                orgOwner:response.data.owner,
                orgUsers:response.data.orgUsers
            })
            console.log(response.data);
        });
    }

    render() { 
        let redirectVar = null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        const items = this.state.orgUsers.map((item, key) =>
        <span className="text-info font-weight-bold">{item.name}<br></br></span> 
        );
        return ( 
            <div>
                 {redirectVar}
                <UserNavbar />
                <div className="container-fluid">
                    <div className=" col-lg-7 mb-5  mt-5 ml-5 bg-white border border-light">
                    <h2>{this.state.name}</h2>
                    <div className="mt-4 mr-5" >
                        <span className="text-info font-weight-bold">
                            {this.state.description}
                        </span> <br></br>
                        <span className="text-info font-weight-bold">
                            {this.state.address.street}
                        </span> <br></br>
                        <span className="text-info font-weight-bold">
                            {this.state.address.city}
                        </span> 
                        <span className="text-info font-weight-bold">
                            {this.state.address.state}
                        </span> <br></br>               
                    </div>
                    </div>
                </div>  
                <br></br>   

                <div className="container-fluid">
                    <div className=" col-lg-7 mb-5  mt-5 ml-5 bg-white border border-light">
                    <h2>Owner</h2>
                    <div className="mt-4 mr-5" >
                        <span className="text-info font-weight-bold">
                            {this.state.orgOwner.name}
                        </span> <br></br>               
                    </div>
                    </div>
                </div>  

                <br></br>
                <div className="container-fluid">
                    <div className=" col-lg-7 mb-5  mt-5 ml-5 bg-white border border-light">
                    <h2>Users</h2>
                    <div className="mt-4 mr-5" >
                        <span className="text-info font-weight-bold">
                            {items}
                        </span> <br></br>               
                    </div>
                    </div>
                </div>           
            </div>
         );
    }
}
 
export default Organization;