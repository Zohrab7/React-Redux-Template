const mailgun = require('mailgun-js')({apiKey: process.env.MAILGUN_KEY , domain: process.env.MAILGUN_DOMAIN});

const email = ({to, subject, text}, cb) => {
    if (!subject) return;

    return new Promise((resolve, reject) => {
    	mailgun.messages().send({
    		from: 'New you <noreply@explogen.com>',
    		to,
    		subject,
    		text,
    	}, (error, body) => {
            resolve({error, body});

    		if (cb) {
    			cb({error, body});
    		}
    	});
    });
};
module.exports = {
    email,
};
