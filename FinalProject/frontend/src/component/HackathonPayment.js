import React, { Component } from 'react';
import axios from 'axios';
import '../css/hackathonPayment.css'
import UserNavbar from './UserNavbar';
import {Redirect} from 'react-router';
import { frontend, url } from '../config/config';
var swal = require('sweetalert')



class HackathonPayment extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            userId:'',
            userOrg:'',
            hackId:this.props.location.state.hackId,
            hackathon:" ",
            sponsorList:[],
            userTeams:[],
            currentTeamId:'',
            currentAmount:''
         }
    }

    async componentWillMount(){
        console.log("localStorage",localStorage.getItem('user'))
        const email=JSON.parse(localStorage.getItem('user'));
        await axios.get(url+`/user/profile/${email}`)
        .then((response) => {
            var lists = response.data.ownsTeams.concat(response.data.participantTeam)
            this.setState({
                userId:response.data.id,
                userTeams:lists
            })
            if (response.data.organization!=null) {
                this.setState({
                    userOrg:response.data.organization.name
                })
            }

            axios.get(url+`/hackathon/${this.state.hackId}`)
            .then((response) =>{
                this.setState({
                    hackathon: response.data,
                    sponsorList: response.data.sponsors
                })
                this.state.userTeams.map((team,key) => {
                    if (team.hackathon.id === this.state.hackId) {
                        this.setState({
                            currentTeamId:team.teamId,
                        })
                    }
                })
                this.setAmountVal()
            }
            );
        });
    }

    markPaymentDone = e => {
        const data=({
            teamId:this.state.currentTeamId,
            userId:this.state.userId,
            amount:this.state.currentAmount
        })
        axios.put(url+`/team/${this.state.currentTeamId}/addPaidUser/${this.state.userId}`, data)
        .then((response)=>{
            console.log(response.data)
            swal("Payment Done","Make your teammates pay","success")
        });
        this.props.history.push('/dashboard')
    }

    handleCheck = val => {
        return this.state.sponsorList.some(item => val === item.name);
    }
    
    setAmountVal = () => {
        var amount
        if (!this.handleCheck(this.state.userOrg)) {
            amount = this.state.hackathon.regFees
            this.setState({currentAmount:amount})
        } else {
            amount = this.state.hackathon.regFees-(this.state.hackathon.regFees*(this.state.hackathon.discount*0.01))
            this.setState({currentAmount:amount})
        }
    }

    render() { 
       
        let redirectVar = null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        // if(this.state.hackathon!=null)
        //     a=this.state.hackathon.sponsors[0].id
        var sponsors = this.state.sponsorList.map((item, key) =>
        <span className="text-info font-weight-bold">{item.name}<br></br></span> 
        );
        var payment, amount
        if (!this.handleCheck(this.state.userOrg)) {
            payment = <div>
                        <h5><b>Your Total: </b><span class="right-aligned">${this.state.currentAmount}</span></h5> 
                    </div>
        }
        else {
            payment = <div>
                        <h5><b>Your Discounted Total: </b><span class="right-aligned">${this.state.currentAmount}</span></h5>
                    </div>
        }
        return ( 
        <div>
             {redirectVar}
            <UserNavbar />
            <div id = "paymentDiv">
                <h1>
                    Hackathon Payment Form
                </h1>
                <br></br>
                <div class="card">                    
                    <div class="container">
                        
                        <h4>Hackathon Details</h4>

                        <hr></hr>
                        <p>Hackathon Name:<span class="right-aligned">{this.state.hackathon.name}</span></p>
                        <p>Start Date:<span class="right-aligned"> {this.state.hackathon.startDate}</span></p>
                        <hr></hr>
                        <p>Sponsors:<span class="right-aligned">{sponsors}</span></p>
                        <p>Your organization:<span class="right-aligned">{this.state.userOrg}</span></p>
                        {payment}
                        {/* <h5><b>Your Total</b><span class="right-aligned">{this.state.hackathon.regFees}</span></h5>     */}

                        <hr></hr>     
                        <h4>Payment Method</h4>   
                        <br></br>              
                        <div id="paymentMethod">
                            <input type="radio" name="paytype" id="mastercard" />
                                <label for="mastercard"><img src={require("../images/mastercard.svg")} alt="Mastercard" class="payment-method-images" /></label>

                            <input type="radio" name="paytype" id="visa" />
                                <label for="happy"><img src={require("../images/visa3.jpg")} alt="Visa" class="payment-method-images" /></label>

                            <input type="radio" name="paytype" id="paypal" />
                                <label for="paypal"><img src={require("../images/paypal.png")} alt="PayPal" class="payment-method-images" /></label>
                                
                            <br></br>
                            <hr></hr>     
                            <button type="button" onClick={this.markPaymentDone} class="btn btn-dark">Make Payment</button>
                        </div>
                    </div>
                </div>
            </div>
        </div> 
        );
    }
}
 
export default HackathonPayment;