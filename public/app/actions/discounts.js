var base64 = require('base-64');
import {
    api,
    get_headers
} from '../helpers/api';

const API = api();

export const GET_DISCOUNTS_OK = 'GET_DISCOUNTS_OK'
export const GET_DISCOUNTS_FAILED = 'GET_DISCOUNTS_FAILED'


export function get_discounts(token = '') {
    return function (dispatch) {
        API
            .get("discounts/collection", {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: GET_DISCOUNTS_OK,
                    data: response.data
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: GET_DISCOUNTS_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}