import reducer from 'reducers';
import initialState from 'store/initialState';
import configureStore from 'store/configureStore';

export default configureStore(reducer, {...initialState});
