import React, { Component } from 'react';
import { connect } from 'react-redux';

export default ({type}) => WrappedComponent => {
    class FieldChangeHandler extends Component {
        onChange = ({name, value}) => {
            const { dispatch }  = this.props;

            dispatch({
                type,
                name,
                value,
            });
        }
        render() {
            return <WrappedComponent {...this.props} handleFieldChange={this.onChange} />
        }
    }

    return connect(null)(FieldChangeHandler)
}
