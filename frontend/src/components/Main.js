import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Signup from './SignUp/signup';
import Navigation from './Navigation/Navigation';
import Registration from './PatientForms/Registration';
import PaymentDetails from './PatientForms/PaymentDetails';
import EmergencyContact from './PatientForms/EmergencyContact';
import Insurance from './PatientForms/Insurance';



// import sidebar from './Sidebar/sidebar';
import HomePage from './HomePage/HomePage';
import DoctorDashboard from './Dashboard/DoctorDashboard';
import AllPrescriptions from './Dashboard/AllPrescriptions';
import ViewPurpose from './Dashboard/ViewPurpose';
import DownloadForm from './Dashboard/DownloadForm';
import AdminGraph from './Dashboard/AdminGraphs';

import DoctorLogin from './Login/doctorLogin';

import Purpose from './PatientForms/Purpose';
import dashboard from './PatientForms/dashboard';
import PatientNavigation from './Navigation/PatientNavigation';
import EditRegistration from './EditPatientForms/editRegistration';
import EditEmergencyContact from './EditPatientForms/editEmergencyContact';
import DrEditRegistration from './DoctorsideForms/drEditRegistration';
import DrEditEmergencyContact from './DoctorsideForms/drEditEmergencyContact';


//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/signup" component={Signup}/>
                <Route path="/login" component={Login}/>
                <Route path="/patient" component={PatientNavigation}/>
                <Route path="/homepage" component={HomePage}/>
                <Route path="/doctor" component={Navigation}/>
                <Route path="/patient/registration" component={Registration}/>
                <Route path="/patient/edit/registration" component={EditRegistration}/>
                <Route path="/patient/edit/emergency-contact" component={EditEmergencyContact}/>
                <Route path="/payment-details" component={PaymentDetails}/>
                <Route path="/patient/emergency-contact" component={EmergencyContact}/>
                {/* <Route path="/sidebar" component={sidebar}/> */}
                <Route path="/doctor/patient-record" component={Purpose}/>
                <Route path="/insurance" component={Insurance}/>
                <Route path="/doctor/dashboard" component={DoctorDashboard}/>
                <Route path="/download" component={DownloadForm}/>
                <Route path="/patient/dashboard" component={dashboard}/>
                <Route path="/doctor/login" component={DoctorLogin}/>
                <Route path="/doctor/allprescriptions" component={AllPrescriptions}/>
                <Route path="/doctor/viewprescription" component={ViewPurpose}/>
                <Route path="/doctor/analysis" component={AdminGraph}/>
                <Route path="/doctor/edit/registration" component = {DrEditRegistration}/>
                <Route path="/doctor/edit/emergency-contact" component ={DrEditEmergencyContact}/>

            </div>
        )
    }
}
//Export The Main Component
export default Main;
