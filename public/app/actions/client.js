import cookie from 'react-cookie'
var base64 = require('base-64');
import {
    api,
    get_headers,
    APN_TOKEN,
    API_URL,
    DEVICE_ID
} from '../helpers/api';

const API = api();

export const REGISTER_OK = 'REGISTER_OK'
export const REGISTER_FAILED = 'REGISTER_FAILED'

export const VERIFY_SMS_CODE_OK = 'VERIFY_SMS_CODE_OK'
export const VERIFY_SMS_CODE_FAILED = 'VERIFY_SMS_CODE_FAILED'

export const AUTH_START = 'AUTH_START'
export const AUTH_OK = 'AUTH_OK'
export const AUTH_FAILED = 'AUTH_FAILED'

export const LOG_OUT = 'LOG_OUT'
export const ACCESS_DENIED = 'ACCESS_DENIED'

export function register(phone) {
    return function (dispatch) {
        API
            .post("devices/register", {
                phone: phone,
                apn_token: APN_TOKEN
            }, {
                headers: get_headers()
            })
            .then((response) => {
                dispatch({
                    type: REGISTER_OK,
                    data: response.data
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: REGISTER_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}

export function verify_sms_code(challenge_id, code) {
    return function (dispatch) {
        API
            .patch("sms_verifications/" + challenge_id + "/verify", {
                code: code,
                apn_token: APN_TOKEN
            }, {
                headers: get_headers()
            })
            .then((response) => {
                dispatch({
                    type: VERIFY_SMS_CODE_OK,
                    data: Object.assign({}, response.data, {
                        device_id: DEVICE_ID
                    })
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: VERIFY_SMS_CODE_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}

export function login(login, app_code) {
    return function (dispatch) {
        API
            .get("login/?apn_token=" + APN_TOKEN , {
                headers: Object.assign(get_headers(), {
                    'Authorization' : 'Basic ' + base64.encode(login + ':' + app_code)
                })
            })
            .then((response) => {
                dispatch({
                    type: AUTH_OK,
                    data: response.data
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: AUTH_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}

export function auth_required(msg) {

    return function (dispatch) {
        dispatch({
            type: ACCESS_DENIED,
            data: {
                message: msg
            }
        })
    }
}
export function log_out(msg = '') {
    cookie.remove('rocket_login')
    cookie.remove('device')
    return function (dispatch) {
        dispatch({
            type: LOG_OUT,
            data: msg
        })
    }
}


