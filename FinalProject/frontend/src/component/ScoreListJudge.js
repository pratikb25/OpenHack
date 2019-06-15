import React, { Component } from 'react';
import {NavLink} from 'react-router-dom';
import UserNavbar from './UserNavbar';
import Modal from 'react-responsive-modal'
import axios from 'axios';
import "../css/hackathonTeam.css";
import {Redirect} from 'react-router';
import { frontend, url } from '../config/config';


class ScoreListJudge extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            adminId:" ",
            hackId:this.props.location.state.hackId,
            teamsList:[]
         }
         
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

          var hackId=this.state.hackId;
          axios.get(url+`/hackathon/${hackId}`)
          .then((response, error) => {
              console.log("Normal mode",response.data)
             
              function compare( a, b ) {
                if ( a.score < b.score ){
                  return 1;
                }
                if ( a.score > b.score ){
                  return -1;
                }
                return 0;
              }
              
              this.setState({teamsList:response.data.teams.sort( compare )})
            //   this.state.finalizeHack.map((row) => {
            //       if(row.score==-1){
            //           err=true
            //       }
            //   })
          }).catch((error) => {
              console.log("Error",error.code)
          }); 

}
    render() { 
        var teams=null,team_ungraded=null
        var count=0
        teams = this.state.teamsList.map(
            detail=>{
              
            if(count<3 && detail.score>=0)
                return(
                 <tr className="bg-success">                    
                 <td className="text-white"><h6>{detail.name}</h6></td>
                 <td className="text-white"><h6>{detail.submissionLink}</h6></td> 
                 <td className="text-white"><h6>{detail.score}</h6></td> 
                 <td className="text-white"><h6>{++count}</h6></td> 
                 </tr>)
             else if(detail.score>=0)
                return(
                    <tr>                    
                    <td className="text-secondary"><h6>{detail.name}</h6></td>
                    <td className="text-secondary"><h6>{detail.submissionLink}</h6></td> 
                    <td className="text-secondary"><h6>{detail.score}</h6></td> 
                    <td className="text-secondary"><h6>{++count}</h6></td> 
                    </tr>)
                
                }
              )
              count=0

              team_ungraded = this.state.teamsList.map(
                detail=>{
                if(detail.score<0)
                    return(
                     <tr>                    
                     <td className="text-secondary"><h6>{detail.name}</h6></td>
                     <td className="text-secondary"><h6>{detail.submissionLink}</h6></td> 
                     <td className="text-secondary"><h6>Not Graded!</h6></td> 
                     </tr>)
                     }
                  )
            
                
            

        return (    <div>
            {/* {redirectVar} */}
            <UserNavbar />
            <div>               
                <div class="card">
                
                    <table class="table mt-4 bg w-100 border rounded shadow-lg">
                        <thead>
                            <tr>
                                <th><em>Team Name</em></th>
                                <th><em>Submission Link </em></th>
                                <th><em>Score</em></th>
                                <th><em>Rank</em></th>
                            </tr>  
                        </thead>
                        <tbody>
                            {teams} 
                            <h6 className="mt-3 mb-3 text-center text-info">Ungraded Teams!</h6>
                            {team_ungraded}   
                                            
                        </tbody>
                    </table>
                </div>
            </div>            
        </div>  );
    }
}
 
export default ScoreListJudge;