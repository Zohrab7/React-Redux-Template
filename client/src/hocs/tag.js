import React from 'react';

export default (base_tag = 'div') => WrappedComponent => ({tag = base_tag, ...rest}) => <WrappedComponent {...rest} Tag={tag} />
