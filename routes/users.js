const router = require('express').Router();

const User = require('../models/User');

const errorer = require('../utils/error')();
const { createHash } = require('../utils');

router.get('/logout', function(req, res) {
    res.clearCookie('jwt_token');
    res.redirect('/');
});

router.use(errorer.apply)

router.post('/login', async (req, res) => {
    const { user } = req.body;

    const me = await User.findOne({
        password: createHash(user.password),
        $or: [
            {email: user.mixed_username},
            {username: user.mixed_username},
        ],
    }).populate(User.mePopulate())

    if (!me) return errorer.send('WRONG_LOGIN');

    if (me.status === 'validated') {
        res.cookie('jwt_token', me.getJwtToken(), { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });

        res.json({
            status: 'ok',
            me,
        });
    }else {
        errorer.send('SIGN_USER_NOT_VALIDATED');
    }
});

router.post('/', async (req, res) => {
    const { user } = req.body;
    if (!User.isValid(user)) return errorer.send('WRONG_USER_FIELDS');

    const existing_user = await User.findOne({
        $or: [
            {username: user.username},
            {email: user.email},
        ]
    }) || {}

    if (existing_user.email === user.email) return errorer.send('SIGN_EMAIL_BUSY');
    if (existing_user.username === user.username) return errorer.send('SIGN_USERNAME_BUSY');

    const me = new User({
        ...user,
        password: createHash(user.password),
        status: 'not_validated',
        email_code: createHash(),
    });

    me.save((err, user) => {
        if (err || !user) return errorer.send('DATABASE_ERROR')

        user.sendActivationEmail();

        res.json({
            status: 'ok',
        });
    })
});

router.post('/activation-email/:email', (req, res) => {
    User.findOne({
        status: 'not_validated',
        email: req.params.email,
    }).exec((err, me) => {
        if (err || !me) return errorer.send('NO_USER_TO_ACTIVATE')

        me.sendActivationEmail();

        res.json({
            status: 'ok',
        });
    })
})

// router.get('/:user_id/profile', (req, res) => {
//     User.findOne({
//         _id: req.params.user_id,
//     }).populate(User.userPopulate()).exec((err, user) => {
//         if (err) return errorer.send('DATABASE_ERROR');
//
//         if (!user) return errorer.send('USER_NOT_FOUND');
//
//         res.json({
//             status: 'ok',
//             user,
//         });
//     })
// })

