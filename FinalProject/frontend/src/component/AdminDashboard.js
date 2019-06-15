import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-responsive-modal'
import AdminNavbar from './AdminNavbar';
import {NavLink} from 'react-router-dom';
import { frontend, url } from '../config/config';
import {Redirect} from 'react-router';
import "../css/hackathonTable.css"
var swal = require('sweetalert')



class AdminDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            listed:[],
            adminId:0,
            error_status:" ",
            openCreate: false,
            openLeave: false,
            openJoin: false,
            openSponsor:false,
            openHack:true,
            openTeams:false,
            finalizeHack:[],
            status:"",
            openCond:[],
            expenseTitle:'',
            expenseDesc:'',
            expenseDate:'',
            exepenseAmount:0,
            expenseHackId: '',
            todaysDate:'',
            hackathon:''
        }
        this.OpenTeamFunction=this.OpenTeamFunction.bind(this)
        this.setCloseFunction=this.setCloseFunction.bind(this)
    }

    async componentDidMount() {
              const email=JSON.parse(localStorage.getItem('user'));
              await axios.get(url+`/user/profile/${email}`)
                .then((response) => {
                        this.setState({
                            adminId:response.data.id,
                        })
                        console.log(response.data);
                })

                var adminId=this.state.adminId;
             axios.get(url+`/hackathons/${adminId}`)
            .then((response, error) => {
                this.setState({
                    listed : this.state.listed.concat(response.data),
                    error_status:" "
                })
                console.log("listed"+this.state.listed)
            }).catch((error) => {
                console.log("Error",error)
                console.log("Error response",error.response.data)
                this.setState({error_status:error.response.data})
            });

    }

    OpenTeamFunction(hackId){
        this.props.history.push({
            pathname:'/scorelist',
            state: { hackId: hackId }
        })
    }

    async setCloseFunction(id,stat){
        console.log("inside close hackathoin",id,stat)
        var hackId=id
        var status=stat
        var flag=false
        if(status==true){
            await axios.get(url+`/hackathon/${hackId}`)
            .then((response, error) => {
                console.log(response.data.teams)
                console.log("sorting try",response.data.teams.sort())
                this.setState({openCond:response.data.teams})
                this.state.openCond.map((row) => {
                    if(row.score>=0){
                      flag=true  
                    }
                })
            }).catch((error) => {
                console.log("Error",error.code)
            }); 
           
        }
        if(flag==true)
            swal("It cannot be opened now!","Grading of atleast one team done","error")
        else{
        axios.put(url+`/hackathon/${hackId}/open/${status}`)
        .then((response, error) => {
            if(stat==true){
                swal("Hackathon has been opened successfully!","Status changed!","success")
                // window.location.reload();
            }
            else{
                swal("Hackathon has been closed successfully!","Status changed!","success")
                // window.location.reload();
            }
            console.log(response.data)
        }).catch((error) => {
            console.log("Error",error.code)
        }); 
    }

    }

    async setFinalizeFunction(id){
        console.log("inside finalize hackathoin",id)
        var hackId=id
        var err=false
        await axios.get(url+`/hackathon/${hackId}`)
        .then((response, error) => {
            console.log(response.data.teams)

            function compare( a, b ) {
                if ( a.score < b.score ){
                  return 1;
                }
                if ( a.score > b.score ){
                  return -1;
                }
                return 0;
              }
              
            this.setState({
                teamsList:response.data.teams.sort( compare ),
                hackathon:response.data
            })
            this.setState({finalizeHack:response.data.teams})
            this.state.finalizeHack.map((row) => {
                if(row.score==-1){
                    err=true
                }
            })
        }).catch((error) => {
            console.log("Error",error.code)
        }); 

        if(err==true)
           swal("Can't Finalize!Grades for all teams has not submitted","Grading required","error")
        else{
            await axios.put(url+`/hackathon/${hackId}/finalize`)
            .then((response, error) => {
                console.log(response.data)
                swal("Hackathon is Finalized hence being closed","Done!","success")
                var teams=null,team_ungraded=null
                var count=0, data
                teams = this.state.teamsList.map(
                    detail=>{
                        console.log(count)
                        var emails = detail.users.map((user) =>{
                            return user.email
                        })
                        if(count<3) {
                            console.log("inside <3", count)
                            data={
                                hackName:this.state.hackathon.name,
                                isWinner:true,
                                emails:emails
                            }
                        } 
                        else {
                            data={
                                hackName:this.state.hackathon.name,
                                isWinner:false,
                                emails:emails
                            }
                        }
                        count++
                        axios.post(url+'/emailResults', data)
                        .then((response) =>{
                            console.log(response)
                        })
                    })
            }).catch((error) => {
                console.log("Error",error)
            }); 
        }
        

    }

    onOpenCloseHackModal = (e) => {
        e.preventDefault();
        this.setState({ openHack: true });
      };

      onCloseHackModal = (e) => {
        e.preventDefault();
        this.setState({ openHack: false });
      };


    onOpenJoinModal = (e) => {
        e.preventDefault();
        this.setState({ openJoin: true });
      };

      onOpenSponsorModal = (e) => {
        e.preventDefault();
        this.setState({ openSponsor: true });
      };

      onCloseSponsorModal = (e) => {
        e.preventDefault();
        this.setState({ openSponsor: false });
    };

    onOpenTeamsModal = (e) => {
        e.preventDefault();
        this.setState({ openTeams: true });
      };

    onCloseTeamsModal = (e) => {
        e.preventDefault();
        this.setState({ openTeams: false });
    };

    onCloseCreateModal = (e) => {
        e.preventDefault();
        this.setState({ openJoin: false });
    };

    openAddExpense = (id, e) => {
        e.preventDefault();
        this.setState({ 
            openExpense: true,
            expenseHackId: id,
            todaysDate: new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0]
         });
      };

    onCloseAddExpense = (e) => {
        e.preventDefault();
        this.setState({ 
            openExpense: false,
            expenseHackId: '',
            expenseTitle:'',
            expenseDesc:'',
            expenseDate:'',
            exepenseAmount:0
         });
    };

    submitAddExpense = (e) => {
        e.preventDefault()
        const data={
            hackathonForExpense: {id:this.state.expenseHackId},
            title: this.state.expenseTitle,
            decription: this.state.expenseDesc,
            time:this.state.expenseDate,
            amount:this.state.exepenseAmount,
        }
        axios.post(url+'/expenses', data)
        .then((response, error) => {
            this.setState({
                openExpense: false,
                expenseHackId: '',
                expenseTitle:'',
                expenseDesc:'',
                expenseDate:'',
                exepenseAmount:0
            })
            swal("Hackathon Expense added Successfullu!","Revenue changed!","success")
        }).catch((error) => {
            console.log("Error",error.code)
        });
    }

    openPaymentStatus = key => {
        this.props.history.push({
                pathname:'/paymentDetails',
                state: { 
                    hackId: key
                }
        })
    }

    openPointsStatus = key => {
        this.props.history.push({
                pathname:'/pointsDetails',
                state: { 
                    hackId: key
                }
        })
    }

    handleEvent = (e) =>{
        let target=e.target
        let name=target.name;
        this.setState({
            [name]:target.value    
        });
    }


    render() {   
        console.log(this.state.status)
        let redirectVar = null;
        var team_score=null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        var a,b,c,teams, expense
        let listdetails = this.state.listed.map((row) => {
           a=row.judges.map(detail=>{return(<h5 className="text-background">{detail.name} <span className="text-muted">  Screen Name:</span>{detail.screenName}</h5>)})
           b=row.sponsors.map(detail=>{return(<h5 className="text-background">{detail.name}</h5>)})
          
           teams = row.teams.map(
               detail=>{
                   return(
                    <tr>                    
                    <td className="text-secondary"><h6>{detail.name}</h6></td>
                    <td className="text-secondary"><h6>{detail.submissionLink}</h6></td> 
                    <td className="text-secondary"><h6>{detail.score}</h6></td> 
                    </tr>)}
                 )

            if(row.finalized===true){
                c=<td>
                    <button className="btn btn-secondary ml-2 mt-2" disabled>Finalize</button>
                    <button className="btn btn-secondary ml-2 mt-2" disabled>Add Expense</button>
                    <h6 className="text-secondary">Hackathon closed!</h6>
                </td> 
            }else if(row.finalized===false && row.open==true){
                c=<td className="text-primary">
                <button className="btn btn-secondary" onClick={()=>this.setCloseFunction(row.id,false)} >Close</button>
                <button className="btn btn-secondary ml-2" onClick={()=>this.setFinalizeFunction(row.id)}>Finalize</button>
                <button className="btn btn-secondary ml-2 mt-2" onClick={(e)=>this.openAddExpense(row.id, e)}>Add Expense</button>
            </td> 
            } else{
               c= <td className="text-primary">
                    <button className="btn btn-secondary" onClick={()=>this.setCloseFunction(row.id,true)} >Open</button>
                    <button className="btn btn-secondary ml-2" onClick={()=>this.setFinalizeFunction(row.id)}>Finalize</button>
                    <button className="btn btn-secondary ml-2" onClick={(e)=>this.openAddExpense(row.id, e)}>Add Expense</button>
                 </td> 
            }

            expense = <div>
                <form onSubmit={this.submitAddExpense}>
                    <div className="mt-5 mr-5">
                    <span className="text-info font-weight-bold">Expense Title:</span>
                        <input type="text" className="ml-4 col-lg-7 btn-lg pull-right" name="expenseTitle" id="expenseTitle" onChange={this.handleEvent} placeholder={this.state.expenseTitle}/>
                    </div><br></br>
                        
                    <div className="mt-5 mr-5">
                        <span className="text-info font-weight-bold">Expense Description:</span>
                        <textarea rows="2" cols="20" className="ml-4 col-lg-7 btn-lg pull-right" onChange={this.handleEvent} placeholder={this.state.expenseDesc} name="expenseDesc" id="expenseDesc"   max="500"/>
                    </div><br></br><br></br>
                    <div className="mt-5 mr-5">
                    <span className="text-info font-weight-bold">Expense Date:</span>
                        <input type="date" className=" ml-4 col-lg-7 pull-right" id="expenseDate" name="expenseDate" placeholder="Time" onChange={this.handleEvent} max={this.state.todaysDate}></input>
                    </div><br></br>
                    <div className="mt-5 mr-5">
                    <span className="text-info font-weight-bold">Expense Amount: $</span>
                        <input type="text" className=" ml-4 btn-lg col-lg-7 pull-right" name="exepenseAmount" id="exepenseAmount" onChange={this.handleEvent} placeholder={this.state.exepenseAmount}/>
                    </div>
                    <div className="mt-5 mr-5">
                    <div className="row text-center mt-4">
                         <button type="submit" className="mt-4 mb-4 ml-5 btn btn-submit bg-primary text-white btn-lg ">Add Expense</button>
                    </div>
                    </div>
                </form>
                </div>

            return(                
                
                <tr>                    
                    <td className="text-primary">{row.name}{row.open}</td>
                    <td className="text-primary">({row.startDate}) - ({row.endDate})</td>
                    <td className="text-primary">{row.regFees}/{row.discount}</td>
                    <td className="text-primary">{row.minTeamSize}/{row.maxTeamSize}</td> 
                    <td>
                        <button className="btn btn-info" onClick={this.onOpenJoinModal}>View Judges</button>
                        <button className="btn btn-info ml-2"  onClick={this.onOpenSponsorModal}>View Organizers</button> 
                        <button className="btn btn-info ml-5 mt-2" onClick={()=> this.OpenTeamFunction(row.id)}>Teams/Result Status</button>
                        <br></br> <br></br>
                        <button className="btn btn-info" onClick={()=> this.openPaymentStatus(row.id)}>Payment Status</button>
                        <button className="btn btn-info ml-2" onClick={()=> this.openPointsStatus(row.id)}>Earning Report</button>
                        
                    </td> 
                       {c}         
                </tr>
            )
        })

        return ( 
        <div>
            {redirectVar}
            <AdminNavbar />
            <div>               
                <div class="card">
                
                    <table class="table mt-4 bg w-100 border rounded shadow-lg">
                        <thead>
                            <tr>
                                <th><em>Hackathon Name</em></th>
                                <th><em>Start Date /<br></br> End Date</em></th>
                                <th><em>Registration <br></br>Fees / Discount(%)</em></th>
                                <th><em>(Min/Max)<br></br>Team Member</em></th>
                                <th><em>View</em></th>
                                <th><em>Update</em></th>
                            </tr>  
                        </thead>
                        <tbody>
                            {listdetails}                        
                        </tbody>
                    </table>
                </div> 

                <Modal  className="w-100" open={this.state.openJoin} onClose={this.onCloseCreateModal} focusTrapped>
                <div className="w-100">
                <h4  className="text-info">View Judges:</h4><hr></hr>
                     {a}
                </div>
                </Modal>

                <Modal className="w-75" open={this.state.openSponsor} onClose={this.onCloseSponsorModal} focusTrapped>
                <div className="w-25" >
                <h4 className="text-info">View Organizations:</h4><hr></hr>
                     {b}
                </div>
                </Modal>

                <Modal className="modal-dialog mw-100 w-75" open={this.state.openTeams} onClose={this.onCloseTeamsModal} focusTrapped>
                <div className="w-100" >
                <h4 className="text-info">View teams:</h4><hr></hr>
                <div className="w-100">
                
                    <table class="table mt-4 bg w-100 border rounded shadow-lg">
                        <thead>
                            <tr>
                                <th><em>Team Name</em></th>
                                <th><em>Submission Link </em></th>
                                <th><em>Score</em></th>
            
                            </tr>  
                        </thead>
                        <tbody>
                             {teams}                       
                        </tbody>
                    </table>
                </div>
                </div>
                </Modal>

                <Modal open={this.state.openExpense} onClose={this.onCloseAddExpense} focusTrapped>
                <div>
                <h4  className="text-info">Add Expense</h4><hr></hr>
                     {expense}
                </div>
                </Modal>

            </div>            
        </div> 
        );
    }
}
 
export default AdminDashboard;
