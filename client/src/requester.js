import axios from 'axios';

export const requestWrap = function(status_branch) {
    return action => new Promise(async (resolve) => {
        const { dispatch } = this.props;

        dispatch({
            type: 'SET_STATUS',
            [status_branch]: 'is_loading',
        });

        const data = await dispatch(action);

        dispatch({
            type: 'SET_STATUS',
            [status_branch]: 'is_ready',
        });

        resolve(data);
    });
}

export const wpRequest = axios.create({
    baseURL: process.env.APP_URL + '/wp-json/wp/v2',
});

export default axios.create({
    baseURL: process.env.API_URL,
});
