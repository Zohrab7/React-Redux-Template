import { createStore, applyMiddleware, compose } from 'redux';
import thunk        from 'redux-thunk';
import logger from '../middlewares/logger';

export default function configureStore(reducer, state, params) {
    // const toast = configureToaster(params.toast);
    const createStoreWithMiddleware = compose(
        applyMiddleware(thunk.withExtraArgument({

            // toast,
        })),
        applyMiddleware(logger())
    )(createStore);


    return createStoreWithMiddleware(reducer, state);
}
