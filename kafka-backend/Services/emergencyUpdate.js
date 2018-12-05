var { mongoose } = require('./../db/mongoose');
var { Emergency } = require('./../models/emergency');

function handle_request(data, callback) {
    console.log("In handle request:" + JSON.stringify(data));
    Emergency.findOneAndUpdate({
        userEmail: data.userEmail
    }, { $set : data } , function (error, result) {
        if (error) {
            callback(null, "Error in Profile Update");
        } else {
            callback(null, result);
        }
    }
    )
}

exports.handle_request = handle_request;