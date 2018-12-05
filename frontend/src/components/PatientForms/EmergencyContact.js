import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Redirect } from 'react-router';

class EmergencyContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            contact: "",
            relation: "",
            address: "",
            onclick: ""
        }
        this.fnameHandler = this.fnameHandler.bind(this);
        this.lnameHandler = this.lnameHandler.bind(this);
        this.contactHandler = this.contactHandler.bind(this);
        this.relationHandler = this.relationHandler.bind(this);
        this.addressHandler = this.addressHandler.bind(this);
        this.submitEmergency = this.submitEmergency.bind(this);
    }

    componentDidMount() {
        var dispatcher = new window.cf.EventDispatcher(),
            synth = null,
            recognition = null,
            msg = null,
            SpeechSynthesisUtterance = null,
            SpeechRecognition = null;

        try {
            SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition;
        } catch (e) {
            console.log(
                "Example support range: https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition#Browser_compatibility"
            );
        }

        try {
            SpeechSynthesisUtterance =
                window.webkitSpeechSynthesisUtterance ||
                window.mozSpeechSynthesisUtterance ||
                window.msSpeechSynthesisUtterance ||
                window.oSpeechSynthesisUtterance ||
                window.SpeechSynthesisUtterance;
        } catch (e) {
            console.log(
                "Example support range: https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance#Browser_compatibility"
            );
        }

        // here we use https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API
        // you can use what ever API you want, ex.: Google Cloud Speech API -> https://cloud.google.com/speech/

        // here we create our input
        if (SpeechSynthesisUtterance && SpeechRecognition) {
            var microphoneInput = {
                init: function () {
                    // init is called one time, when the custom input is instantiated.

                    // load voices \o/
                    synth = window.speechSynthesis;
                    msg = new SpeechSynthesisUtterance();
                    window.speechSynthesis.onvoiceschanged = function (e) {
                        var voices = synth.getVoices();
                        msg.voice = voices[0]; // <-- Alex
                        msg.lang = msg.voice.lang; // change language here
                    };
                    synth.getVoices();

                    // here we want to control the Voice input availability, so we don't end up with speech overlapping voice-input
                    msg.onstart = function (event) {
                        // on message end, so deactivate input
                        console.log("voice: deactivate 1");
                        conversationalForm.userInput.deactivate();
                    };

                    msg.onend = function (event) {
                        // on message end, so reactivate input
                        conversationalForm.userInput.reactivate();
                    };

                    // setup events to speak robot response
                    dispatcher.addEventListener(
                        window.cf.ChatListEvents.CHATLIST_UPDATED,
                        function (event) {
                            if (event.detail.currentResponse.isRobotResponse) {
                                // https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance
                                // msg.text = event.detail.currentResponse.response
                                msg.text = event.detail.currentResponse.strippedSesponse; //<-- no html tags
                                window.speechSynthesis.speak(msg);
                            }
                        },
                        false
                    );

                    // do other init stuff, like connect with external APIs ...
                },
                // set awaiting callback, as we will await the speak in this example
                awaitingCallback: true,
                cancelInput: function () {
                    console.log("voice: CANCEL");
                    window.finalTranscript = null;
                    if (recognition) {
                        recognition.onend = null;
                        recognition.onerror = null;
                        recognition.stop();
                    }
                },
                input: function (resolve, reject, mediaStream) {
                    console.log("voice: INPUT");
                    // input is called when user is interacting with the CF input button (UserVoiceInput)

                    // connect to Speech API (ex. Google Cloud Speech), Watson (https://github.com/watson-developer-cloud/speech-javascript-sdk) or use Web Speech API (like below), resolve with the text returned..
                    // using Promise pattern -> https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Promise
                    // if API fails use reject(result.toString())
                    // if API succedes use resolve(result.toString())

                    if (recognition) recognition.stop();

                    recognition = new SpeechRecognition()
                    window.finalTranscript = "";

                    recognition.continuous = false; // react only on single input
                    recognition.interimResults = false; // we don't care about interim, only final.

                    // recognition.onstart = function() {}
                    recognition.onresult = function (event) {
                        // var interimTranscript = "";
                        for (var i = event.resultIndex; i < event.results.length; ++i) {
                            if (event.results[i].isFinal) {
                                window.finalTranscript += event.results[i][0].transcript;
                                console.log(event.results[i][0].transcript)
                                console.log(mediaStream)
                            }
                        }
                    };

                    recognition.onerror = function (event) {
                        reject(event.error);
                    };

                    recognition.onend = function (event) {
                        if (window.finalTranscript && window.finalTranscript !== "") {
                            resolve(window.finalTranscript);
                        }
                    };

                    recognition.start();
                }
            };
        }

        var form = null;
        let me = this;
        var conversationalForm = window.cf.ConversationalForm.startTheConversation({
            formEl: document.getElementById("form"),
            context: document.getElementById("cf-context"),
            eventDispatcher: dispatcher,

            // add the custom input (microphone)
            microphoneInput: microphoneInput,

           
            submitCallback: function () {
                // remove Conversational Form
                console.log(
                    "voice: Form submitted...",
                    conversationalForm.getFormData(true)
                );
                
                form = conversationalForm.getFormData(true);
                me.setState({
                    fname : form.fname,
                    lname : form.lname,
                    contact: form.contact,
                    relation: form.relation,
                    address: form.address

                })


                alert("You made it! Check console for data");
            }
        });

        if (!SpeechRecognition) {
            conversationalForm.addRobotChatResponse(
                "SpeechRecognition not supported, so <strong>no</strong> Microphone here."
            );
        }

        if (!SpeechSynthesisUtterance) {
            conversationalForm.addRobotChatResponse(
                "SpeechSynthesisUtterance not supported, so <strong>no</strong> Microphone here."
            );
        }

    }

    fnameHandler = (e) => {
        this.setState({
            fname: e.target.value,

        });
    }
    lnameHandler = (e) => {
        this.setState({
            lname: e.target.value,

        });
    }
    contactHandler = (e) => {
        this.setState({
            contact: e.target.value,

        });
    }
    relationHandler = (e) => {
        this.setState({
            relation: e.target.value,

        });
    }
    addressHandler = (e) => {
        this.setState({
            address: e.target.value,

        });
    }

    submitEmergency = (e) => {

        e.preventDefault();
        const data = {
            fName: this.state.fname,
            lName: this.state.lname,
            contact: this.state.contact,
            email: this.state.email,
            relation: this.state.relation,
            address: this.state.address,

        }
        console.log(data)
        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3001/emergency', data,
            {
                params: {
                    userEmail: localStorage.getItem('email')
                }
            })
            .then(response => {
                console.log("Status Code : ", response.status);
                if (response.status === 200) {
                    this.setState({
                        onclick: true,
                        resultmsg: "Emergency contact saved Successfully"
                    })

                } else {
                    this.setState({
                        onclick: false
                    })
                }
            })
            .catch(error => {
                this.setState({
                    onclick: false,
                    errormsg: error.response.data
                })
            });
    }

    render() {
        let nextPage = null;
        console.log(this.state.fname);
        if(this.state.onclick){
            nextPage = <Redirect to="/patient/dashboard" />
        }
        return (
            <div className="col-md-12">
                <div className="col-md-6 form-box">
                   
                            <div className="col-md-12 form-heading-box">
                                <h2 className="form-heading">Emergency Contact</h2>
                            </div>
                            <div className="col-md-12 content-box" >
                                <form role="form" onSubmit={this.submitEmergency} id='form'>
                                    <div className="col-md-12">
                                        <div class=" form-group col-md-12">
                                            <label>First Name</label>
                                            <div class="input-group">
                                                <span class="input-group-addon icon-input"><span class="glyphicon glyphicon-user"></span></span>
                                                <input class="form-control right-border-none" placeholder="First Name" type="text" name="fname" cf-questions="Hello, please tell me the first name of your emergency contact?" onChange={this.fnameHandler} defaultValue={this.state.fname} />
                                                <span class="input-group-addon transparent icon-input"><i class="fa fa-microphone icon-size"></i></span>
                                            </div>
                                        </div>
                                        </div>
                                        <div className="col-md-12">
                                        <div class=" form-group col-md-12">
                                            <label>Last Name</label>
                                            <div class="input-group">
                                                <span class="input-group-addon icon-input"><span class="glyphicon glyphicon-user"></span></span>
                                                <input class="form-control right-border-none" placeholder="Last Name" type="text" name="lname" cf-questions="Hello, please tell me the last name of {fname}?" onChange={this.lnameHandler} defaultValue={this.state.lname} />
                                                <span class="input-group-addon transparent icon-input"><i class="fa fa-microphone icon-size"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div class=" form-group col-md-6">
                                            <label>Contact Number</label>
                                            <div class="input-group">
                                                <span class="input-group-addon icon-input"><span class="fa fa-address-book"></span></span>
                                                <input class="form-control right-border-none" placeholder="Contact Number" type="text" name="contact" onChange={this.contactHandler} cf-questions="Hello, please tell me contact number of {fname}?" defaultValue={this.state.contact} />
                                                <span class="input-group-addon transparent icon-input"><i class="fa fa-microphone icon-size"></i></span>
                                            </div>
                                        </div>
                                        <div class=" form-group col-md-6">
                                            <label>Relation</label>
                                            <div class="input-group">
                                                <span class="input-group-addon icon-input"><span class="glyphicon glyphicon-user"></span></span>
                                                <input class="form-control right-border-none" placeholder="Relation" type="text" name="relation" cf-questions="Hello, please tell your relation with {fname}?" onChange={this.relationHandler} defaultValue={this.state.relation} />
                                                <span class="input-group-addon transparent icon-input"><i class="fa fa-microphone icon-size"></i></span>
                                            </div>
                                        </div>
                                    </div>

                                        <div class="col-md-12">
                                        <div class=" form-group col-md-12">
                                            <label>Address</label>
                                            <div class="input-group">
                                                <span class="input-group-addon icon-input"><span class="fa fa-address-card"></span></span>
                                                <input class="form-control right-border-none" placeholder="Address" type="text" name="address" cf-questions="Hello, please tell me address of {fname}?" onChange={this.addressHandler} defaultValue={this.state.address} />
                                                <span class="input-group-addon transparent icon-input"><i class="fa fa-microphone icon-size"></i></span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                    <div className="col-md-5"></div>
                                    <div className="col-md-3">
                                        <button type="submit" className="btn btn-success btn-lg" style={{ marginTop: "15px" }}>Submit</button>
                                    </div>
                                    </div>
                                </form>
                            </div>
                       
                </div>
                <div className="col-md-5">
                    {/* <form id="form">
                        <input id="cardHolderName" name="cardHolderName" type="text" cf-questions="Hello, please tell me card holder's name?" />
                        
                        <fieldset cf-questions="Choose your favourite color, <span style='background: blue;'>blue</span>, <span style='background: red;'>red</span> or <span style='background: yellow;'>yellow</span>">
                            <input type="radio" cf-label="blue" value="blue" id="1" />
                            <input type="radio" cf-label="red" value="red" id="2" />
                            <input type="radio" cf-label="yellow" value="yellow" id="3" />
                        </fieldset>
                    </form> */}
                    <div id="cf-context" role="cf-context" cf-context></div>
                </div>
            </div>
        )
    }
}


export default EmergencyContact;