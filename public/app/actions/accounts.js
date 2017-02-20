var base64 = require('base-64');
import {
    api,
    get_headers
} from '../helpers/api';

const API = api();

// cards
export const CHANGE_PIN_VERIFY_CARD_NUMBER_OK = 'CHANGE_PIN_VERIFY_CARD_NUMBER_OK'
export const CHANGE_PIN_FINAL_OK = 'CHANGE_PIN_FINAL_OK'
export const BLOCK_CARD_OK = 'BLOCK_CARD_OK'
export const UNBLOCK_CARD_OK = 'UNBLOCK_CARD_OK'
export const REISSUE_CARD_OK = 'REISSUE_CARD_OK'
export const LOAD_CARD_LIMITS_OK = 'LOAD_CARD_LIMITS_OK'
export const SET_CARD_LIMITS_OK = 'SET_CARD_LIMITS_OK'
export const LOAD_ALL_EXTRACTS_OK = 'LOAD_ALL_EXTRACTS_OK'
export const LOAD_EXTRACT_OK = 'LOAD_EXTRACT_OK'
export const RESET_EXTRACT = 'RESET_EXTRACT'

// safe
export const CLOSE_SAFE_OK = 'CLOSE_SAFE_OK'

// failed
export const RESET_CARD_SAFE_ACTIONS = 'RESET_CARD_SAFE_ACTIONS'
export const UPDATE_CARD_FAILED = 'UPDATE_CARD_FAILED'
export const UPDATE_SAFE_FAILED = 'UPDATE_SAFE_FAILED'


// cards
export function verify_card_number(token = '', plastic_id = '', card_number = '') {
    return function (dispatch) {
        API
            .get("plastics/check?plastic_id=" + plastic_id + '&card_number=' + card_number, {
                headers: Object.assign(get_headers(), {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: CHANGE_PIN_VERIFY_CARD_NUMBER_OK,
                    data: response.data,
                    plastic_token: plastic_id
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function set_pin_code(token = '', plastic_id = '', check_id = '', pin_code = '') {
    return function (dispatch) {
        API
            .patch("plastics/" + plastic_id + "/pin", {
                plastic: {
                    pin: pin_code,
                    check_id: check_id
                }
            }, {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: CHANGE_PIN_FINAL_OK,
                    data: response.data
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function block_card(token = '', card_token = '') {
    return function (dispatch) {
        API
            .post("accounts/" + card_token + "/block", {}, {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: BLOCK_CARD_OK,
                    data: response.data,
                    card_token: card_token
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function unblock_card(token = '', card_token = '') {
    return function (dispatch) {
        API
            .post("accounts/" + card_token + "/activate", {}, {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: UNBLOCK_CARD_OK,
                    data: response.data,
                    card_token: card_token
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function reissue_card(token = '', card_token = '') {
    return function (dispatch) {
        API
            .post("accounts/" + card_token + "/reissue", {}, {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: REISSUE_CARD_OK,
                    data: response.data,
                    card_token: card_token
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function load_card_limits(token = '', plastic_id = '') {
    return function (dispatch) {
        API
            .get("plastics/" + plastic_id + "/sexy_limits", {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: LOAD_CARD_LIMITS_OK,
                    data: response.data,
                    plastic_token: plastic_id
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function update_card_limits(token = '', plastic_id = '', params = {}) {
    return function (dispatch) {
        API
            .patch("plastics/" + plastic_id + "/sexy_limits", {
                limits: params
            }, {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: SET_CARD_LIMITS_OK,
                    data: response.data,
                    plastic_token: plastic_id
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function load_available_extracts(token = '', card_token = '', params = {}) {
    return function (dispatch) {
        API
            .get("accounts/" + card_token + "/extracts", {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: LOAD_ALL_EXTRACTS_OK,
                    data: response.data,
                    card_token: card_token
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function load_extract(token = '', card_token = '', kind = '') {
    return function (dispatch) {
        API
            .post("accounts/" + card_token + "/extracts", {
                kind: kind
            }, {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: LOAD_EXTRACT_OK,
                    data: response.data,
                    card_token: card_token
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_CARD_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}
export function reset_extract() {
    return function (dispatch) {
        dispatch({
            type: RESET_EXTRACT
        })
    }
}

export function reset() {
    return function (dispatch) {
        dispatch({
            type: RESET_CARD_SAFE_ACTIONS
        })
    }
}

// safe
export function close_safe(token = '', safe_token = '') {
    return function (dispatch) {

        API
            .post("accounts/" + safe_token + "/close", {}, {
                headers: Object.assign(get_headers(), {
                    'Authorization': 'Token token=' + token
                })
            })
            .then((response) => {
                dispatch({
                    type: CLOSE_SAFE_OK,
                    data: response.data,
                    safe_token: safe_token
                })
            })
            .catch((err) => {
                console.error(err);
                dispatch({
                    type: UPDATE_SAFE_FAILED,
                    data: {
                        handle: err,
                        response: err.response.data
                    }
                })
            })
    }
}