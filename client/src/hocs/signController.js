import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
    signUp,
} from 'actions';

export default () => WrappedComponent => {
    class SignController extends Component {
        signUp = () => new Promise((resolve, reject) => {
            const { dispatch, sign: { email, phone, password, name} } = this.props;

            dispatch(signUp({
                user: {
                    email,
                    phone,
                    password,
                    name,
                }
            }))
            // .then(data=>resolve(data))
            // .catch(()=>reject())
        })

        render() {
            const {
                signUp,
            } = this;

            return (
                <WrappedComponent
                    {...this.props}
                    sign_controller={{
                        signUp,
                    }}
                />
            )
        }
    }

    return connect(({sign}) => ({sign}))(SignController)
}
