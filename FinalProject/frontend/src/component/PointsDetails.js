import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-responsive-modal'
import AdminNavbar from './AdminNavbar';
import {NavLink} from 'react-router-dom';
import { frontend, url } from '../config/config';
import {Redirect} from 'react-router';
import "../css/hackathonTable.css"
import Popup from "reactjs-popup";
import PieChart from 'react-minimal-pie-chart';
import ReactSvgPieChart from "react-svg-piechart"
import CanvasJSReact from '../assets/canvasjs.react';
var swal = require('sweetalert')

var ReactBsTable  = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;


var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


class PointsDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            teams:[],
            hackathon:'',
            hackId:this.props.location.state.hackId,
            error_status:" ",
            currentTeamDetails:[],
            totalAmountPaid:0,
            totalAmountUnpaid:0,
            totalSponsors:0,
            totalExpenses:0,
            totalProfit:0
        }
    }

    async componentDidMount() {
              const email=JSON.parse(localStorage.getItem('user'));
              await axios.get(url+`/hackathon/${this.state.hackId}`)
                .then((response, error) => {
                this.setState({
                    hackathon: response.data,
                    teams : response.data.teams,
                    error_status:" "
                })
                this.state.teams.map((row, key) => {
                    this.getTeamPaymentDeatails(row.teamId)
                })
                this.setChartData()
                }).catch((error) => {
                    console.log("Error",error)
                    console.log("Error response",error.response.data)
                    this.setState({error_status:error.response.data})
                });

    }
     
    getTeamPaymentDeatails = val =>{
        axios.get(url+`/payments/${val}`)
        .then((response, error) => {
            console.log("Checking", response.data)
            this.setState({
                currentTeamDetails: this.state.currentTeamDetails.concat(response.data)
            })
        })
        //console.log(this.state)
    }

    getHackathonExpenses = (val) => {
        var expenses=0
        axios.get(url+`/expenses/${val}`)
        .then((response, error) => {
            response.data.map((values) =>{
                expenses += values.amount
            })
            this.setState({
                totalExpenses: expenses
            })
        })
    }

    setChartData = () => {
        var totalAmountPaid = 0, totalAmountUnpaid = 0, totalSponsors = 0, totalExpenses = 0, totalProfit = 0
        this.state.currentTeamDetails.map((detail) => {
            totalAmountPaid += detail.amount
        })
        this.state.hackathon.teams.map((team) => {
            totalAmountUnpaid += ((team.users.length - team.paidUsers.length)*this.state.hackathon.regFees)
        })
        totalSponsors = this.state.hackathon.sponsors.length * 1000
        this.getHackathonExpenses(this.state.hackId)
        totalProfit = (totalAmountPaid + totalSponsors) - totalExpenses
        this.setState({
            totalAmountPaid:totalAmountPaid,
            totalAmountUnpaid:totalAmountUnpaid,
            totalExpenses:totalExpenses,
            totalProfit:totalProfit,
            totalSponsors:totalSponsors
        })
        console.log("inside set chart", this.state)
    }



    render() {   
        let redirectVar = null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        var tot = 0
        this.state.currentTeamDetails.map((detail) => {
            tot += detail.amount
        })
        const data=[
            { label: 'Total Amount Paid', y: tot, color: '#138620' },
            { label: 'Total Amount Unpaid', y: this.state.totalAmountUnpaid, color: '#C13C37' },
            { label: 'Total Revenue from Sponsors', y: this.state.totalSponsors, color: '#6A2135' },
            { label: 'Total Expenses', y: this.state.totalExpenses, color: '#2A0135' },
            { label: 'Total Profit', y: (this.state.totalSponsors + tot)-this.state.totalExpenses, color: '#E38627' },
        ]

        const options = {
			exportEnabled: true,
			animationEnabled: true,
			title: {
				text: this.state.hackathon.name
			},
			data: [{
				type: "pie",
				startAngle: 180,
				toolTipContent: "<b>{label}</b>: ${y}",
				showInLegend: "true",
				legendText: "{label}",
				indexLabelFontSize: 16,
				indexLabel: "{label} - ${y}",
				dataPoints: data
			}]
		}

        return ( 
        <div>
            {redirectVar}
            <AdminNavbar />
            <div>               
                <div class="card">
                <h1 class="text-center"> Points details of Hackathon</h1>     
                <div class="container">
                <div>
                <CanvasJSChart options = {options}
                    /* onRef={ref => this.chart = ref} */
                />
                {/*You can get reference to the chart instance as shown above using onRef. This allows you to access all chart properties and methods*/}
                </div>
                <BootstrapTable data={data} hover>
                    <TableHeaderColumn isKey dataField='label'>Point type</TableHeaderColumn>
                    <TableHeaderColumn dataField='y' dataSort={ true }>Value</TableHeaderColumn>
                </BootstrapTable>
                </div>  
            </div> 
            </div>
        </div> 
        );
    }
}
 
export default PointsDetails;
