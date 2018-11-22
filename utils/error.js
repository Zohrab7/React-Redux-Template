const ERROR_CODES = {
    DATABASE_ERROR: 'DATABASE_ERROR',
    USER_NOT_FOUND: 'USER_NOT_FOUND',
    USERNAME_EXIST: 'USERNAME_EXIST',

    WRONG_LOGIN: 'WRONG_LOGIN',
    WRONG_USER_FIELDS: 'WRONG_USER_FIELDS',

    PERMISSION_DENIED: 'PERMISSION_DENIED',

    SIGN_USERNAME_BUSY: 'SIGN_USERNAME_BUSY',
    SIGN_EMAIL_BUSY: 'SIGN_EMAIL_BUSY',
    NO_USER_TO_ACTIVATE: 'NO_USER_TO_ACTIVATE',
    SIGN_USER_NOT_VALIDATED: 'SIGN_USER_NOT_VALIDATED',
    SIGN_USER_TO_RECOVERY_NOT_FOUND: 'SIGN_USER_TO_RECOVERY_NOT_FOUND',
    WRONG_EMAIL_CONFIRMATION_CODE: 'WRONG_EMAIL_CONFIRMATION_CODE',
};

function Errorer() {
    return {
        send: code => {
            this.res.json({
                status: 'error',
                code: ERROR_CODES[code],
            })
        },
        apply: (req, res, next) => {
            this.res = res;
            next();
        },
    }
}

module.exports = Errorer
