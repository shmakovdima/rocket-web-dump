var base64 = require('base-64');
import {
    api,
    get_headers
} from '../helpers/api';

const API = api();

export const GET_CHAT_OK = 'GET_CHAT_OK'
export const GET_CHAT_FAILED = 'GET_CHAT_FAILED'
export const SEND_MSG_OK = 'SEND_MSG_OK'
export const SEND_MSG_FAILED = 'SEND_MSG_FAILED'
export const LOAD_NEW_MSG_OK = 'LOAD_NEW_MSG_OK'

export const CLEAN_UNREAD_COUNT = 'CLEAN_UNREAD_COUNT'
export const ENABLE_AUTO_UPDATE = 'ENABLE_AUTO_UPDATE'

export const SWITCH_CHAT_PAGE = 'SWITCH_CHAT_PAGE'


export function get_chat(token = '', page = 1) {
    page = Number(page)
    return function (dispatch) {
        API
            .get("messages/collection?page=" + page, {
                headers: Object.assign(get_headers(), {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: GET_CHAT_OK,
                    data: response.data
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: GET_CHAT_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function send_message(token = '', text = '') {
    return function (dispatch) {
        API
            .post("messages", {
                message: {
                    body: text
                }
            },  {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: SEND_MSG_OK,
                    data: response.data
                })
                dispatch({
                    type: SWITCH_CHAT_PAGE,
                    data: 1
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: SEND_MSG_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function pull_new_messages(token = '') {
    let page = 1
    return function (dispatch) {
        API
            .get("messages/collection?page=" + page, {
                headers: Object.assign(get_headers(), {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: LOAD_NEW_MSG_OK,
                    data: response.data
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: GET_CHAT_FAILED,
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
            type: SWITCH_CHAT_PAGE,
            data: page
        })
    }
}
export function clear_unread_count() {
    return function (dispatch) {
        dispatch({
            type: CLEAN_UNREAD_COUNT,
            data: null
        })
    }
}

export function enable_auto_update() {
    return function (dispatch) {
        dispatch({
            type: ENABLE_AUTO_UPDATE,
            data: null
        })
    }
}