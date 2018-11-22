const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    first_name: String,
    last_name: String,
    photo: String,

    email: String,
    email_code: String,
    password: String,
    status: String,
});

UserSchema.statics.checkAuth = ({block = true} = {}) => (req,res, next) => {
    const jwt_token = req.cookies.jwt_token;

    if (!jwt_token && block) return res.json({
        status: 'error',
        code: 'NOT_AUTHORIZED',
    });

    try {
        req.user = jwt.verify(jwt_token, process.env.JWT_TOKEN)
    }catch (err) {
        console.error('error in checkAuth ',err);
    }

    next()
};

UserSchema.statics.isValid = function(user = {}) {
    return user.username && user.email && user.password
}

UserSchema.methods.getJwtToken = function() {
    const { _id, username, email, password } = this;

    return jwt.sign(
        {
            _id,
            username,
            email,
            password,
        },
        process.env.JWT_TOKEN
    );
}

UserSchema.methods.sendActivationEmail = function() {
    return new Promise(async (resolve, reject) => {
        const { error, body } = await sender.email({
            to: this.email,
            subject: 'Welcome to New you!',
            text: "Hello!\nWelcome to New you! To continue please follow this link: " + process.env.API_URL + "/users/" + this._id + "/activate/" + this.email_code
        });

        if (error) console.error('Error in sending email', error);
    });
}

UserSchema.methods.editSelf = function(user) {
    return new Promise(async (resolve, reject) => {
        let self = this;

        const editableFields = [
            'first_name',
            'last_name',
            'photo',
        ];

        editableFields.forEach(field => {
            self[field] = user[field] || self[field]
        })

        switch (true) {
            case user.username !== self.username:
                const existing_user = await mongoose.model('User').findOne({
                    username: user.username,
                })

                if (existing_user) {
                    return reject('USERNAME_EXIST')
                }else {
                    self.username = user.username
                }
                break;
        }

        const saved_user = await self.save().catch(err => {
            console.error('Error in editing me', err);
        });

        resolve(saved_user)
    });
};

UserSchema.methods.sendRecoveryEmail = function() {
    return new Promise(async (resolve, reject) => {
        const { error, body } = await sender.email({
            to: this.email,
            subject: 'Recovery in New you!',
            text: "Hello!\nTo recover your account please follow this link: " + process.env.API_URL + "/users/" + this._id + "/reset-password/" + this.email_code
        });

        if (error) console.error('Error in sending email', error);
    });
};

UserSchema.statics.findUser = function(user_id) {
    return new Promise((resolve, reject) => {
        mongoose.model('User').findOne({
            _id: user_id,
        }).exec((err, user) => {
            if (err || !user) return reject('USER_NOT_FOUND')

            resolve(user)
        })
    });
}

UserSchema.statics.mePopulate = () => ([]);

const User = mongoose.model('User', UserSchema);
module.exports = User
