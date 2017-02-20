var base64 = require('base-64');
import {
    api,
    get_headers
} from '../helpers/api';

const API = api();

export const GET_TRANSACTIONS_OK = 'GET_TRANSACTIONS_OK'
export const GET_TRANSACTIONS_FAILED = 'GET_TRANSACTIONS_FAILED'
export const SWITCH_TRANSACTIONS_PAGE = 'SWITCH_TRANSACTIONS_PAGE'


export function get_transactions(token = '', page = 1, per_page = 10) {
    page = Number(page)
    per_page = Number(per_page)
    return function (dispatch) {
        // operations/nano_feed?page=5&per_page=30
        API
            .get("operations/nano_feed/?page=" + page + '&per_page=' + per_page, {
                headers: Object.assign(get_headers(), {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: GET_TRANSACTIONS_OK,
                    data: response.data
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: GET_TRANSACTIONS_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}

export function switch_page(page = 1) {
    return function (dispatch) {
        dispatch({
            type: SWITCH_TRANSACTIONS_PAGE,
            data: page
        })
    }
}