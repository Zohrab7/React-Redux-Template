import { combineReducers } from 'redux';

import me from 'reducers/me';
import sign from 'reducers/sign';

export default combineReducers({
    me,
    sign,
})
