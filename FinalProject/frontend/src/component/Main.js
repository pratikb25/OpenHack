import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Profile from  './Profile';
import NotAuthorized from  './NotAuthorized';
import Hackathon from './Hackathon';
import CreateHackathon from './createHackathon';
import AdminDashboard from './AdminDashboard';
import HackerDashboard from './HackerDashboard';
import Organization from './Organization';
import HackathonPayment from './HackathonPayment'; 
import TeamRegistration from './TeamRegistration';
import JudgeHackathon from './JudgeHackathon';
import PaymentDetails from './PaymentDetails';
import PointsDetails from './PointsDetails';
import HackathonList from './HackathonList';
import AdminMainDashboard from './AdminMainDashboard';
import ApproveRequests from './ApproveRequests';
import AdminNavbar from './AdminNavbar';
import UserNavbar from './UserNavbar';
import AdminProfile from './AdminProfile';
import ScoreList from './ScoreList';
import ScoreListJudge from './ScoreListJudge';



class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}

                {/* <Route exact path="/" component={Home} /> */}
                <Route exact path="/" component={Login}/>
                <Route exact path="/login" component={Login}/>
                <Route path="/signup" component={Signup}/>
                <Route path="/profile" component={Profile}/>
                <Route path="/notAuthorized" component={NotAuthorized}/>
                <Route path="/hackathon" component={Hackathon}/>
                <Route path="/create/hackathon" component={CreateHackathon} />
                <Route path="/admin/dashboard" component={AdminDashboard} />
                <Route path="/dashboard" component={HackerDashboard} />
                <Route path="/organization" component={Organization}/>
                <Route path="/payment" component={HackathonPayment}/>
                <Route path="/registration" component={TeamRegistration}/>
                <Route path="/view/hackathon" component={HackathonList}/>
                <Route path="/judge/hackathon" component={JudgeHackathon}/>
                <Route path="/paymentDetails" component={PaymentDetails}/>
                <Route path="/pointsDetails" component={PointsDetails}/>
                <Route path="/admin/maindashboard" component={AdminMainDashboard}/>
                <Route path="/approveRequests" component={ApproveRequests}/>
                <Route path="/anavbar" component={AdminNavbar}/>
                <Route path="/unavbar" component={UserNavbar}/>
                <Route path="/scorelist" component={ScoreList}/>
                <Route path="/user/scorelist" component={ScoreListJudge}/>
                <Route path="/admin/profile" component={AdminProfile}/>

            </div>
        )
    }
}
//Export The Main Component
export default Main;