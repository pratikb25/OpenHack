import React, { Component } from 'react';
import axios from 'axios';
import Modal from 'react-responsive-modal'
import UserNavbar from './UserNavbar';
import {NavLink} from 'react-router-dom';
import { frontend, url } from '../config/config';
import {Redirect} from 'react-router';
import "../css/hackathonTable.css"
var swal = require('sweetalert')



class JudgeHackathon extends Component {
    constructor(props) {
        super(props);
        this.state = {  
            listed:[],
            adminId:0,
            hackId:this.props.location.state.hackId,
            teamScore:0,
            error_status:" "
        }
    }

    async componentDidMount() {
              const email=JSON.parse(localStorage.getItem('user'));
              await axios.get(url+`/user/profile/${email}`)
                .then((response) => {
                        this.setState({
                            adminId:response.data.id,
                        })
                })
            axios.get(url+`/hackathon/${this.state.hackId}`)
            .then((response, error) => {
                this.setState({
                    listed : response.data.teams,
                    error_status:" "
                })
            }).catch((error) => {
                console.log("Error",error)
                console.log("Error response",error.response.data)
                this.setState({error_status:error.response.data})
            });

    }

    handleEvent = (e, key) => {
        let target=e.target
        let name=target.name;
        this.setState({
            listed: this.state.listed.map((item, j) => {
                if (j === key) {
                    item.score = target.value
                    return item;
                } else {
                  return item;
                }
              })
        });
        console.log(this.state.listed)
    }

    submitScore = (key, e) => {
        var data
        console.log("test",e.target, e);
        this.state.listed.map((item) => {
            if (item.teamId === key.teamId) {
                data = item;
            }
        }) 
        console.log("key",key.score)
        if(key.score>10 || key.score<0) 
            swal("Provide score within given limit","Score Again","error")  
        else{ 
        axios.post(url+`/team/${key.teamId}/submit`,data)
        .then((response) => {
                console.log(response.data);
                swal("Score updated","Updated","success")
        });
        }
    }

    render() {   
        let redirectVar = null;
        if(!localStorage.getItem("user")){
            redirectVar = <Redirect to= "/login"/>
        }
        var c2
        let listdetails = this.state.listed.map((row, key) => {
            if(row.submissionLink==null)
            c2=  <td>
                <button className=" btn btn-link"><h6 className="text-primary">{row.submissionLink==null?"No link submitted":row.submissionLink}</h6>
                 </button>
            
            </td>
            else
            c2=  <td>
            <a className=" btn btn-link" href={row.submissionLink} target= "_blank"><h6> {row.submissionLink==null?"No link submitted":row.submissionLink}</h6>
             </a>
          </td>

            return(                
                
                <tr>                    
                    <td className="text-primary"><h6>{row.name}</h6></td>
                   {c2}
                    {/* <td className="text-primary">{row.submissionLink}</td>  */}
                    <td>
                        
                        <input type="number" min="0" max="10" step="1" className="btn-lg col-lg-7" name="teamScore" id="teamScore" onChange={(e) => this.handleEvent(e, key)} placeholder={row.score==-1?"No one has graded":row.score}/>
                    </td>
                    <td>
                        <button className="btn btn-info" onClick={(e)=>this.submitScore(row, e)}>Submit Score</button>
                    </td> 
                </tr>
            )
        })

        return ( 
        <div>
            {redirectVar}
            <UserNavbar />
            <div>               
                <div class="card">
                
                    <table class="table mt-4 bg w-100 border rounded shadow-lg">
                        <thead>
                            <tr>
                                <th><em>Team Name</em></th>
                                <th><em>Submission Link </em></th>
                                <th><em>Score</em><span className="text-danger"> (Between 0 to 10)</span></th>
                                <th><em>Submit</em></th>
                            </tr>  
                        </thead>
                        <tbody>
                            {listdetails}                        
                        </tbody>
                    </table>
                </div>
            </div>            
        </div> 
        );
    }
}
 
export default JudgeHackathon;
