import req , {wpRequest} from 'requester';
import { setCookie } from 'utils';

const request = promise => new Promise(async (resolve, reject) => {
    const res = await promise;

    if (!res) return reject({code: 'INTERNET_ERROR'});

    const { data } = res;

    if (data.status === 200 || data.status === 'ok') {
        resolve(data)
    }else {
        reject(data)
    }
});

const withErrorDispatch = dispatch => (cb = err => err) => err => {
    dispatch({
        type: 'ERROR',
        code: err.code,
    });

    cb(err);
}

export const signUp = ({user}) => dispatch => new Promise(resolve => {
    request(req.post('/users', user))
    .then(data => {

        dispatch({
            type: 'SET_ME',
            me: data.user
        })
        return data
    })
    .catch(withErrorDispatch(dispatch)())
    .then(data => resolve(data))
});
