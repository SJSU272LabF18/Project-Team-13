var connection =  new require('./kafka/Connection');

//topics files

// var SignUp = require('./services/signup.js');
var Login = require('./Services/patientLogin.js');
var Signup = require('./Services/patientSignup.js');
var Registration = require('./Services/patientRegistration.js');
var Payment = require('./Services/patientPayment.js');

var Emergency = require('./Services/patientEmergency')

var DoctorLogin = require('./Services/doctorLogin')
var GetPatients = require('./Services/getpatients')

var PatientRecord = require('./Services/patientRecord');
var GetPrescriptions = require('./Services/getprescriptions');
var GetPatientStatistics = require('./Services/getpatientstatistics');
var GetStatisticsByDiagnosis = require('./Services/getstatisticsbydiagnosis');

var RegistrationDetails = require('./Services/registrationDetails');
var EmergencyDetails = require('./Services/emergencyDetails');
var RegistrationUpdate = require('./Services/registrtionUpdate');
var EmergencyUpdate = require('./Services/emergencyUpdate');


function handleTopicRequest(topic_name,fname){
    //var topic_name = 'root_topic';
    var consumer = connection.getConsumer(topic_name);
    var producer = connection.getProducer();
    console.log('server is running ');
    consumer.on('message', function (message) {
        console.log('message received for ' + topic_name +" ", fname);
        console.log(JSON.stringify(message.value));
        var data = JSON.parse(message.value);

        fname.handle_request(data.data, function(err,res){
            console.log('after handle'+res);
            var payloads = [
                { topic: data.replyTo,
                    messages:JSON.stringify({
                        correlationId:data.correlationId,
                        data : res
                    }),
                    partition : 0
                }
            ];
            producer.send(payloads, function(err, data){
                console.log(data);
            });
            return;
        });

    });
}
// Add your TOPICs here
//first argument is topic name
//second argument is a function that will handle this topic request
// handleTopicRequest("patient_signup",SignUp)
handleTopicRequest("patient_login",Login)
handleTopicRequest("patient_signup",Signup)
handleTopicRequest("patient_registration",Registration)
handleTopicRequest("patient_payment",Payment)

handleTopicRequest("doctor_login",DoctorLogin)
handleTopicRequest("get_patients",GetPatients)
handleTopicRequest("get_prescriptions",GetPrescriptions)
handleTopicRequest("patient_emergency",Emergency)
handleTopicRequest("patient_record",PatientRecord)
handleTopicRequest("get_patientstatistics",GetPatientStatistics)
handleTopicRequest("get_statisticsbydiagnosis",GetStatisticsByDiagnosis)

handleTopicRequest("patient_registration_details",RegistrationDetails)
handleTopicRequest("patient_emergency_details",EmergencyDetails)
handleTopicRequest("patient_emergency_update",EmergencyUpdate)
handleTopicRequest("patient_registration_update",RegistrationUpdate)