router.get("/:user_id/activate/:email_code", async (req, res) => {
    const user = await User.findOne({
        _id: req.params.user_id,
        email_code: req.params.email_code,
    }).catch(err => {
        console.error('DATABASE_ERROR');
    });

    if (!user) return errorer.send('WRONG_EMAIL_CONFIRMATION_CODE');

    user.status = 'validated';
    user.email_code = null;

    user.save((err, user) => {
        if (err || !user) return send('DATABASE_ERROR');

        res.cookie('jwt_token', user.getJwtToken(), { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.redirect('/profile-wizard');
    });
});

router.post('/forgot', async (req, res) => {
    const { user } = req.body;

    const existing_user = await User.findOne({
        email: user.email,
    }).catch(err => {
        console.error('DATABASE_ERROR');
    })

    if (!existing_user) return errorer.send('SIGN_USER_TO_RECOVERY_NOT_FOUND')

    existing_user.email_code = createHash();
    existing_user.save((err, user) => {
        if (err || !user) return send('DATABASE_ERROR');

        user.sendRecoveryEmail();

        res.json({
            status: 'ok',
        })
    })
});

router.get("/:user_id/reset-password/:email_code", async (req, res) => {
    const user = await User.findOne({
        _id: req.params.user_id,
        email_code: req.params.email_code,
    }).catch(err => {
        console.error('DATABASE_ERROR');
    });

    console.log('USER', user);

    if (!user || !req.params.email_code) return errorer.send('WRONG_RESET_PASSWORD_CODE');

    user.status = 'recovery';
    user.email_code = null;
    user.password = null;

    user.save((err, user) => {
        if (err || !user) return send('DATABASE_ERROR')

        res.cookie('jwt_token', user.getJwtToken(), { maxAge: 365 * 24 * 60 * 60 * 1000, httpOnly: true });
        res.redirect('/login');
    });
});

router.use(User.checkAuth())

router.get('/me', (req, res) => {
    // User.find({})
    // .exec((err, users) => {
    //     users.forEach(user => {
    //         user.remove()
    //     })
    // })
    User.findOne({
        _id: req.user._id,
    }).populate(User.mePopulate()).exec((err, me) => {
        if (err || !me) return errorer.send('DATABASE_ERROR');

        if ((me || {}).status === 'not_validated') {
            errorer.send('SIGN_USER_NOT_VALIDATED');
        }else {
            res.json({
                status: 'ok',
                me,
            });
        }
    })
});

router.post('/me', (req, res) => {
    const { user } = req.body;

    User.findOne({
        _id: req.user._id,
    }).exec((err, me) => {
        if (err || !me) {
            return errorer.send('DATABASE_ERROR');
        }

        me.editSelf(user)
        .then(me => me.populate(User.mePopulate()).execPopulate())
        .then(me => {
            res.json({
                status: 'ok',
                me,
            });
        })
        .catch(err => errorer.send(err))
    })
});

// router.delete('/:user_id/friend', (req, res) => {
//     User.findOne({
//         _id: req.params.user_id,
//     }).exec(async (err, user) => {
//         if (err || !user) {
//             return errorer.send('DATABASE_ERROR')
//         }
//
//         User.findOne({
//             _id: req.user._id,
//         }).exec((err, me) => {
//             if (err || !me) {
//                 return errorer.send('DATABASE_ERROR')
//             }
//
//             Promise.all([
//                 user.deleteFriend(req.user._id),
//                 me.deleteFriend(req.params.user_id),
//             ])
//             .then(data => {
//                 return data[1].populate(User.mePopulate()).execPopulate()
//             })
//             .then(me => {
//                 res.json({
//                     status: 'ok',
//                     me,
//                 });
//             })
//             .catch(err => errorer.send(err))
//         });
//     });
// });

// router.post('/:user_id/friend', (req, res) => {
//     User.findOne({
//         _id: req.params.user_id,
//     }).exec(async (err, user) => {
//         if (err || !user) {
//             return errorer.send('DATABASE_ERROR')
//         }
//
//         user = await user.requestFriendship(req.user._id).catch(err => errorer.send(err))
//
//         if (!user) return
//
//         res.json({
//             status: 'ok',
//             user,
//         });
//     })
// });

// router.post('/:user_id/accept-friendship', (req, res) => {
//     User.findOne({
//         _id: req.params.user_id,
//     }).exec((err, user) => {
//         if (err || !user) {
//             return errorer.send('DATABASE_ERROR')
//         }
//
//         User.findOne({
//             _id: req.user._id,
//         }).exec((err, me) => {
//             if (err || !me) {
//                 return errorer.send('DATABASE_ERROR')
//             }
//
//             me.acceptFriendship({kind: 'friend_requests', id: req.params.user_id})
//             .then(me => {
//                 return Promise.all([user.addFriend({user: me}), me.addFriend({user})])
//             })
//             .then(data => {
//                 if (!data[0] || !data[1]) return errorer.send('DATABASE_ERROR')
//
//                 return data[1].populate(User.mePopulate()).execPopulate()
//             })
//             .then(me => {
//                 res.json({
//                     status: 'ok',
//                     me,
//                 });
//             })
//             .catch(err => {
//                 errorer.send(err)
//             })
//         });
//     });
// });

router.post('/:user_id/set', async (req, res) => {
    const { user } = req.body;

    const me = await User.findOne({
        _id: req.user._id,
    }).catch(err => console.error('DATABASE_ERROR'))

    const setAbleFields = [
        'username',
        'password',
        'email',
    ];

    setAbleFields.forEach(field => {
        switch (field) {
            case 'password':
                if (!me[field] && user[field]) me[field] = createHash(user[field]);
                break;
            case 'email':
                if (!me[field] && user[field]) {
                    me[field] = user[field];
                    me.sendActivationEmail();
                }
                break;
            default:
                if (!me[field] && user[field]) me[field] = user[field];
        }
    });

    if (User.isValid(me)) {
        if (me.email_code) {
            me.status = 'not_validated';
        }else {
            me.status = 'validated';
        }
    }

    me.save((err, user) => {
        if (err || !user) errorer.send('DATABASE_ERROR')

        res.json({
            status: 'ok',
            me: user,
        });
    });
});

module.exports = router
