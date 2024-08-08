const twilio = require('twilio');
const client = twilio(process.env.TWILIO_AUTH, process.env.TWILIO_NUM);

const sendSms = (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: '+15418358547', 
        to: phoneNumber,
    });
};

module.exports = sendSms;
