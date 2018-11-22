import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
// import webToast from 'middlewares/webToast';

export default function configureStore(reducer, state) {
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk),
        // applyMiddleware(webToast),
    )(createStore);


    return createStoreWithMiddleware(reducer, state);
}
