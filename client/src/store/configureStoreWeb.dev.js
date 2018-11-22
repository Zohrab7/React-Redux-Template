import { createStore, applyMiddleware, compose } from 'redux';
import thunk        from 'redux-thunk';
import { createLogger } from 'redux-logger';
import { composeWithDevTools } from 'redux-devtools-extension';
// import webToast from 'middlewares/webToast';

export default function configureStore(reducer, state) {
    const createDevStoreWithMiddleware = composeWithDevTools(
        applyMiddleware(thunk),
        // applyMiddleware(webToast),
        applyMiddleware(createLogger()),
    )(createStore);

    return createDevStoreWithMiddleware(reducer, state);;
}
