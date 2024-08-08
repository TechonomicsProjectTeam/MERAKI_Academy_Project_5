const twilio = require('twilio');
const client = twilio('ACd3d682fbc313f529a98aa0d31d336af7', '3fe0c8c542262885d1be87184b652d33');

const sendSms = (phoneNumber, message) => {
    return client.messages.create({
        body: message,
        from: '+15418358547', 
        to: phoneNumber,
    });
};

module.exports = sendSms;
