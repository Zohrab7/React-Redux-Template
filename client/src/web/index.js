import React from 'react';
import {render} from 'react-dom';
import App from './App.js';
import { Provider } from 'react-redux';

import store from 'store';

import 'styles';

export default render(
    <Provider store={store}>
        <App />
    </Provider>
 , document.querySelector('#root'))
